import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {endpointsPath} from "../routes";
import {specialityInterface} from "../types/specialityType";


export const specialityAPI = createApi({
    reducerPath: "specialityAPI",
    baseQuery: fetchBaseQuery({baseUrl: `${process.env.REACT_APP_SERVER_HOST}`}),
    endpoints: (build)=>({
        getAllSpeciality: build.query<specialityInterface[], any>({
            query: ()=>({
                url: endpointsPath.speciality,
            })
        }),
    })
})