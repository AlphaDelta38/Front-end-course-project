import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {endpointsPath} from "../routes";
import {createAppointments} from "../types/doctorsType";
import {AppointmentInterface, AppointmentInterfaceUpdate, bookedTimeRequestInterface} from "../types/appointmentsType";
import {fetchAllPropsInterface} from "./NewsService";






export const appointmentsAPI =  createApi({
    reducerPath: "appointmentsService",
    baseQuery: fetchBaseQuery({baseUrl: `${process.env.REACT_APP_SERVER_HOST}`}),
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
        getAppointmentsAmount: build.query<number, any>({
            query: () => ({
                url: endpointsPath.appointmentsAmount,
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