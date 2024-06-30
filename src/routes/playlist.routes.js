import { Router } from 'express';
import {addVideoToPlayList, createPlayList, deletePlayList, deleteVideoFromPlayList, getPlayListById, getUserPlayList, updatePlayList} from '../controllers/playlist.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js'

export const PlayListRouter = Router();

PlayListRouter.route('/add').post(verifyJWT,createPlayList)
PlayListRouter.route('/:playListId').get(verifyJWT,getUserPlayList)
PlayListRouter.route('/byId/:playListId').get(getPlayListById)
PlayListRouter.route('/addVid/:playListId/:videos').put(addVideoToPlayList)
PlayListRouter.route('/del/:playListId').delete(deletePlayList)
PlayListRouter.route('/delSinVid/:playListId/:video').patch(deleteVideoFromPlayList)
PlayListRouter.route('/update/:playListId').patch(updatePlayList)