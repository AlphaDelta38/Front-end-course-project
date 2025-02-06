import React, {CSSProperties, useState} from 'react';
import cl from './modules/CustomSelect.module.css'





interface  CustomSelectInterface{
    data: string[],
    defaultValue?: string,
    currentValue: string
    dropDownStyles?: CSSProperties
    callback: (value: string) => void,
    style?: CSSProperties
}


const CustomSelect = ({callback,defaultValue,data,dropDownStyles,currentValue,style}:CustomSelectInterface) => {


    const [active, setActive] = useState<boolean>(false)



    return (
        <div style={style} className={cl.container}>
            <div onClick={()=>setActive(!active)} className={cl.chosenValueAndChevronContainer}>
                <h2>{currentValue || "Choose the time"}</h2>
                <div className={cl.iconContainer}>
                    <svg style={active ? {transform: "rotate(-90deg)"} : {}}>
                        <use xlinkHref={"./sprite.svg#ChevronIcon"}></use>
                    </svg>
                </div>
            </div>
            <div style={dropDownStyles} className={active ? cl.dropDownContainerActive : cl.dropDownContainer}>
                {data.map((value,index)=>
                    <h2 onClick={()=>{
                        callback(value)
                        setActive(false)
                    }} key={index}>{value}</h2>
                )}
            </div>
        </div>
    );
};

export default CustomSelect;