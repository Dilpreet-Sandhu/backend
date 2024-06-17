import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
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