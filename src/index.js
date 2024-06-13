import dotenv from 'dotenv';
dotenv.config()
import dbConnect from "./db/index.js";
import app from './app.js';

dbConnect()
.then(() => {
    app.listen(process.env.PORT || 3000);

    app.on('error',(error) => console.log('express connection failed ' + error))
})
.catch((error) => console.log('mongo connection failed' + error))







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