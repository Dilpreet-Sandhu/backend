import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrpyt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      trim: true,
      index: true,
      required : true
    },
    avatar: {
      type: String,
      required : true
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    methods : {

    }
    , timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrpyt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrpyt.compare(password, this.password)
}

// userSchema.method("isPasswordCorrect",async function isPasswordCorrect(password) {
//   return bcrpyt.compare(password,this.password)
// })

userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET || "c1a30rv8PCNc4RYv1SvRRKfm05ievH",
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY  || "1d",
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET || "iSbVj6kaVMVbTPzm77d8dCxQj88r1",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d",
    },
  );
};

export const User = model("User", userSchema);
