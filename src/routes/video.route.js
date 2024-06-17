import {publishVideo} from '../controllers/video.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { Router } from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js'

export const videoRouter = Router();

videoRouter.route('/uploadVideo').post(upload.fields([
    {
        name : "thumbnail",
        maxCount : 1
    }, 
    {
        name : "videoFile",
        maxCount : 1
    }
]),verifyJWT,publishVideo)


