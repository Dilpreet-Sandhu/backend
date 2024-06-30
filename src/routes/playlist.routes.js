import { Router } from 'express';
import {createPlayList} from '../controllers/playlist.controller.js';
import {verfiyJWT} from '../middlewares/auth.middleware.js'

export const PlayListRouter = Router();

PlayListRouter.route('/add').post(verfiyJWT,createPlayList)