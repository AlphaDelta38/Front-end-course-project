import React, {HTMLInputTypeAttribute, useEffect, useState} from 'react';
import cl from '../../modules/AdminPanel/ViewManageDataComponent.module.css'
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import CustomBtn, {CustomBtnTypes} from "../additionalComponents/CustomBtn";
import {convertToInputTypeDate} from "../../utils/Date";
import {useAppDispatch} from "../../hooks/redux";
import {errorSlice} from "../../store/reducers/ErrorSlice";
import {messageType} from "../PopupMessage/PopupMessageItem";
import {cleanSpaces} from "../../utils/Text";


export interface ViewManageDataStructure {
    fieldName: string,
    datBaseFieldName: string | null,
    beAbleDeActive: boolean
    type?: HTMLInputTypeAttribute,
    unitedKey?: string[]
}

interface ViewManageDataComponentInterface {
    dataStructure: ViewManageDataStructure[],
    yupValidationConst: yup.ObjectSchema<any>
    sectionName: string,
    clearCallBack: ()=>void,
    deleteCallBack: ()=>void,
    onSubmitCallBack: (object:any)=>void
    object: {
        id: number | null,
        [key:string]: any
    }
}

interface fieldData {
    [key: string]: string | {
        value: string
        active: boolean
    }
}

const ViewManageDataComponent = ({dataStructure, yupValidationConst,sectionName,clearCallBack,object,onSubmitCallBack,deleteCallBack}: ViewManageDataComponentInterface) => {


    const [fieldsData, setFieldsData] = useState<fieldData>({})

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(yupValidationConst),
    });

    const dispatch = useAppDispatch()

    const onSubmit = () => {
        let finalObject: { [key: string]: string | number }  = {}

        dataStructure.forEach((value)=>{
            if(!value.beAbleDeActive && !value?.unitedKey && value.datBaseFieldName){
                finalObject[value.datBaseFieldName] = fieldsData[value.fieldName] as string
            }else if(value.beAbleDeActive && value.datBaseFieldName){
                const data = (fieldsData[value.fieldName] as { value: string; active: boolean })
                if(data.active){
                    finalObject[value.datBaseFieldName] = data.value
                }
            }else if(!value.beAbleDeActive && value?.unitedKey && value?.unitedKey.length > 0){
                const str = (fieldsData[value.fieldName] as string).split(" ")
                value.unitedKey.forEach((key,index)=>{
                    finalObject[key] = str[index] || ""
                })
            }
        })
        if(object?.id){
            finalObject["id"] = object.id
        }
       onSubmitCallBack(finalObject)
    };


    function onChangeInputFiled(value: string, key: string) {
        setFieldsData({...fieldsData, [key]:
                typeof fieldsData[key] === "string" ?value : {
                    value: value,
                    active: ( fieldsData[key] as { value: string; active: boolean })?.active
                }
        })
    }


    function onChangeCheckBox(state: boolean, key: string) {
        setFieldsData({...fieldsData, [key]: {
                    value: ( fieldsData[key] as { value: string; active: boolean })?.value,
                    active: state
                }
        })
    }

    function clearFunction(){
        let data: fieldData = {}
        dataStructure.forEach((value) => {
            if (value.beAbleDeActive) {
                data[value.fieldName] = {
                    value: "",
                    active: false
                }
            } else {
                data[value.fieldName] = ""
            }
        })
        setFieldsData(data)
        clearCallBack()
    }

    useEffect(() => {
        let data: fieldData = {}
        dataStructure.forEach((value) => {
            if (value.beAbleDeActive) {
                if(object.id){
                    if(value.datBaseFieldName && object[value.datBaseFieldName]){
                        data[value.fieldName] = {
                            value: object[value.datBaseFieldName],
                            active: true
                        }
                        setValue(`${value.fieldName}`, object[value.datBaseFieldName])
                    }else{
                        data[value.fieldName] = {
                            value: "",
                            active: false
                        }
                    }
                }else{
                    data[value.fieldName] = {
                        value: "",
                        active: false
                    }
                }
            }else if(value.unitedKey && value.unitedKey?.length > 0){
                let str = ""
                value.unitedKey.forEach((value)=>{
                    if(object[value]){
                        str += object[value]
                        str += " "
                    }
                })
                data[value.fieldName] = cleanSpaces(str)
                setValue(`${value.fieldName}`, cleanSpaces(str))
            }else {
                if(object.id){
                    if(value.datBaseFieldName){
                        data[value.fieldName] = object[value.datBaseFieldName]
                        setValue(`${value.fieldName}`, object[value.datBaseFieldName])
                    }
                }else{
                    data[value.fieldName] = ""
                    setValue(`${value.fieldName}`, "")
                }
            }
        })

        setFieldsData(data)
    }, [object])


    useEffect(()=>{
        const errorsData = Object.entries(errors)
        for (const massive of errorsData){
            if(errors && massive[1]?.message){
                dispatch(errorSlice.actions.setErrors({message: massive[1].message as string, type: messageType.errorType}))
            }
        }
    }, [errors])

    return (
        <div className={cl.container}>
            <div className={cl.headerOfDataSettings}>
                <h2 className={cl.headerOfDataChangeContainer}>{`${sectionName}  #${object?.id || "New"}`}</h2>
                <button onClick={()=>clearFunction()} className={cl.clearDataBtn}>Clear</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className={cl.content}>
                {dataStructure.map((value, index) =>
                    <div key={index} className={cl.inputViewBox}>
                        <label>{value.fieldName}</label>
                        <input type={value.type || "text"}  {...register(`${value.fieldName}`)} value={
                            typeof fieldsData[value.fieldName] === "string"
                                ? value.type === "date" ? convertToInputTypeDate(fieldsData[value.fieldName]  as string ): fieldsData[value.fieldName] as string
                                : (fieldsData[value.fieldName] as { value: string; active: boolean })?.value
                        }
                               onChange={(e) => onChangeInputFiled(e.target.value, value.fieldName)}
                               disabled={typeof fieldsData[value.fieldName] === "string"
                                   ? false
                                   : !(fieldsData[value.fieldName] as { value: string; active: boolean })?.active
                               }
                        />
                        {value.beAbleDeActive &&
                            <input
                                checked={(fieldsData[value.fieldName] as { value: string; active: boolean })?.active}
                                onChange={(e) => onChangeCheckBox(e.target.checked, value.fieldName)} type={"checkbox"}
                            />
                        }
                    </div>
                )}
                <div className={cl.btnContainer}>
                    <CustomBtn btnType={"submit"} type={object?.id ? CustomBtnTypes.update : CustomBtnTypes.create}/>
                    {object?.id && <CustomBtn onClick={deleteCallBack} type={CustomBtnTypes.delete}/>}
                </div>
            </form>
        </div>
    );
};

export default ViewManageDataComponent;