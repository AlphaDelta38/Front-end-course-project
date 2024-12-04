import {combineReducers} from "redux";
import {configureStore, ReducerType} from "@reduxjs/toolkit";
import userReducer from './reducers/UserSlice'
import errorReducer from './reducers/ErrorSlice'
import {newsAPI} from "../services/NewsService";
import {doctorAPI} from "../services/DoctorService";


const rootReducer = combineReducers({
    userReducer,
    errorReducer,
    [newsAPI.reducerPath]: newsAPI.reducer,
    [doctorAPI.reducerPath]: doctorAPI.reducer,
})



export  const setupStore = () =>{
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(newsAPI.middleware, doctorAPI.middleware),
    })
}




export type rootType = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore["dispatch"]



export  default setupStore;


