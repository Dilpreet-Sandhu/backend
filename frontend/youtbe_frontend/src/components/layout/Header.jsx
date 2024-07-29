import {
  Menu,
  NotificationsOutlined,
  Search,
  SettingsVoice,
  Videocam
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import youtube from "/youtube.png";

const Header = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");


  function handleSearch() {

  }

  function handleVoiceSearch() {

  }

  function createNewVideo() {

  }



  return (
    <div className="w-full flex items-center justify-between px-5">
      <div className="w-1/3">
        <IconButton>
          <Menu htmlColor="white" sx={{ width: "45px", heigth: "25px" }} />
        </IconButton>
        <IconButton onClick={() => navigate('/')} sx={{ marginLeft: "-15px" }}>
          <img src={youtube} width={64} height={49} />
        </IconButton>
      </div>
      <div className="w-1/3 flex items-center justify-center">
        <div className="flex items-center justify-between w-[600px] h-10 rounded-full bg-black border-gray-500 border-[0.5px]">
          <div className="flex-1">
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full ml-[2px] pl-1 text-sm rounded-xl h-[35px] bg-black border-0 outline-0 text-white"
            />
          </div>
          <button onClick={handleSearch} className="w-[70px] flex items-center justify-center bg-[hsl(0,0%,18.82%)] rounded-r-full h-[37px]">
            <Search htmlColor="white" className=" scale-[10px]" />
          </button>
        </div>
        <div className="ml-5">
          <button onClick={handleVoiceSearch} className="w-[45px] h-[45px] mt-0 rounded-full bg-[hsl(0,0%,18.82%)]">
            <SettingsVoice htmlColor="white" />
          </button>
        </div>
      </div>
      <div className="w-1/3 gap-2 flex items-center justify-end">
        <div>
          <button onClick={createNewVideo} className="w-[40px] h-[40px] mt-2 rounded-full hover:bg-[hsl(0,0%,18.82%)]">
            <Videocam htmlColor="white" />
          </button>
        </div>
        <div>
          <button className="w-[40px] h-[40px] mt-2 rounded-full hover:bg-[hsl(0,0%,18.82%)]">
            <NotificationsOutlined htmlColor="white" />
          </button>
        </div>
        <div>
          <button className="w-[40px] h-[40px] mt-2 rounded-full">
            <img
              src={
                "https://images.unsplash.com/photo-1721775551177-3c6da363fdf0?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              className="w-full h-full rounded-full"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
