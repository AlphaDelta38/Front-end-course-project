import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {createAppointments, createDoctor, DoctorsItemInerface, updateServiceInterface} from "../types/doctorsType";
import {endpointsPath} from "../routes";
import {userPasswordUpdate} from "../types/userType";






export interface fetchALlDDoctorsProps{
    limit?: number,
    page?: number,
    role?: string,
}


export const doctorAPI = createApi({
    reducerPath: "doctorAPI",
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
        fetchAllDoctors: build.query<DoctorsItemInerface[], fetchALlDDoctorsProps>({
            query: (e)=>({
                url: endpointsPath.doctors,
                params: {
                    ...e
                }
            })
        }),
        createDoctor: build.mutation<DoctorsItemInerface, createDoctor>({
            query: (newDoctor) => ({
                url: endpointsPath.doctors,
                method: "POST",
                body: newDoctor,
            }),
        }),
        updateDoctor: build.mutation<DoctorsItemInerface, updateServiceInterface>({
            query: ({id,newDoctor}) => ({
                url: endpointsPath.doctors,
                method: "PUT",
                body: {id, ...newDoctor},
            }),
        }),
        deleteDoctor: build.mutation<number, number>({
            query: (id) => ({
                url: `${endpointsPath.doctors}/${id}`,
                method: "DELETE",
            }),
        }),
        updateSelf: build.mutation<number, Omit<updateServiceInterface, "id">>({
            query: ({newDoctor}) => ({
                url: endpointsPath.doctorUpdateSelf,
                method: "PUT",
                body: newDoctor,
            }),
        }),
        getAmountDoctors: build.query<number, any>({
            query: () => ({
                url: endpointsPath.doctorsAmount,
                method: "GET",
            }),
        }),
        passwordUpdateSelf: build.mutation<number,userPasswordUpdate>({
            query: (data)=>({
                url: endpointsPath.doctorPasswordUpdate,
                method: "PUT",
                body: data
            }),
        }),
    })
})