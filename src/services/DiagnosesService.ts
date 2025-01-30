import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {endpointsPath} from "../routes";
import {DiagnosesType} from "../types/diagnosesType";
import {fetchAllPropsInterface} from "./NewsService";


export const diagnosesAPI = createApi({
    reducerPath: "diagnosesAPI",
    baseQuery: fetchBaseQuery({baseUrl: `${process.env.REACT_APP_SERVER_HOST}`}),
    endpoints: (build)=>({
        getAllDiagnoses: build.query<DiagnosesType[], fetchAllPropsInterface>({
            query: (e)=>({
                url: endpointsPath.diagnoses,
                params: {...e}
            })
        }),
        getAmount: build.query<number, number>({
            query: ()=>({
                url: endpointsPath.diagnosesAmount,
            })
        }),
        createDiagnose: build.mutation<DiagnosesType, string>({
            query: (value)=>({
                url: endpointsPath.diagnoses,
                method: "POST",
                body: {
                    diagnosis: value
                }
            })
        }),
        deleteDiagnose: build.mutation<DiagnosesType, number>({
            query: (id)=>({
                url: `${endpointsPath.diagnoses}/${id}`,
                method: "DELETE",
            })
        }),
        updateDiagnose: build.mutation<number, DiagnosesType>({
            query: (diagnose)=>({
                url: endpointsPath.diagnoses,
                method: "PUT",
                body: {
                    ...diagnose
                }
            })
        }),
    })
})