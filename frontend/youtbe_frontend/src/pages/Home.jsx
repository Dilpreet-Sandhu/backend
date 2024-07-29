import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { videos } from '../helper/example'
import Video from '../components/shared/video'

const Home = () => {
  return (
    <div className='flex-1 grid grid-cols-4  grid-rows-2 mt-5 ml-10'>
      {
        videos.map((video,idx) => {
          return (
            <Video video={video} key={idx}/>
          )
        })
      }
    </div>
  )
}

export default AppLayout()(Home)
