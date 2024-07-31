import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { videos } from '../helper/example'
import Video from '../components/shared/video'
import { useGetVideosQuery } from '../redux/reducers/api'

const Home = () => {


  const {data,isError,error} = useGetVideosQuery();


console.log(data)


  return (
    <div className='flex-1 grid grid-cols-4  grid-rows-2 mt-5 ml-10'>
      {
        data?.data.map((video,idx) => {
          return (
            <Video video={video} key={idx}/>
          )
        })
      }
    </div>
  )
}

export default AppLayout()(Home)
