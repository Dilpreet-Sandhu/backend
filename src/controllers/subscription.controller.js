import { asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js'; 
import {ApiResponse} from '../utils/ApiResponse.js'; 
import {Subscription} from '../models/subscription.model.js'


const toggleSubscription = asyncHandler(async (req,res) => {

    const {channelId} = req.params;
    const userId = req.user?._id;
    let unsubscribe;

    let subscription = await Subscription.findOne({channel : channelId})

    if (!subscription) {
        subscription = await Subscription.create({
            channel : channelId,
            subscriber : userId
        })
    }
    else {
        subscription = await Subscription.deleteOne({channel : channelId})   
    }
    

    
    res
    .status(200)
    .json(
        new ApiResponse(200,subscription,"subscribed sucessfully")
    )



})