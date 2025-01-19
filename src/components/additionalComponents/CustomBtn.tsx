import React, {CSSProperties, FC, ReactNode} from 'react';
import cl from './modules/CustomBtn.module.css'





export enum CustomBtnTypes {
    create="create",
    update="update",
    delete="delete",
}

interface CustomBtnInterface{
    type:CustomBtnTypes,
    onClick?:()=>void,
    styles?: CSSProperties
    children?: ReactNode;
}




const CustomBtn: FC<CustomBtnInterface> = ({styles,type,onClick,children }) => {
    return (
        <button onClick={onClick} style={styles} className={`${cl.customBtn} ${cl[type]}`}>
            {children || type}
        </button>
    );
};

export default CustomBtn;