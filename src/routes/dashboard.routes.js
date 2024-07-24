import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import { getAllVideosUploadedByChannel, getChannelStats } from '../controllers/dashboard.controller.js';

export const dashboardRouter = Router();


dashboardRouter.use(verifyJWT);

dashboardRouter.route('/stats').get(getChannelStats)
dashboardRouter.route("/videos").get(getAllVideosUploadedByChannel)