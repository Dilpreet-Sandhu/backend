import {Schema,model} from 'mongoose';


const commentSchema = new Schema({
    content : {
        type : String,
        required : true
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref  : "User"
    },
    video : {
        type : Schema.Types.ObjectId,
        ref  : "Video"
    }
})


export const Comment = model("Comment",commentSchema)