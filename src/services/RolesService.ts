import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {RoleInterface} from "../types/rolesType";
import {endpointsPath} from "../routes";
import {fetchAllPropsInterface} from "./NewsService";


export const rolesAPI =  createApi({
    reducerPath: "rolesAPI",
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
        createRole: build.mutation<RoleInterface,Omit<RoleInterface, "id">>({
            query: (body)=>({
                url: endpointsPath.roles,
                method: "POST",
                body: body
            })
        }),
        getAllRoles: build.query<RoleInterface[],fetchAllPropsInterface>({
            query: (params)=>({
                url: endpointsPath.roles,
                params: params
            })
        }),
        getAmountRoles: build.query<number,any>({
            query: ()=>({
                url: endpointsPath.rolesAmount,
            })
        }),
        updateRole: build.mutation<number,RoleInterface>({
            query: (body)=>({
                url: endpointsPath.roles,
                body: body,
                method: "PUT",
            })
        }),
        deleteRole: build.mutation<number,number>({
            query: (id)=>({
                url: `${endpointsPath.roles}/${id}`,
                method: "DELETE",
            })
        }),
    })
})