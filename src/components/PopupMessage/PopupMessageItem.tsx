import React, {CSSProperties, useEffect, useState} from 'react';
import cl from '../../modules/PopupMessage/PopupMessageItem.module.css'
import {CSSTransition} from "react-transition-group";
import {useAppDispatch} from "../../hooks/redux";
import {errorSlice} from "../../store/reducers/ErrorSlice";

interface  PopupMessageItemInterface{
    message: string;
    type: messageType,
    delay?: number,
}


export enum messageType{
    errorType = "errorType",
    successType = "successType",
}


interface  styleInterface{
    errorType: CSSProperties
    successType: CSSProperties
}


const PopupMessageItem = ({message,type, delay=0}:PopupMessageItemInterface ) => {


    const [isVisible, setIsVisible] = useState(false)
    const dispatch = useAppDispatch()
    const {deleteFirst} = errorSlice.actions


    useEffect(() => {
        const showTimeout = setTimeout(() => {
            setIsVisible(true);
        }, delay * 1000);

        const hideTimeout = setTimeout(() => {
            setIsVisible(false);
            dispatch(deleteFirst())
        }, delay * 1000 + 4000);

        return () => {
            clearTimeout(showTimeout);
            clearTimeout(hideTimeout);
        };
    }, []);

    const style: styleInterface = {
        errorType: {backgroundColor: "#325CC8", border:"8px solid rgb(236, 83, 83)"},
        successType: {backgroundColor: "#325CC8 ",  border:"8px solid #66ff00"}
    }


    return (
            <>
                {isVisible &&
                    <div className={cl.positionContainer}>
                        <div style={{...style[type]}} className={cl.container}>
                            {type === messageType.errorType ? <span style={{color: "rgb(236, 83, 83)"}}>Erorr:</span> :
                                <span style={{color: "#66ff00"}}>Success:</span>}
                            {message}
                        </div>
                    </div>
                }
            </>
    );
};

export default PopupMessageItem;