import {Router} from 'express';
import { getAllLikedVideos, toggleVideoLike } from '../controllers/like.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';

export const LikeRouter = Router();

LikeRouter.route('/:videoId').post(verifyJWT,toggleVideoLike)
LikeRouter.route('/getAllLikedVids').get(verifyJWT,getAllLikedVideos)