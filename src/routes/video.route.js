import {deleteVideo, getVideoById, publishVideo, updateVideoDetails,togglePublishStatus, getAllVideos} from '../controllers/video.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { Router } from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js'

export const videoRouter = Router();

videoRouter.route('/allVids').get(getAllVideos)


videoRouter.use(verifyJWT)

videoRouter.route('/').post(upload.fields([
    {
        name : "thumbnail",
        maxCount : 1
    }, 
    {
        name : "videoFile",
        maxCount : 1
    }
]),verifyJWT,publishVideo)
videoRouter.route('/:videoId')
.get(getVideoById)
.patch(upload.single("thumbnail"),updateVideoDetails)
.delete(deleteVideo)

videoRouter.route('/publish/status/:videoId')
.patch(togglePublishStatus)


