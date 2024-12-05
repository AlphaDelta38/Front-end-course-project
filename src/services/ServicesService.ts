import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {serviceItems} from "../types/serviceType";






export const serviceAPI = createApi({
    reducerPath: "serviceAPI",
    baseQuery: fetchBaseQuery({baseUrl: `${process.env.REACT_APP_SERVER_HOST}`}),
    endpoints: (build)=>({
        fetchAllService: build.query<serviceItems[], any>({
            query: ()=>({
                url: "/services",
            })
        }),
    })
})