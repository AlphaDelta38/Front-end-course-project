import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {newsChangeRequestProps, NewsItemInterface} from "../types/newsType";
import {endpointsPath} from "../routes";




export enum sortForwards{
    ascending = "ascending",
    descending = "descending",
}

export interface fetchAllPropsInterface{
    limit?: number,
    page?: number,
    all?: string,
    sortForward?:sortForwards,
}


export const newsAPI = createApi({
    reducerPath: 'newsAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_SERVER_HOST}`,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem("token")
            if(token){
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (build)=>({
        fetchAllNews: build.query<NewsItemInterface[], fetchAllPropsInterface>({
            query: (e)=>({
                url : endpointsPath.news,
                params: {
                    ...e
                }
            })
        }),
        fetchAmountOfNews: build.query<number, any>({
            query: ()=>({
                url: endpointsPath.newsAmount,
            })
        }),
        changeNews: build.mutation<any, newsChangeRequestProps>({
            query: (e)=>({
                url : endpointsPath.news,
                method: "PUT",
                body: {...e}
            })
        }),
        createNews: build.mutation<any, Omit<newsChangeRequestProps, "id">>({
            query: (e)=>({
                url : endpointsPath.news,
                method: "POST",
                body: {...e}
            })
        }),
        deleteNews: build.mutation<number, number>({
            query: (id) => ({
                url: `${endpointsPath.news}/${id}`,
                method: "DELETE",
            }),
        }),
    })

})


