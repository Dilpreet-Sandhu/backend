import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {deleteFileOnCloudinary, uploadOnCloudinary} from '../utils/cloudinary.js';
import {Video} from '../models/video.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {getVideoDurationInSeconds } from 'get-video-duration' 

export const publishVideo = asyncHandler(async (req,res) => {
    //data from the frontend
    //check if any data is missing 
    //take video and thumbnail upload on cloudinary
    //create new video using video model
    //check for video
    //return res

    const {title,description} = req.body;

    if (!title && !description) {
            throw new ApiError(400,"title and description are required")
    }

    const videoFilePath = req.files?.videoFile[0]?.path;
    const duration = await getVideoDurationInSeconds(videoFilePath)
    const videoFile = await uploadOnCloudinary(videoFilePath);



    const thumbnailPath = req.files?.thumbnail[0]?.path;
    const thumbnail = await uploadOnCloudinary(thumbnailPath);

    if (!thumbnail && !videoFile) {
        throw new ApiError(400,"thumbnail and video are required")
    }

    const video = await Video.create({
        videoFile : videoFile?.url,
        thumbnail : thumbnail?.url,
        title,
        description,
        duration : duration,
        owner : req.user?._id
    })

    res.status(200)
    .json(
        new ApiResponse(200,video)
    )

})


export const getVideoById = asyncHandler(async (req,res) => {
    const {videoId} = req.params;


    const video = await Video.findById(id);

    if (!video) throw new ApiError(400,"id does not match any video")
    
    res.
    status(200)
    .json(
        new ApiResponse(200,video)
    )
})

export const updateVideoDetails = asyncHandler(async (req,res) => {

    const { description,title } = req.body;
    const {videoId} = req.params;


    if (!description && !title) {
        throw new ApiError(400,"should provide description or title")
    }

    const video = await Video.findById(videoId);
    let thumbnailpath = req.file?.path || null;
    let thumbnail;
    if (thumbnailpath !== null) {
     thumbnail = await uploadOnCloudinary(thumbnailpath);
    
        await deleteFileOnCloudinary(video.thumbnail)
    }
    else {
        thumbnail = video.thumbnail;
    }
    video.description = description;
    video.title = title;
    if (thumbnail) {
        video.thumbnail = thumbnail;
    }
    await video.save({validateBeforeSave : false})
    

    


    res.status(200)
    .json(
        new ApiResponse(200,video)
    )
    


})

export const deleteVideo = asyncHandler(async (req,res) => {
    const {videoId} = req.params;

    const video = await Video.deleteOne({_id : videoId});

    res
    .status(200)
    .json(
        new ApiResponse(200,video)
    )

})

export const togglePublishStatus = asyncHandler(async (req,res) => {
    const {videoId} = req.params;

    const video = await Video.findById(videoId);
    video.isPublished = false ? true : false;
    await video.save({validateBeforeSave : false})

})