import { Home, LocalLibrary, Subscriptions, VideoStable } from "@mui/icons-material";
import React from "react";


const SideBar = () => {
  return (
    <div className="flex flex-col items-center justify-start gap-5 h-[655px]  text-[10px] mt-2 w-20">
     <div className="flex flex-col w-20 h-16 cursor-pointer items-center justify-center rounded-lg text-white hover:bg-[hsl(0,0%,18.82%)]">
        <Home htmlColor="white"/>
        <p>Home</p>
      </div>
     <div className="flex flex-col w-20 h-16 cursor-pointer items-center justify-center rounded-lg text-white hover:bg-[hsl(0,0%,18.82%)]">
        <VideoStable htmlColor="white"/>
        shorts
      </div>
     <div className="flex flex-col w-20 h-16 cursor-pointer items-center justify-center rounded-lg text-white hover:bg-[hsl(0,0%,18.82%)]">
        <Subscriptions htmlColor="white"/>
        subscriptions
      </div>
     <div className="flex flex-col w-20 h-16 cursor-pointer items-center justify-center rounded-lg text-white hover:bg-[hsl(0,0%,18.82%)]">
        <LocalLibrary htmlColor="white"/>
        You
      </div>
    </div>
  );
};

export default SideBar;
