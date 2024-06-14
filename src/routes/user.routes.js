import {Router} from 'express';
import { RegisterUser } from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js';

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

