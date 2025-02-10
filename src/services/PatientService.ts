import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {fetchAllPropsInterface} from "./NewsService";
import {createPatientRequestInterface, PatientsInterface, viewDataReturnOnSubmitInterface} from "../types/patientsType";
import {endpointsPath} from "../routes";
import {userPasswordUpdate} from "../types/userType";












export const patientSAPI = createApi({
    reducerPath: "patientSAPI",
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
        UpdateForSelf: build.mutation<number,Omit<viewDataReturnOnSubmitInterface, "id">>({
            query: (data)=>({
                url: endpointsPath.patientUpdateSelf,
                method: "PUT",
                body: data
            }),
        }),
        passwordUpdateSelf: build.mutation<number,userPasswordUpdate>({
            query: (data)=>({
                url: endpointsPath.patientPasswordUpdate,
                method: "PUT",
                body: data
            }),
        }),
    })
})