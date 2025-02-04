import React, {useEffect, useState} from 'react';
import cl from '../../modules/AdminPanel/RatingViewAndChangeWindow.module.css'
import {DoctorsItemInerface} from "../../types/doctorsType";
import {PatientsInterface} from "../../types/patientsType";
import CustomSelect from "../additionalComponents/CustomSelect";
import CustomBtn, {CustomBtnTypes} from "../additionalComponents/CustomBtn";
import {deBounceWithConfirmation} from "../../utils/deBounce";
import {doctorAPI} from "../../services/DoctorService";
import {patientSAPI} from "../../services/PatientService";
import {cleanSpaces, containsSubstring} from "../../utils/Text";
import {ratingAPI} from "../../services/RatingService";
import {errorSlice} from "../../store/reducers/ErrorSlice";
import {messageType} from "../PopupMessage/PopupMessageItem";
import {useAppDispatch} from "../../hooks/redux";

interface dataState{
    id: number | null,
    doctor_id: number | null,
    patient_id: number | null,
    rating: number | null,
}


interface menuActivitiesStateInterface{
    doctorSearchActive: boolean,
    patientSearchActive: boolean,
    inputValue: string,
}

interface RatingProps{
    id: number | null
    callBackCloseWindow: ()=>void
    callbackDelete: (id: number) => void
    refetchCallBack: ()=>void
}


