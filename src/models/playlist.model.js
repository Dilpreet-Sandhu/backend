import {Schema,model} from 'mongoose';


const playListSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    videosId : [
        {
            type : Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
},{timestamps : true})

export const PlayList = model('PlayList',playListSchema)