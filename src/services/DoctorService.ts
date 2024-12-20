import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {createAppointments, DoctorsItemInerface} from "../types/doctorsType";






export interface fetchALlDDoctorsProps{
    limit?: number,
    page?: number,
    role?: string,
}


export const doctorAPI = createApi({
    reducerPath: "doctorAPI",
    baseQuery: fetchBaseQuery({baseUrl: `${process.env.REACT_APP_SERVER_HOST}`}),
    endpoints: (build)=>({
        fetchAllDoctors: build.query<DoctorsItemInerface[], fetchALlDDoctorsProps>({
            query: (e)=>({
                url: "/doctors",
                params: {
                    ...e
                }
            })
        }),
        createAppointments: build.mutation<any, createAppointments>({
            query: (newDoctor) => ({
                url: "/appointments",
                method: "POST",
                body: newDoctor,
            }),
        }),
    })
})