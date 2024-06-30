import { asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js'; 
import {ApiResponse} from '../utils/ApiResponse.js'; 
import {Subscription} from '../models/subscription.model.js'


export const toggleSubscription = asyncHandler(async (req,res) => {

    const {channelId} = req.params;
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400,"you should be logged in to subscribe")
    }

    let subscription = await Subscription.findOne({$and : [{channel : channelId},{subscriber : userId}]})

    if (!subscription) {
        subscription = await Subscription.create({
            channel : channelId,
            subscriber : userId
        })
    }
    else{
         subscription = await Subscription.deleteOne({subscriber  : userId})  
    } 
    

    
    res
    .status(200)
    .json(
        new ApiResponse(200,subscription,"subscribed sucessfully")
    )



})


export const subscribersCount = asyncHandler(async (req,res) => {

    const {channelId} = req.params;

    const subscription = await Subscription.find({channel : channelId});

    if (!subscription) {
        res.json(new ApiResponse(400,{},"zero subscriptions"))
    }

    res
    .status(200)
    .json(
        new ApiResponse(200,subscription.length,"subscriptions fetched")
    )
})

export const subscriptionsCount = asyncHandler(async (req,res) => {

    const userId = req.user?._id;

    const subscription = await Subscription.find({subscriber : userId});

    res
    .status(200)
    .json(
        new ApiResponse(200,subscription.length,"subscriptions fethced sucessfully")
    )
    
})