import React from 'react';
import cl from '../../modules/AdminPanel/NewsAdminPanelCard.module.css'
import {dateConvert} from "../../utils/Date";


interface NewsAdminPanelCardInterface{
    id: number
    imgLink: string
    date: string
    title: string
    changeCallback: (id:number)=>void
    deleteCallback: (id:number)=>Promise<number>
}


const NewsAdminPanelCard = ({imgLink, date, title,changeCallback, deleteCallback,id}:NewsAdminPanelCardInterface) => {



    function changeHandler(){
        changeCallback(id)

    }

    async function deleteHandler(){
       const response = await deleteCallback(id)
    }

    return (
        <div className={cl.container}>
            <div className={cl.date}>{dateConvert(date)}</div>
            <img width={"100%"} height={"100%"} src={imgLink} alt={"doctor img"}/>
            <div className={cl.actionsContainer}>
                <button onClick={()=>changeHandler()}>Change</button>
                <button onClick={()=>deleteHandler()}>Delete</button>
            </div>
            <div className={cl.title}>
                {title}
            </div>
        </div>
    );
};

export default NewsAdminPanelCard;