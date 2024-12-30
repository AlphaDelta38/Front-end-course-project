import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {NewsItemInterface} from "../types/newsType";
import {endpointsPath} from "../routes";




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
                url : endpointsPath.news,
                params: {
                    ...e
                }
            })
        })
    })

})


