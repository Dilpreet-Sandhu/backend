
import mongoose from "mongoose";
import {DB_NAME} from '../constants.js';


const dbConnect = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);

        console.log(`\n database connected`)
    } catch (error) {
        console.log('MongoDb connection failed' + error)
    }
}
export default dbConnect;