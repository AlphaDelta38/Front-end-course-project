import React, {useEffect} from 'react';
import cl from './modules/confirmWindow.module.css'
import CustomBtn, {CustomBtnTypes} from "./CustomBtn";


interface ConfirmWindowInterface {
    func: ()=>void
    selfDestroyFunction: ()=>void
}



const ConfirmWindow = ({func, selfDestroyFunction}: ConfirmWindowInterface) => {


    function confirmHandler(){
        func()
        selfDestroyFunction()
    }

    useEffect(()=>{
        const element = document.querySelector("body")
        if(element){
            element.style.overflow = "hidden"
        }

        return ()=>{
            if(element){
                element.style.overflow = "visible"
            }
        }
    })

    return (
        <div className={cl.container}>
            <div className={cl.actionContainer}>
                <CustomBtn onClick={()=>confirmHandler()} styles={{maxWidth:"120px", maxHeight:"64px"}} type={CustomBtnTypes.create}>Confirm</CustomBtn>
                <CustomBtn onClick={()=>selfDestroyFunction()} styles={{maxWidth:"120px", maxHeight:"64px"}} type={CustomBtnTypes.delete}>Cancel</CustomBtn>
            </div>
        </div>
    );
};

export default ConfirmWindow;