import React, {useEffect, useState} from 'react';
import cl from '../../modules/PopupMessage/PopupContainer.module.css'
import PopupMessageItem, {messageType} from "./PopupMessageItem";
import {useAppSelector} from "../../hooks/redux";




const PopupContainer = () => {

    const errors = useAppSelector(state => state.errorReducer)

    useEffect(() => {
        console.log(errors)
    }, [errors]);

    return (
        <div className={cl.container}>
            {errors.messages.map((value, index)=><PopupMessageItem key={index} message={value.message} type={value.type} delay={index}/>)}
        </div>
    );
};

export default PopupContainer;