import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import {Video} from '../models/video.model.js';
import {Like} from '../models/like.model.js';
import mongoose from "mongoose";


export const getChannelStats = asyncHandler(async (req,res) => {

    //todo - total videos total subscribers total likes user profile watch history


    const user = req.user;


    const videos = await Video.find({owner : user?._id});

    if (!videos) {
        throw new ApiError(400,"you have not uploaded any video")
    }


    const totalViews = await Video.aggregate([
        {
            $match : {
                onwer : new mongoose.Types.ObjectId(user?._id)
            }
        },
        {
            $group : {
                _id : "$owner",
                totalViews : {
                    $sum : "$views"
                }
            }
        }
    ])
    


    const subscribers = await Subscription.find({channel : user?._id});

    const totalSubscribers = subscribers.length;


    const totalVideos = videos.length;

    const likes = await Like.aggregate([
        {
            $lookup : {
                from : 'videos',
                localField : "video",
                foreignField : "_id",
                as : "videoDetails"
            }
        },
        {
            $unwind : "$videoDetails"
        },
        {
            $match  : {
                "videoDetails.onwer" : new mongoose.Types.ObjectId(user?._id)
            }
        },
        {
            $group : {
                _id : "$videoDetails.owner",
                totalLikes : {
                    $sum : 1
                }
            }
        }
    ])


    return res.status(200).json(
        new ApiResponse(200,{
            totalViews : totalViews[0] ? totalViews[0].totalViews : 0,
            totalSubscribers,
            totalVideos,
            totalLikes : likes[0] ? likes[0].totalLikes : 0,
        })
    )



})

export const getAllVideosUploadedByChannel = asyncHandler(async (req,res) => {


    const user = req.user;

    if (!user) {
        throw new ApiError(401,"you are not logged in")
    }

    const videos = await Video.find({owner : user?._id}).select("-isPublished");

    if (!videos) {
        throw new ApiError(400,"you have not uploaded any video")
    }

    return res.status(200).json(
        new ApiResponse(200,videos,"user videos fetched successfully")
    )
})