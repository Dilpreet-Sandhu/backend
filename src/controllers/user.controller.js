import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';


export const RegisterUser = asyncHandler(async function(req,res) {
    //get the data from the frontend
    //validations - data should not be empty
    //check if user already exists by username and email
    //check for images and avatar
    //upload to cloudinary
    //create user object - upload to database
    //remove password and refresh token from the response 
    //check for user creation
    //return res

    const {username,fullName,email,password} = req.body;
    
    if ([username,fullName,email,password].some(item => item == '')) {
        throw new ApiError(400,"all fields are compulsory")
    }

    const existingUser = User.findOne({
        $or : [{username},{email}]
    })

    if (existingUser) {
        throw new ApiError(409,'user already exists')
    }

    const avatarLocalPath = req?.files?.avatar[0]?.path;
    const coverImageLocalPath = req?.files?.coverImage[0]?.path;
    
    if (!avatarLocalPath) throw new ApiError(400,"avatar is required");

    const avatarImg = await uploadOnCloudinary(avatarLocalPath);
    const coverImg = await uploadOnCloudinary(coverImageLocalPath);

    const user = await User.create({
        username : username.toLowerCase(),
        avatarImg : avatarImg.url,
        coverImg  : coverImg?.url || '',
        fullName,
        password,

    })


    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500,"something went wrong while registring the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user created successfully")
    )

})