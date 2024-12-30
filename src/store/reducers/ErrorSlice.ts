import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {messageType} from "../../components/PopupMessage/PopupMessageItem";


interface messageInterface{
    type: messageType,
    message: string,
}




export interface  errorState{
    messages: messageInterface[]
}



const initialState: errorState = {
    messages: []
}




export const errorSlice = createSlice({
    name: "error",
    initialState,
    reducers: {
        setErrors(state: errorState, action: PayloadAction<messageInterface>){
            const temp = [...state.messages,action.payload]
            state.messages = temp;
        },
        deleteFirst(state: errorState){
            const temp = [...state.messages]
            temp.shift()
            state.messages = temp;
        }
    }
})


export default errorSlice.reducer;

