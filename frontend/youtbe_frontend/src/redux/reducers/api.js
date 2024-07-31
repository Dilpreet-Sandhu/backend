import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react';


export const productsApi = createApi({
    reducerPath : "productsApi",
    baseQuery : fetchBaseQuery({baseUrl: "http://localhost:3000/api/v1/"}),
    endpoints : (builder) => ({
        getVideos : builder.query({
            query : () => ({
                url : 'video',
                credentials : "include"
            })
        })
    })
})

export const  {useGetVideosQuery} =  productsApi;