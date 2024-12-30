import React, {useEffect, useState} from 'react';
import cl from '../../modules/PopupMessage/PopupContainer.module.css'
import PopupMessageItem, {messageType} from "./PopupMessageItem";
import {useAppSelector} from "../../hooks/redux";
import {errorState} from "../../store/reducers/ErrorSlice";




const PopupContainer = () => {

    const errors = useAppSelector(state => state.errorReducer)
    const [errorsState, setErrorsState] = useState<errorState>()

    useEffect(() => {
        setErrorsState(errors)
    }, [errors]);

    return (
        <div className={cl.container}>
            {errorsState && errorsState.messages.map((value, index)=><PopupMessageItem key={index} message={value.message} type={value.type} delay={index}/>)}
        </div>
    );
};

export default PopupContainer;