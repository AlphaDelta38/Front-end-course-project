import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {endpointsPath} from "../routes";
import {routes} from "../types/routes.type";


export const routeAccessAPI =  createApi({
    reducerPath: "routeAccessAPI",
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
        getAllRoutes: build.query<{routes: string[]},any>({
            query: (params)=>({
                url: endpointsPath.routes,
            })
        }),
        getAccessToRole: build.query<routes,number>({
            query: (id)=>({
                url: `${endpointsPath.routes}/${id}`,
            })
        }),
        createAccessToRole: build.mutation<routes,routes>({
            query: (body)=>({
                url: endpointsPath.routes,
                method: "POST",
                body: body,
            })
        }),

    })
})