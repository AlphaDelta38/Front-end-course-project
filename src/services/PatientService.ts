import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {fetchAllPropsInterface} from "./NewsService";
import {createPatientRequestInterface, PatientsInterface, viewDataReturnOnSubmitInterface} from "../types/patientsType";
import {endpointsPath} from "../routes";












export const patientSAPI = createApi({
    reducerPath: "patientSAPI",
    baseQuery: fetchBaseQuery({baseUrl: `${process.env.REACT_APP_SERVER_HOST}`}),
    endpoints: (build) => ({
        fetchALl: build.query<PatientsInterface[],fetchAllPropsInterface>({
            query: (params)=>({
                url: endpointsPath.patients,
                params: {
                    ...params
                }
            })
        }),
        fetchALlAmount: build.query<number,any>({
            query: (params)=>({
                url: endpointsPath.patientsAmount,
            }),
        }),
        deletePatient: build.mutation<number,number>({
            query: (id)=>({
                url: `${endpointsPath.patients}/${id}`,
                method: "DELETE"
            }),
        }),
        createPatient: build.mutation<PatientsInterface,createPatientRequestInterface>({
            query: (data)=>({
                url: endpointsPath.patients,
                method: "POST",
                body: {...data}
            }),
        }),
        updatePatient: build.mutation<PatientsInterface,viewDataReturnOnSubmitInterface>({
            query: (data)=>({
                url: endpointsPath.patients,
                method: "PUT",
                body: {...data}
            }),
        }),
    })
})