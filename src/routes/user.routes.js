import {Router} from 'express';
import { LogOut, loginUser, RegisterUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateAvatar, updateCoverImg, getUserChannelProfile } from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
import {verifyJWT} from '../middlewares/auth.middleware.js'

export const userRouter = Router();

userRouter.route('/register').post(upload.fields([
    {
        name : 'avatar',
        maxCount : 1
    },
    {
        name : 'coverImage',
        maxCount : 1
    }
]),RegisterUser)


userRouter.route('/login').post(loginUser)
userRouter.route('/logout').post(verifyJWT,LogOut)
userRouter.route('/refresh-token').post(refreshAccessToken);
userRouter.route('/changePassword').post(verifyJWT,changeCurrentPassword)
userRouter.route('/user').get(verifyJWT,getCurrentUser)
userRouter.route('/updateDetails').post(verifyJWT,updateAccountDetails)
userRouter.route('/upateAvatar').post(verifyJWT,updateAvatar)
userRouter.route('/updateCoverImg').post(verifyJWT,updateCoverImg)
userRouter.route('/channel').get(getUserChannelProfile)