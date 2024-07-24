import { Router } from "express";
import {
  LogOut,
  loginUser,
  RegisterUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImg,
  getUserChannelProfile,
  getWatchHistory,
  addVideoToWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

export const userRouter = Router();

userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  RegisterUser,
);

userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, LogOut);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/changePassword").post(verifyJWT, changeCurrentPassword);
userRouter.route("/user").get(verifyJWT, getCurrentUser);
userRouter.route("/updateDetails").patch(verifyJWT, updateAccountDetails);
userRouter
  .route("/updateAvatar")
  .patch(verifyJWT, upload.single("avatar"), updateAvatar);
userRouter
  .route("/updateCoverImg")
  .patch(verifyJWT, upload.single("coverImage"), updateCoverImg);
userRouter.route("/c/:username").get(verifyJWT, getUserChannelProfile);
userRouter.route("/history").get(verifyJWT, getWatchHistory);
userRouter.route('/addToWatchHistory/:videoId').post(verifyJWT,addVideoToWatchHistory)