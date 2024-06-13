import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
export const app = express();



app.use(cors({
    origin : process.env.CORS_ORIGIN
}))
app.use(express.json({limit: '17kb'}));
app.use(express.urlencoded());
app.use(cookieParser())