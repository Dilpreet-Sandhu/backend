import { asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js'; 
import {ApiResponse} from '../utils/ApiResponse.js'; 
import {PlayList} from '../models/playlist.model.js';


export const createPlayList = asyncHandler(async (req,res) => {


    const {name,description,videosId} = req.body;
    const user = req.user?._id;

    if ([name,description,videosId].some(item => item == "")) {
        throw new ApiError(400,"all fields are required")
    }

    const playList = await PlayList.create({
        name,
        description,
        videosId,
        owner : user
    })
    
    if (!playList) {
        throw new ApiError(400,"couldn't generate playlist")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200,playList,"playlist added successfully")
    )


})


