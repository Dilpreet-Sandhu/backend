import dotenv from 'dotenv';
dotenv.config()
import dbConnect from "./db/index.js";



dbConnect()







// const app = express();

// (async  () => {
//     try {
//         await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);

//         app.on("error",(err) => {
//             console.log(err)
//         })

//         app.listen(process.env.PORT,() => {
//             console.log(`app is runningg on 3000 port`)
//         })

//     } catch (error) {
//         console.error(error)
//     }
// })()