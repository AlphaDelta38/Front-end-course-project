import React, {useEffect, useRef, useState} from 'react';
import cl from '../../modules/AdminPanel/NewsSettings.module.css'
import {dateConvert} from "../../utils/Date";
import SoloInputModalWindow from "../additionalComponents/soloInputModalWindow";
import QuillForm from "../additionalComponents/QuillForm";
import CustomBtn, {CustomBtnTypes} from "../additionalComponents/CustomBtn";
import {newsAPI} from "../../services/NewsService";
import {newsChangeRequestProps} from "../../types/newsType";
import {useAppDispatch} from "../../hooks/redux";
import {errorSlice} from "../../store/reducers/ErrorSlice";
import {messageType} from "../PopupMessage/PopupMessageItem";
import Loader from "../additionalComponents/loader";


interface  newsStateInterface{
    id: number | null,
    title: string | null,
    text: string | null,
    image_link: string | null,
}


export interface newsProps extends Partial<newsStateInterface>{
    createdAt: string,
    deleteFunc: (id:number)=>Promise<number>
    backFunc: ()=>void
}


const NewsSettings = ({id,image_link,title,text,createdAt, backFunc,deleteFunc}:newsProps) => {

    const [newsState, setNewsState] =useState<newsStateInterface>({
        id: id || null,
        image_link: image_link || null,
        text: text || null,
        title: title || null,
    })

    const [modalWindowActive, setModalWindowActive] = useState<boolean>(false)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [editorValue, setEditorValue] = useState(newsState.text || "");

    const [updateNews, {isLoading: newsIsLoadingUpdate }] = newsAPI.useChangeNewsMutation({})
    const [createNews, {isLoading: newsIsLoadingCreate }] = newsAPI.useCreateNewsMutation({})
    const dispatch = useAppDispatch()


    async function updateNewsHandler(){
        try {
            const objectForUpdate:newsChangeRequestProps = {
                id: newsState.id || 0,
                title: newsState.title || "",
                text: editorValue || "",
                image_link: newsState.image_link || "",
            }
            const response =  await updateNews(objectForUpdate);
            if(response){
                dispatch(errorSlice.actions.setErrors({message:"news update successful", type: messageType.successType}))
            }
        }catch (e){
            dispatch(errorSlice.actions.setErrors({message:"news update failed", type: messageType.errorType}))
        }
    }

    async function createNewsHandler(){
        try {
            if(newsState.image_link !== "" && newsState.title !== "" && editorValue !== ""){
                const objectForCreate: Omit<newsChangeRequestProps, "id"> = {
                    title: newsState.title || "",
                    text: editorValue,
                    image_link: newsState.image_link || "",
                }
                const response = await createNews(objectForCreate)
                if(!response.error){
                    dispatch(errorSlice.actions.setErrors({message:"news create successful", type: messageType.successType}))
                }else{
                    throw new Error("News create failed")
                }
            }else{
                dispatch(errorSlice.actions.setErrors({message:"fill all fields", type: messageType.errorType}))
            }
        }catch (e){
            dispatch(errorSlice.actions.setErrors({message:"news create failed", type: messageType.errorType}))
        }
    }

    async function deleteNewsHandler(){
        if(newsState.id){
            const response = await deleteFunc(newsState.id)
            if(response){
                backFunc()
            }
        }
    }


    useEffect(() => {
        if(textAreaRef.current){
            textAreaRef.current.addEventListener("input", function (){
                this.style.height = "auto";
                this.style.height = this.scrollHeight + "px";
            })
        }
    }, []);

    return (
        <div className={cl.container}>
            <Loader isLoading={newsIsLoadingUpdate || newsIsLoadingCreate} isChildElement={true}/>
            <div className={cl.content}>
                <div className={cl.actionContainer}>
                    <button className={cl.backBtn} onClick={()=>backFunc()}>
                        <svg width={"40px"} height={"20px"} style={{scale:"-1"}} fill={"#1A357A"}>
                            <use xlinkHref={"./sprite.svg#LongRightArrowIcon"}></use>
                        </svg>
                        Back
                    </button>
                    <div className={cl.btnActionContainer}>
                        <CustomBtn onClick={()=>newsState.id ? updateNewsHandler() : createNewsHandler()} type={newsState.id ? CustomBtnTypes.update : CustomBtnTypes.create}/>
                        {newsState.id &&
                            <CustomBtn onClick={()=>deleteNewsHandler()}  type={CustomBtnTypes.delete} styles={{maxWidth:"100px"}}/>
                        }
                    </div>
                </div>
                <div onClick={() => setModalWindowActive(true)} style={newsState.image_link ? {backgroundImage: `url(${newsState.image_link})` } : {border: "1px solid black"}} className={cl.imgContainer}>
                    {!newsState.image_link &&
                        <div className={cl.addImgIconContainer}>
                            <div className={cl.svgContainer}>
                                <svg>
                                    <use xlinkHref={"/sprite.svg#AddCloudIcon"}></use>
                                </svg>
                            </div>
                        </div>
                    }
                    <div className={cl.dateContainer}>
                        {createdAt ? dateConvert(createdAt) : dateConvert(new Date().toString()) }
                    </div>
                </div>
                <div className={cl.titleContainer}>
                    <textarea ref={textAreaRef} placeholder={"Enter the title"} value={newsState.title || ""} onChange={(e)=>setNewsState({...newsState, title: e.target.value})}/>
                </div>
                <QuillForm value={editorValue} setValue={setEditorValue} toolbarActive={true} readonly={false} style={{height:"400px"}}/>
                {modalWindowActive && <SoloInputModalWindow closeCallBackFunc={setModalWindowActive} acceptCallBackFunc={(link:string)=>{
                    setNewsState({...newsState, image_link: link})
                }}/>}
            </div>
        </div>
    );
};

export default NewsSettings;