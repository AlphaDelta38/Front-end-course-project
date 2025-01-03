import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import userReducer from './reducers/UserSlice'
import errorReducer from './reducers/ErrorSlice'
import {newsAPI} from "../services/NewsService";
import {doctorAPI} from "../services/DoctorService";
import {serviceAPI} from "../services/ServicesService";
import {rolesAPI} from "../services/RolesService";
import {specialityAPI} from "../services/SpecialityService";


const rootReducer = combineReducers({
    userReducer,
    errorReducer,
    [newsAPI.reducerPath]: newsAPI.reducer,
    [doctorAPI.reducerPath]: doctorAPI.reducer,
    [serviceAPI.reducerPath]: serviceAPI.reducer,
    [rolesAPI.reducerPath]: rolesAPI.reducer,
    [specialityAPI.reducerPath]: specialityAPI.reducer,
})



export  const setupStore = () =>{
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                newsAPI.middleware,
                doctorAPI.middleware,
                serviceAPI.middleware,
                rolesAPI.middleware,
                specialityAPI.middleware
            ),
    })
}




export type rootType = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore["dispatch"]



export  default setupStore;


