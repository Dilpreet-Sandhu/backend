import {Router} from 'express';
import { LogOut, loginUser, RegisterUser, refreshAccessToken } from '../controllers/user.controller.js';
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


userRouter.route('/login').post(loginUser);
userRouter.route('/logout').post(verifyJWT,LogOut)
userRouter.route('/refresh-token').post(refreshAccessToken)
