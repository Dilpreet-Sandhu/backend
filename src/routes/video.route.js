import {
  deleteVideo,
  getVideoById,
  publishVideo,
  updateVideoDetails,
  togglePublishStatus,
  getAllVideos,
  getSubscribedVideos,
  addViewsCount,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

export const videoRouter = Router();


videoRouter
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
      {
        name: "thumbnail",
        maxCount: 1,
      },
      {
        name: "videoFile",
        maxCount: 1,
      },
    ]),
    verifyJWT,
    publishVideo,
  );
videoRouter.use(verifyJWT);
videoRouter.route("/getsubbvid").get(getSubscribedVideos);
videoRouter
  .route("/:videoId")
  .get(getVideoById)
  .patch(upload.single("thumbnail"), updateVideoDetails)
  .delete(deleteVideo);

videoRouter.route("/publish/status/:videoId").patch(togglePublishStatus);

videoRouter.route('/view/:videoId').post(addViewsCount)
