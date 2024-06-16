import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import  jwt from 'jsonwebtoken';
import mongoose from 'mongoose';


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

    const {username,fullname,email,password} = req.body;
    
    if ([username,fullname,email,password].some(item => item == '')) {
        throw new ApiError(400,"all fields are compulsory")
    }

    const existingUser = await User.findOne({
        $or : [{username},{email}]
    })

    if (existingUser) {
        throw new ApiError(409,'user already exists')
    }

    const avatarLocalPath = req?.files?.avatar[0]?.path;
    // const coverImageLocalPath = req?.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }else {coverImageLocalPath = ""}
    
    if (!avatarLocalPath) throw new ApiError(400,"avatar is required");

    const avatarImg = await uploadOnCloudinary(avatarLocalPath);
    let coverImg;
    if (coverImageLocalPath !== "") {

         coverImg = await uploadOnCloudinary(coverImageLocalPath);
    }
   


    const user = await User.create({
        username,
        avatar : avatarImg?.url,
        coverImage  : coverImg?.url || "",
        fullname,
        password,
        email 

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

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

export const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    console.log(await user.isPasswordCorrect(password))
   const isPasswordValid = await user.isPasswordCorrect(password);

   if (!isPasswordValid) {
    throw new ApiError(401, "wrong password")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,

    }

     res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

export const LogOut = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }


     res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

export const refreshAccessToken = asyncHandler(async (req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) throw new ApiError(401,"unautorized request");
   
    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET || "c1a30rv8PCNc4RYv1SvRRKfm05ievH");
    
        const user = await User.findById(decodedToken?._id);
    
        if (!user) throw new ApiError(401,"invalid refresh token");
    
        if (user.refreshToken !== incomingRefreshToken) throw new ApiError(402,"refresh token is expired");
    
        const options = {
            httpsOnly : true,
            sequrity  : true
        }
    
        const {accessToken,newRefreshToken} = await generateAccessAndRefereshTokens(user._id);
    
         res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse( 
                200,
                {
                    accessToken,
                    newRefreshToken
                }
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid refresh token")
    }

})

export const changeCurrentPassword = asyncHandler(async (req,res) => {
    //get old and new password from body
    //find the user based on old password
    //update the old password with new password
    const {oldPassword,newPassword} = req.body;
    
    const user = await User.findById(req.user?._id);

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) {
        throw new ApiError(400,"invalid password")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave : false});

    res.json(
        new ApiResponse(200,{

        },
    "password changed successfully")
    )
})

export const getCurrentUser = asyncHandler(async (req,res) => {

    const user = req.user;
    res.status(200).json(
        new ApiResponse(200,{user},"current user fetched succesfully")
    )
})

export const updateAccountDetails = asyncHandler(async (req,res) => {


    const {fullname,email} = req.body;

    if (!fullname || !email) {
        throw new ApiError(400,"both fullname and email are required")
    }

    const user = await User.findByIdAndUpdate(req.user._id,{
        $set : {
            fullname,
            email
        }
    },{new : true}).select("-password")

    res.status(200)
    .json(
        new ApiResponse(200,{user},"account details updated")
    )
})

export const updateAvatar = asyncHandler(async (req,res) => {
    const avatarPath = req.file.path;


    if (!avatarPath) throw new ApiError(400,"no avatarPath img found");

    const avatar = await uploadOnCloudinary(avatarPath);

    if (!avatar.url) throw new ApiError(400,"error while uploading avatar");

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                avatar : avatar.url
            }
        },
        {new : true}
    ).select('-password')


    res
    .status(200)
    .json(
        new ApiResponse(
            200, {
                user,
            },
            "avatar image changed successfully"
            
        )
    )



})
export const updateCoverImg = asyncHandler(async (req,res) => {
    const coverImageUrl = req.file.path;


    if (!coverImageUrl) throw new ApiError(400,"no coverImageUrl img found");

    const coverImage = await uploadOnCloudinary(coverImageUrl);

    if (!coverImage.url) throw new ApiError(400,"error while uploading coverImage");

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                coverImage : coverImage.url
            }
        },
        {new : true}
    ).select('-password')

    res
    .status(200)
    .json(
        new ApiResponse(
            200, {
                user,
            },
            "coverImage changed successfully"
            
        )
    )

})

export const getUserChannelProfile = asyncHandler(async (req,res) => {

    const {username} = req.params;

    if (!username?.trim()) throw new ApiError(400,"username not found");

    const channel = User.aggregate([
        {
            $match : {
                username : username.toLowerCase()
            },
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : "_id",
                foreignField  : "channel",
                as : "subscribers"
            }
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : "_id",
                foreignField  : "subscriber",
                as : "subscribedTo"
            }
        },
        {
            $addFields : {
                subscribersCount : {
                    $size : "subscribers"
                },
                subscribedToCount : {
                    $size : "subscribedTo"
                },
                isSubscribed : {
                    $cond : {
                        if : {
                            $in : [req.user?._id,"$subscribers.subscriber"],
                            then : true,
                            else : false
                        }
                    }
                }
            }
        },
        {
            $project : {
                fullName : 1,
                username : 1,
                subscribersCount : 1,
                subscribedToCount : 1,
                isSubscribed : 1,
                avatar  : 1,
                coverImage : 1,
                email : 1

            }
        }
            
        
    ])


    if (!channel.length) {
        throw new ApiError(400,"channel does not exist")
    }

    res.status(200)
    .json(
        new ApiResponse(200,channel[0],"channel fetched Successfully")
    )
})

export const getWatchHistory = asyncHandler(async (req,res) => {
    const user = await User.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup : {
                from : "videos",
                localField : "watchHistory",
                foreignField : "_id",
                as : "watchHistory",
                pipeline : [
                    {
                        $lookup : {
                            from : "users",
                            localField : "owner",
                            foreignField : "_id",
                            as : "owner",
                            pipeline : [
                                {
                                    $project : {
                                        fullname : 1,
                                        username  : 1,
                                        avatar : 1
                                    }
                                },
                                {
                                    $addFields :{
                                        owner  :{
                                            $first  : "$owner"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ])
    res.
    status(200)
    .json(
        new ApiResponse(200,
            user[0].watchHistory
        )
    )
})