import {Schema,model} from 'mongoose';


const likeSchema = new Schema({
    video : {
        type : Schema.Types.ObjectId,
        ref : "Video",
        required : true
    },
    likedBy : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
},{timestamps : true})


export const Like = model("Like",likeSchema);