import {Schema,Model, model} from 'mongoose';


const videoViewSchema = new Schema({
    viewer : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    video : {
        type : Schema.Types.ObjectId,
        ref  : "Video"
    }
},{timestamps : true})


export const VideoView = model('VideoView',videoViewSchema)