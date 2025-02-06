import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {endpointsPath} from "../routes";
import {ratingItem} from "../types/ratingType";
import {fetchAllPropsInterface} from "./NewsService";


export const ratingAPI =  createApi({
    reducerPath: "ratingAPI",
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
        createRating: build.mutation<ratingItem, Omit<ratingItem, "doctor" | "patient" | "id">>({
            query: (data)=>({
                url: endpointsPath.rating,
                body: data,
                method: "POST"
            })
        }),
        getAllRatings: build.query<ratingItem[], fetchAllPropsInterface>({
            query: (params)=>({
                url: endpointsPath.rating,
                params: params,
            })
        }),
        getOneRating: build.query<Omit<ratingItem, "doctor" | "patient">, number>({
            query: (id)=>({
                url:`${ endpointsPath.rating}/${id}`,
            })
        }),
        getAmountOfRating: build.query<number, any>({
            query: ()=>({
                url: endpointsPath.ratingAmount,
            })
        }),
        deleteRating: build.mutation<number, number>({
            query: (id)=>({
                url: `${endpointsPath.rating}/${id}`,
                method: "DELETE",
            })
        }),
    })
})