import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

export default app;
import dotenv from 'dotenv';
dotenv.config()



app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);
app.use(express.json({ limit: "17kb" }));
app.use(express.urlencoded());
app.use(cookieParser());

//route imports
import { userRouter } from "./routes/user.routes.js";
import { videoRouter } from "./routes/video.route.js";
import { SubscriptionRouter } from "./routes/subscription.routes.js";
import { PlayListRouter } from "./routes/playlist.routes.js";
import { LikeRouter } from "./routes/like.routes.js";
import { CommentRouter } from "./routes/comment.routes.js";
import {dashboardRouter} from './routes/dashboard.routes.js'

//router declaration

app.use("/api/v1/users", userRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/sub", SubscriptionRouter);
app.use("/api/v1/playlist", PlayListRouter);
app.use("/api/v1/likes", LikeRouter);
app.use("/api/v1/comment",CommentRouter);
app.use('/api/v1/dashboard',dashboardRouter)