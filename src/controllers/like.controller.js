import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";

export const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  if (!videoId && !userId) {
    throw new ApiError(400, "video id and user id are required");
  }

  let like = await Like.findOne({
    $and: [{ video: videoId }, { likedBy: userId }],
  });

  if (!like) {
    like = await Like.create({
      video: videoId,
      likedBy: userId,
    });
  } else {
    like = await Like.deleteOne({
      $and: [{ video: videoId }, { likedBy: userId }],
    });
  }

  res.status(200).json(new ApiResponse(200, like, "liked successfully"));
});

export const getAllLikedVideos = asyncHandler(async (req, res) => {

    const userId = req.user?._id;

    const likes = await Like.find({likedBy : userId}).populate("video","videoFile thumbnail  title views duration")

    if (!likes) {
        throw new ApiError(400,"you have 0 liked videos")
    }


    res
    .status(200)
    .json(
        new ApiResponse(200,likes,"likes videos fethced succesffuly")
    )


});