const RatingViewAndChangeWindow = ({id,callBackCloseWindow,refetchCallBack,callbackDelete}:RatingProps) => {

    const [menuActivities, setMenuActivities] = useState<menuActivitiesStateInterface>({
        doctorSearchActive: false,
        patientSearchActive: false,
        inputValue: "",
    });

    const [dataState, setDataState] = useState<dataState>({
        id: null,
        doctor_id: null,
        patient_id: null,
        rating: null
    })
    const [renderMassive, setRenderMassive] = useState<any[]>([])


    const {data: Doctors} = doctorAPI.useFetchAllDoctorsQuery({
        limit: 0,
        page: 1,
        role:"doctor"
    })

    const {data: Patient} = patientSAPI.useFetchALlQuery({
        limit: 0,
        page: 1,
    })

    const {data: Rating, refetch} = ratingAPI.useGetOneRatingQuery(id || 0, {
        skip: !id || isNaN(Number(id)),
    })

    const [createRating] = ratingAPI.useCreateRatingMutation()

    const dispatch = useAppDispatch()

    function deActivateOther(type: "patient" | "doctor"){
        setMenuActivities({
            ...menuActivities,
            patientSearchActive:  type === "patient" && !menuActivities.patientSearchActive,
            doctorSearchActive:  type === "doctor" && !menuActivities.doctorSearchActive,
            inputValue: ""
        })
    }

    function clearFunction(){
        setDataState({
            id: null,
            doctor_id: null,
            patient_id: null,
            rating: null,
        })
    }


    async function createAndUpdateRequest(){
        try {
            const  {id, ...needData} = dataState
            let response ;
            if(Object.entries(needData).every((value,index)=>value[1] !== null)){
                //@ts-ignore // always not null
                response = await createRating(needData)
            }else{
                throw new Error("Fill all need fields")
            }

            if(response?.error){
                throw new Error("Error within create")
            }else{
                refetchCallBack()
                callBackCloseWindow()
                if(Rating){
                    refetch()
                }
                dispatch(errorSlice.actions.setErrors({message: "Action has successful", type: messageType.successType}))
            }

            console.log(response)
        }catch (e){
            const errorMessage = e instanceof Error ? e.message : "Error not expected";
            dispatch(errorSlice.actions.setErrors({message: errorMessage, type: messageType.errorType}))
        }
    }


    useEffect(()=>{
        let object:any[] = []

        if(menuActivities.doctorSearchActive && Doctors){
            if(menuActivities.inputValue !== ""){
                object = [...Doctors].filter((value)=>
                    containsSubstring(value.first_name + " " + value.last_name, cleanSpaces(menuActivities.inputValue))
                    ||
                    containsSubstring(value.speciality?.name || "", cleanSpaces(menuActivities.inputValue))
                )
            }else{
                object = [...Doctors]
            }
        }else if(menuActivities.patientSearchActive && Patient){
            if(menuActivities.inputValue !== ""){
                object = [...Patient].filter((value)=>
                    containsSubstring(value.first_name + " " + value.last_name, cleanSpaces(menuActivities.inputValue))
                    ||
                    containsSubstring(value.address || "", cleanSpaces(menuActivities.inputValue))
                )
            }else{
                object= [...Patient]
            }
        }

        setRenderMassive(object)
    },[menuActivities])

    useEffect(()=>{
        if(Rating){
            setDataState({
                id: Rating.id,
                doctor_id: Rating.doctor_id,
                patient_id: Rating.patient_id,
                rating: Rating.rating
            })
        }

    }, [Rating])



    const ratings = [
       "1","2","3","4","5"
    ]





    return (
        <div className={cl.container}>
            <div className={cl.content}>
                <div className={cl.titleContainer}>
                    <h2>Appointment {dataState?.id ? `Update #${dataState.id}` : "Create"}</h2>
                    <div style={{margin: "0 10px 10px 0"}} className={cl.deleteBtnContainer}>
                        <button onClick={callBackCloseWindow} className={cl.closeBtn}>
                            <span></span>
                        </button>
                    </div>
                </div>
                <div className={cl.row}>

                    <div className={cl.itemContainer}>
                        <label>Doctor:</label>
                        <div className={cl.selectedContainer}>
                            <div className={cl.photoContainer}>
                                <img src={(Doctors && Doctors.find((value) => value.id === dataState.doctor_id)?.image_link) ?? "none"}/>
                            </div>
                            {dataState?.doctor_id ?
                                <>
                                    <div className={cl.dataContainer}>
                                        <h2 style={{color: "#325CC8"}}>
                                            {
                                                Doctors && Doctors.find((value) => value.id === dataState.doctor_id)!.first_name
                                                + " " +
                                                Doctors.find((value) => value.id === dataState.doctor_id)!.last_name
                                            }
                                        </h2>
                                        <span>{Doctors && Doctors.find((value) => value.id === dataState.doctor_id)!.speciality?.name || "none"}</span>
                                    </div>
                                    <div className={cl.deleteBtnContainer}>
                                        <button onClick={() => setDataState({...dataState, doctor_id: null})} className={cl.closeBtn}>
                                            <span></span>
                                        </button>
                                    </div>
                                </>
                                :
                                <div className={cl.chooseContainer}>
                                    <div onClick={() => deActivateOther("doctor")} className={cl.chooseTheObject}>
                                        <svg>
                                            <use xlinkHref={"./sprite.svg#AddCloudIcon"}></use>
                                        </svg>
                                    </div>
                                    <div
                                        className={menuActivities.doctorSearchActive ? cl.searchContainerActive : cl.searchContainer}>
                                        <div className={cl.menuSearchContainer}>
                                            <div className={cl.searchIconContainer}>
                                                <svg>
                                                    <use xlinkHref={"./sprite.svg#SearchIcon"}></use>
                                                </svg>
                                            </div>
                                            <input value={menuActivities.inputValue}
                                                   onChange={(e) => setMenuActivities({
                                                       ...menuActivities,
                                                       inputValue: e.target.value
                                                   })} className={cl.search}/>
                                        </div>
                                        <div className={cl.searchItemsContainer}>
                                            {renderMassive && (renderMassive as DoctorsItemInerface[]).map((value, index) =>
                                                <div onClick={() => setDataState({
                                                    ...dataState,
                                                    doctor_id: value.id,
                                                })}
                                                     key={index} className={cl.searchItemsContainer__item}>
                                                    <div className={cl.item__photoContainer}>
                                                        <img width={"100%"} height={"100%"}
                                                             src={value.image_link ?? ""}/>
                                                    </div>
                                                    <div className={cl.item__dataContainer}>
                                                        <h2>{value.first_name + " " + value.last_name}</h2>
                                                        <span>{value.speciality?.name || "none"}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>


                    <div className={cl.itemContainer}>
                        <label>Patient:</label>
                        <div className={cl.selectedContainer}>
                            <div className={cl.photoContainer}>
                            </div>
                            {dataState?.patient_id ?
                                <>
                                    <div className={cl.dataContainer}>
                                        <h2 style={{color: "#325CC8"}}>
                                            {
                                                Patient && Patient.find((value) => value.id === dataState.patient_id)!.first_name
                                                + " " +
                                                Patient.find((value) => value.id === dataState.patient_id)!.last_name
                                            }
                                        </h2>
                                        <span>{(Patient && Patient.find((value) => value.id === dataState.patient_id)?.address) ?? "none"}</span>
                                    </div>
                                    <div className={cl.deleteBtnContainer}>
                                        <button
                                            onClick={() => setDataState({...dataState, patient_id: null})}
                                            className={cl.closeBtn}>
                                            <span></span>
                                        </button>
                                    </div>
                                </>
                                :
                                <div className={cl.chooseContainer}>
                                    <div onClick={() => deActivateOther("patient")} className={cl.chooseTheObject}>
                                        <svg>
                                            <use xlinkHref={"./sprite.svg#AddCloudIcon"}></use>
                                        </svg>
                                    </div>
                                    <div
                                        className={menuActivities.patientSearchActive ? cl.searchContainerActive : cl.searchContainer}>
                                        <div className={cl.menuSearchContainer}>
                                            <div className={cl.searchIconContainer}>
                                                <svg>
                                                    <use xlinkHref={"./sprite.svg#SearchIcon"}></use>
                                                </svg>
                                            </div>
                                            <input value={menuActivities.inputValue}
                                                   onChange={(e) => setMenuActivities({
                                                       ...menuActivities,
                                                       inputValue: e.target.value
                                                   })} className={cl.search}/>
                                        </div>
                                        <div className={cl.searchItemsContainer}>
                                            {renderMassive && (renderMassive as PatientsInterface[]).map((value, index) =>
                                                <div onClick={() => setDataState({
                                                    ...dataState,
                                                    patient_id: value.id,
                                                })}
                                                     key={index} className={cl.searchItemsContainer__item}>
                                                    <div className={cl.item__photoContainer}>
                                                    </div>
                                                    <div className={cl.item__dataContainer}>
                                                        <h2>{value.first_name + " " + value.last_name}</h2>
                                                        <span>{value?.address || "none"}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>


                    <div className={cl.itemContainer}>
                        <label>Rating:</label>
                        <div className={cl.dateContainer}>
                            <CustomSelect dropDownStyles={{maxHeight: "120px"}}
                                          data={ratings}
                                          callback={(value: string) => setDataState({...dataState, rating: Number(value)})}
                                          currentValue={dataState.rating?.toString() || ""}/>
                        </div>
                    </div>


                </div>
                <div style={dataState.id ? {} : {justifyContent: "flex-end"}} className={cl.additionalContainer}>
                    <div className={cl.btnContainer}>
                        <CustomBtn onClick={() => createAndUpdateRequest()}
                                   type={dataState.id ? CustomBtnTypes.update : CustomBtnTypes.create}/>
                        <CustomBtn styles={dataState.id ? {} : {backgroundColor: "#6c757d"}} onClick={() => {
                            if (dataState.id) {
                                deBounceWithConfirmation(() => {
                                    callbackDelete(dataState.id!)
                                    callBackCloseWindow()
                                })
                            } else {
                                clearFunction()
                            }
                        }} type={CustomBtnTypes.delete}>{dataState.id ? "Delete" : "Clear"}</CustomBtn>
                    </div>
                </div>
            </div>
            {}
        </div>
    );
};

export default RatingViewAndChangeWindow;