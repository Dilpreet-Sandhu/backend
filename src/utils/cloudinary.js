import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) throw new Error("there is no localPath");

    const res = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    console.log("file uploaded successfully on cloudinary");
    return res;
  } catch (error) {
    fs.unlinkSync(localPath);
    console.log("couldn't upload to cloudinary" + error);  
    return null;
  }
};
