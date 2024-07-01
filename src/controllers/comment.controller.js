import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";


export const addComment = asyncHandler(async (req,res) => {

    const {videoId} = req.params;
    const userId = req.user?._id;
    const {content} = req.body;


    if (!userId && !videoId) {
        throw new ApiError(400,"video id and user id are required")
    }

    const comment = await Comment.create({
        content,
        owner : userId,
        video : videoId
    })

    if (!comment) {
        throw new ApiError(400,"couldn't comment on the video")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200,comment,"commented successfully on video")
    )

})

export const viewAllVideoComments = asyncHandler(async (req,res) => {

    const {videoId} = req.params;

    if (!videoId) {
        throw new ApiError(400,"video id is required")
    }

    const comment = await Comment.find({video : videoId}).populate("owner","avatar username").select("-video")

    if (!comment) {
        throw new ApiError(400,"no comments found")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200,comment,"comments fetched")
    )

})

export const updateComment = asyncHandler(async (req,res) => {

    const {content} = req.body;
    const {commentId} = req.params;

    if (!content) {
        throw new ApiError(400,"please provide content")
    }

    if (!commentId && !userId) {
        throw new ApiError(400,"video id and user id are required")
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(400,"no comment found")
    }

    comment.content = content;
    await comment.save({validateBeforeSave : false})

    res
    .status(200)
    .json(
        new ApiResponse(200,comment,"comment updated")
    )

})

export const deleteComment = asyncHandler(async (req,res) => {

    const {commentId} = req.params;

    if (!commentId) {
        throw new ApiError(400,"no comment id found")
    }

    const comment = await Comment.deleteOne({ _id : commentId})

    if (!comment) {
        throw new ApiError(400,"no comment found")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200,comment,"comment deleted successfully")
    )

    
})

