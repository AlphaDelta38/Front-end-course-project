import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {endpointsPath} from "../routes";
import {specialityInterface} from "../types/specialityType";
import {fetchAllPropsInterface} from "./NewsService";


export const specialityAPI = createApi({
    reducerPath: "specialityAPI",
    baseQuery: fetchBaseQuery({baseUrl: `${process.env.REACT_APP_SERVER_HOST}`}),
    endpoints: (build)=>({
        getAllSpeciality: build.query<specialityInterface[], fetchAllPropsInterface>({
            query: (params)=>({
                url: endpointsPath.speciality,
                params: {
                    ...params
                }
            })
        }),
        createSpeciality: build.mutation<specialityInterface, string>({
            query: (value)=>({
                url: endpointsPath.speciality,
                method: "POST",
                body: {
                    name: value
                }
            })
        }),
        updateSpeciality: build.mutation<number, specialityInterface>({
            query: (data)=>({
                url: endpointsPath.speciality,
                method: "PUT",
                body: {
                    ...data
                }
            })
        }),
        deleteSpeciality: build.mutation<number, number>({
            query: (id)=>({
                url: `${endpointsPath.speciality}/${id}`,
                method: "DELETE",
            })
        }),
        getAmountSpeciality: build.query<number, any>({
            query: ()=>({
                url: endpointsPath.specialityAmount,
            })
        }),
    })
})