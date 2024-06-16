import { v2 as cloudinary } from "cloudinary";
import fs, { copyFileSync } from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dofbmh6sw",
  api_key: process.env.CLOUDINARY_API_KEY || 591147192118157,
  api_secret: process.env.CLOUDINARY_API_SECRET || '-4TiRTkHqoq5g_F63b4AYGaDEAM',
});

export const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) throw new Error("there is no localPath");

    const res = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localPath)
    return res;
  } catch (error) {
    fs.unlinkSync(localPath);
    console.log("couldn't upload to cloudinary" + error);  
    return null;
  }
};

export const deleteFileOnCloudinary = async (localpath) => {
  try {
    if (!localpath) throw new Error("there is no localpath");

    const arrayOfSlash = localpath.split('/');
    const lastElement = arrayOfSlash.at(-1);
    const arrayOfDots = lastElement.split('.');
    const publicId = arrayOfDots[0];

    const res = await cloudinary.uploader.destroy(publicId,{
      invalidate : true
    })

    return res
  } catch (error) {
    console.log("couldn't delete the file" + error.message)
  }
}
