import React from 'react'

const Video = ({video}) => {
    const {thumbnail,title,description,owner,duration,_id} = video;
  return (
    <div className='w-[337px] h-[333px] flex flex-col mb-5 mr-4'>
      <div className='w-[337px] h-[200px]  z-10'>
       <img src={thumbnail} alt="thumbnail" className='w-full h-full rounded-2xl'/>
      </div>
      <div className='flex-1 flex'>
        <div className='flex mt-5 items-start justify-center h-full w-10'>
            <div className='w-10 h-10'>
                <img src={owner?.avatar} alt="avatar" className='w-full h-full rounded-full' />
            </div>
        </div>
        <div className='flex-1 mt-5 ml-4'>
            <div className='text-lg text-white'>
                {title}
            </div>
            <div className='mt-1 text-base text-zinc-200'>
                <p>{owner?.username}</p>
                <p>1.1M views .  1 year ago</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Video
