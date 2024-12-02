import {combineReducers} from "redux";
import {configureStore, ReducerType} from "@reduxjs/toolkit";
import userReducer from './reducers/UserSlice'


const rootReducer = combineReducers({
    userReducer,
})



export  const setupStore = () =>{
    return configureStore({
        reducer: rootReducer,
    })
}




export type rootType = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore["dispatch"]



export  default setupStore;


