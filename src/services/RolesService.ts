import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {RoleInterface} from "../types/rolesType";
import {endpointsPath} from "../routes";


export const rolesAPI =  createApi({
    reducerPath: "rolesAPI",
    baseQuery: fetchBaseQuery({baseUrl: `${process.env.REACT_APP_SERVER_HOST}`}),
    endpoints: (build)=>({
        getAllRoles: build.query<RoleInterface[],any>({
            query: ()=>({
                url: endpointsPath.roles,
            })
        })
    })
})