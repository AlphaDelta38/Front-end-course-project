import React, {useEffect, useRef, useState} from 'react';
import cl from '../../modules/PopupMessage/PopupContainer.module.css'
import PopupMessageItem, {messageType} from "./PopupMessageItem";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {errorSlice, errorState} from "../../store/reducers/ErrorSlice";
import ReactDOM from "react-dom/client";




const PopupContainer = () => {

    const errors = useAppSelector(state => state.errorReducer)
    const errorContainerRef = useRef<HTMLDivElement | null>(null)
    const dispatch = useAppDispatch()


    useEffect(() => {
        if(errorContainerRef.current && errors.messages.length > 0){
            errors.messages.forEach((value,index)=>{
                const container = document.createElement("div")
                errorContainerRef.current?.appendChild(container)

                const root = ReactDOM.createRoot(container)

                const unmountAndRemove = () => {
                    root.unmount();
                    container.remove()
                };

                root.render(<PopupMessageItem delay={index} key={index} message={value.message} type={value.type} selfDestroyFunc={unmountAndRemove}/>)
            })
            dispatch(errorSlice.actions.deleteAll())
        }
    }, [errors]);

    return (
        <div ref={errorContainerRef} className={cl.container}>

        </div>
    );
};

export default PopupContainer;