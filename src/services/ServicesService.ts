import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {serviceItems} from "../types/serviceType";
import {endpointsPath} from "../routes";
import {fetchAllPropsInterface} from "./NewsService";






export const serviceAPI = createApi({
    reducerPath: "serviceAPI",
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
        fetchAllService: build.query<serviceItems[], fetchAllPropsInterface>({
            query: (e)=>({
                url: endpointsPath.services,
                params: {...e}
            })
        }),
        createService: build.mutation<serviceItems, string>({
            query: (value)=>({
                url: endpointsPath.services,
                method: "POST",
                body: {
                    service: value
                }
            })
        }),
        updateService: build.mutation<number, serviceItems>({
            query: (data)=>({
                url: endpointsPath.services,
                 method: "PUT",
                body: {
                    ...data
                }
            })
        }),
        deleteService: build.mutation<number, number>({
            query: (id)=>({
                url: `${endpointsPath.services}/${id}`,
                method: "DELETE",
            })
        }),
        getServiceAmount: build.query<number, any>({
            query: ()=>({
                url: endpointsPath.serviceAmount,
            })
        }),
    })
})