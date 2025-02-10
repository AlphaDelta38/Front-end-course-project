import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {endpointsPath} from "../routes";
import {createAppointments} from "../types/doctorsType";
import {AppointmentInterface, AppointmentInterfaceUpdate, bookedTimeRequestInterface} from "../types/appointmentsType";
import {fetchAllPropsInterface} from "./NewsService";






export const appointmentsAPI =  createApi({
    reducerPath: "appointmentsService",
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
        getAllAppointments: build.query<AppointmentInterface[], fetchAllPropsInterface>({
            query: (params) => ({
                url: endpointsPath.appointments,
                params: params,
            }),
        }),

        getOneAppointment: build.query<AppointmentInterface, number>({
            query: (id) => ({
                url: `${endpointsPath.appointments}/${id}`,
            }),
        }),
        createAppointments: build.mutation<any, createAppointments>({
            query: (newAppointments) => ({
                url: endpointsPath.appointments,
                method: "POST",
                body: newAppointments,
            }),
        }),
        updateAppointment: build.mutation<number, AppointmentInterfaceUpdate>({
            query: (newAppointments) => ({
                url: endpointsPath.appointments,
                method: "PUT",
                body: newAppointments,
            }),
        }),
        deleteAppointment: build.mutation<number, number>({
            query: (id) => ({
                url: `${endpointsPath.appointments}/${id}`,
                method: "DELETE",
            }),
        }),
        getAppointmentsAmount: build.query<number, Omit<fetchAllPropsInterface, "all" | "limit" | "page" | "sortForward">>({
            query: (params) => ({
                url: endpointsPath.appointmentsAmount,
                params: params
            }),
        }),
        getAppointmentsBookedTime: build.query<string[], bookedTimeRequestInterface>({
            query: (params) => ({
                url: endpointsPath.appointmentsBookedTime,
                params: params
            }),
        }),



    })
})