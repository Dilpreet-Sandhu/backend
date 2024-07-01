import { asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js'; 
import {ApiResponse} from '../utils/ApiResponse.js'; 
import { PlayList} from '../models/playlist.model.js';


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


export const getUserPlayList = asyncHandler(async (req,res) => {


    const user = req.user?._id;

    if (!user) {
        throw new ApiError(400,"you are not logged in to view playlists")
    }

    const playList = await PlayList.find({owner : user});
    

    if (!playList) {
        throw new ApiError(400,"no playlist found")
    }


    res
    .status(200)
    .json(
        new ApiResponse(200,playList,"playlists fetched successFully")
    )

})

export const getPlayListById = asyncHandler(async (req,res) => {

    const {playListId} = req.params;

    const playList = await PlayList.findOne({_id : playListId}).populate("videosId","videoFile thumbnail  title views duration")

    if (!playList)  {
        throw new ApiError(400,"playList id is not valid")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200,playList,"fetched playList by id successfully")
    )

})

export const addVideoToPlayList = asyncHandler(async (req,res) => {

    const {playListId,videos} = req.params;

    const playList = await PlayList.findOne({ _id : playListId});

    playList.videosId.push(playListId);
    await playList.save({validateBeforeSave : false})
    

    res
    .status(200)
    .json(
        new ApiResponse(200,playList,"added videos to the playlist")
    )

})

export const deletePlayList = asyncHandler(async (req,res) => {

    const {playListId} = req.params;

    if (!playListId) {
        throw new ApiError(400,"no playlist id found")
    }

    const playList = await PlayList.deleteOne({_id : playListId});

    if (!playList) {
        throw new ApiError(400,"no playList found to delete")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200,{},"playlist deleted successfully")
    )


})

export const deleteVideoFromPlayList = asyncHandler(async (req,res) => {

    const {playListId,video} = req.params;

    if (!playListId && !video) {
        throw new ApiError(400,"playlist id or video id is not given")
    }

    const playList = await PlayList.findById(playListId);

    if (!playList) {
        throw new ApiError(400,"no playlist found for the given id")
    }

    const videoIndex = playList.videosId.findIndex(item => item == video);

    playList.videosId.splice(videoIndex,1)

    await playList.save({validateBeforeSave: true})


    res
    .status(200)
    .json(
        new ApiResponse(200,playList,"video deleted from the playList")
    )



})
export const updatePlayList = asyncHandler(async (req,res) => {
    
    const {playListId} = req.params;
    const {name,description} = req.body;

    if (!name && description) {
        throw new ApiError(400,"name and description are required")
    }

    const playList = await PlayList.findByIdAndUpdate(playListId,
        {
            $set : {
                name,
                description
            }
        },
        {
            new : true
        }
    )

    if (!playList) {
        throw new ApiError(400,"no playList found")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200,playList,"updated successfully")
    )

})