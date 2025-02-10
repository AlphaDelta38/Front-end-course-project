import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {checkLogin, UserLogin, UserRegister} from "./ActionCreator";
import {roleInterface} from "../../types/doctorsType";
import {errorState} from "./ErrorSlice";


export interface UserState{
    id: number,
    first_name: string,
    last_name: string,
    date_of_birth: string,
    gender: string,
    phone: string,
    email: string,
    address: string,


    ///Additional for doctors
    office_number?: string,
    speciality?: {
        id: number,
        name: string,
    },
    image_link?: string,
    roles?: roleInterface[],

    ///Additional for pattient
    insurance_number?: string,


}


const initialState: UserState = {
    id: 0,
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: "",
    phone: "",
    email: "",
    address: "",
}



export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logOut(state: UserState, action: PayloadAction<void>){
            const newState = {
                id: 0,
                first_name: '',
                last_name: '',
                date_of_birth: '',
                gender: '',
                phone: '',
                email: '',
                address: '',
            };
            return newState;
        },
    },
    extraReducers: (builder)=>{

        builder.addCase(UserRegister.fulfilled, (state: UserState, action: PayloadAction<UserState | undefined>)=>{
            if(action.payload){
                return {...state, ...action.payload}
            }
        })

        builder.addCase(UserLogin.fulfilled, (state: UserState, action: PayloadAction<UserState | undefined>)=>{
            if(action.payload){
                return {...state, ...action.payload}
            }
        })

        builder.addCase(checkLogin.fulfilled, (state: UserState, action: PayloadAction<UserState | undefined>)=>{
            if(action.payload){
                return {...state, ...action.payload}
            }
        })


    }

})


export  default userSlice.reducer;






