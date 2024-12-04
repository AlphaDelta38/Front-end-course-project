import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {NewsItemInterface} from "../types/newsType";




export enum sortForwards{
    ascending = "ascending",
    descending = "descending",
}

export interface fetchAllPropsInterface{
    limit?: number,
    page?: number,
    sortForward?:sortForwards,
}


export const newsAPI = createApi({
    reducerPath: 'newsAPI',
    baseQuery: fetchBaseQuery({baseUrl: `${process.env.REACT_APP_SERVER_HOST}`}),
    endpoints: (build)=>({
        fetchAllNews: build.query<NewsItemInterface[], fetchAllPropsInterface>({
            query: (e)=>({
                url :"/news",
                params: {
                    ...e
                }
            })
        })
    })

})


