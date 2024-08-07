import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  deleteFileOnCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getVideoDurationInSeconds } from "get-video-duration";
import { Subscription } from "../models/subscription.model.js";
import { VideoView } from "../models/videoView.model.js";
import mongoose from "mongoose";

export const getAllVideos = asyncHandler(async (req, res) => {
  const { page } = req.query;

  const limit = 20;

  const skip = (page - 1) * limit;

  const video = await Video.find()
    .skip(skip)
    .limit(20)
    .select("-isPublished")
    .populate("owner", "username avatar");

  if (!video) {
    throw new ApiError(400, "no video found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, video, "fetched videos sucessfully"));
});

export const publishVideo = asyncHandler(async (req, res) => {
  //data from the frontend
  //check if any data is missing
  //take video and thumbnail upload on cloudinary
  //create new video using video model
  //check for video
  //return res

  const { title, description } = req.body;

  if (!title && !description) {
    throw new ApiError(400, "title and description are required");
  }

  const videoFilePath = req.files?.videoFile[0]?.path;
  const duration = await getVideoDurationInSeconds(videoFilePath);
  const videoFile = await uploadOnCloudinary(videoFilePath);

  const thumbnailPath = req.files?.thumbnail[0]?.path;
  const thumbnail = await uploadOnCloudinary(thumbnailPath);

  if (!thumbnail && !videoFile) {
    throw new ApiError(400, "thumbnail and video are required");
  }

  const video = await Video.create({
    videoFile: videoFile?.url,
    thumbnail: thumbnail?.url,
    title,
    description,
    duration: duration,
    owner: req.user?._id,
  });

  res.status(200).json(new ApiResponse(200, video));
});

export const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(id);

  if (!video) throw new ApiError(400, "id does not match any video");

  res.status(200).json(new ApiResponse(200, video));
});

export const updateVideoDetails = asyncHandler(async (req, res) => {
  const { description, title } = req.body;
  const { videoId } = req.params;

  if (!description && !title) {
    throw new ApiError(400, "should provide description or title");
  }

  const video = await Video.findById(videoId);
  let thumbnailpath = req.file?.path || null;
  let thumbnail;
  if (thumbnailpath !== null) {
    thumbnail = await uploadOnCloudinary(thumbnailpath);

    await deleteFileOnCloudinary(video.thumbnail);
  } else {
    thumbnail = video.thumbnail;
  }
  video.description = description;
  video.title = title;
  if (thumbnail) {
    video.thumbnail = thumbnail;
  }
  await video.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, video));
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.deleteOne({ _id: videoId });

  res.status(200).json(new ApiResponse(200, video));
});

export const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  video.isPublished = false ? true : false;
  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, { publishStatus: video.isPublished }, ""));
});

export const getSubscribedVideos = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({ subscriber: req.user?._id });

  if (!subscriptions) {
    throw new ApiError(400, "you haven't subscribed to anyone");
  }

  const subscribedChannelList = subscriptions.map((item) =>
    item.channel.toString(),
  );

  const videoList = await Video.find({
    owner: {
      $in: subscribedChannelList.map((item) => {
        return new mongoose.Types.ObjectId(item);
      }),
    },
  }).populate("owner", "username avatar");

  return res
    .status(200)
    .json(
      new ApiResponse(200, videoList, "subscribed videos fetched successfully"),
    );
});

export const addViewsCount = asyncHandler(async (req, res) => {
  const user = req.user;
  const {videoId} = req.params;

  const existingViews = await VideoView.find({
    viewer: user?._id,
    video : videoId,
  });



  if (existingViews.length <= 0) {
    const view = await VideoView.create({
      viewer: user?._id,
      video: videoId,
    });

    const video = await Video.findByIdAndUpdate(videoId, {
      $inc: { views: 1 },
    });

    return res.status(200).json(
      new ApiResponse(200,{},"added view sucessfully")
    )
  }
  return res.status(200).json(
    new ApiResponse(200,{},"you already viewed this video")
  )
});
