import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import { AxiosResponse } from 'axios';
import {loginForm, registerForm} from "../../types/forms.type";
import {jwtDecode} from "jwt-decode";
import {UserState} from "./UserSlice";


interface jwtToken{
        token: string;
}

export const UserRegister =  createAsyncThunk(
    "user/UserRegister",
     async (userData: registerForm, thunkAPI) =>{
        try {

            const response: AxiosResponse<jwtToken,any> = await axios.post(`${process.env.REACT_APP_SERVER_HOST}/auth/registration`, {
                first_name: userData.fullName?.split(" ")[0],
                last_name: userData.fullName?.split(" ")[1],
                date_of_birth: userData.date,
                gender: "N",
                phone: userData.phone,
                email: userData.email,
                address: userData.address,
                insurance_number: "",
                password: userData.password
            })
            if(!response.data.token){
                throw new Error("Токен не найден")
            }
            const decoded:UserState = jwtDecode(response.data.token);
            const filtered: UserState = {
                id: decoded.id,
                first_name: decoded.first_name,
                last_name: decoded.last_name,
                date_of_birth: decoded.date_of_birth,
                gender: decoded.gender,
                phone: decoded.phone,
                email: decoded.email,
                address: decoded.address,
                office_number: decoded.office_number || "",
                speciality: decoded.speciality || "",
                image_link: decoded.image_link || "",
                roles: decoded.roles || [],
                insurance_number: decoded.insurance_number || "",

            }

            localStorage.setItem("token", response.data.token);

            return filtered;
        }catch (e){
            alert({e, message: "Ошибка регистрации"})
            console.log(e)
        }
    },
)



export const UserLogin =  createAsyncThunk(
    "user/UserLogin",
    async (userData: loginForm, thunkAPI) =>{
        try {

            const response: AxiosResponse<jwtToken,any> = await axios.post(`${process.env.REACT_APP_SERVER_HOST}/auth/login`, {
                email: userData.email,
                password: userData.password,
                isPatient: userData.isPatient,
            })
            if(!response.data.token){
                throw new Error("Токен не найден")
            }
            const decoded:UserState = jwtDecode(response.data.token);
            const filtered: UserState = {
                id: decoded.id,
                first_name: decoded.first_name,
                last_name: decoded.last_name,
                date_of_birth: decoded.date_of_birth,
                gender: decoded.gender,
                phone: decoded.phone,
                email: decoded.email,
                address: decoded.address,
                office_number: decoded.office_number || "",
                speciality: decoded.speciality || "",
                image_link: decoded.image_link || "",
                roles: decoded.roles || [],
                insurance_number: decoded.insurance_number || "",

            }

            localStorage.setItem("token", response.data.token);

            return filtered;
        }catch (e){
            alert({e, message: "Ошибка авторизации"})
            console.log(e)
        }
    },
)


export const checkLogin =  createAsyncThunk(
    "user/checkLogin",
    async (_, thunkAPI) =>{
        try {

            const token = localStorage.getItem("token");
            if(!token){
                throw new Error("Токен не найден")
            }

            const response: AxiosResponse<jwtToken,any> = await axios.post(`${process.env.REACT_APP_SERVER_HOST}/auth/check`,{}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(!response.data.token){
                throw new Error("Токен не найден")
            }

            const decoded:UserState = jwtDecode(response.data.token);
            const filtered: UserState = {
                id: decoded.id,
                first_name: decoded.first_name,
                last_name: decoded.last_name,
                date_of_birth: decoded.date_of_birth,
                gender: decoded.gender,
                phone: decoded.phone,
                email: decoded.email,
                address: decoded.address,
                office_number: decoded.office_number || "",
                speciality: decoded.speciality || "",
                image_link: decoded.image_link || "",
                roles: decoded.roles || [],
                insurance_number: decoded.insurance_number || "",

            }

            localStorage.setItem("token", response.data.token);

            return filtered;
        }catch (e){
            alert(e)
            console.log(e)
        }
    },
)