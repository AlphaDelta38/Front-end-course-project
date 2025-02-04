import React, {useEffect, useState} from 'react';
import cl from '../../modules/AdminPanel/AppointmentsViewAndChangeWindow.module.css'
import {DoctorsItemInerface} from "../../types/doctorsType";
import {doctorAPI} from "../../services/DoctorService";
import {patientSAPI} from "../../services/PatientService";
import {PatientsInterface} from "../../types/patientsType";
import {serviceAPI} from "../../services/ServicesService";
import {diagnosesAPI} from "../../services/DiagnosesService";
import {serviceItems} from "../../types/serviceType";
import {DiagnosesType} from "../../types/diagnosesType";
import {cleanSpaces, containsSubstring} from "../../utils/Text";
import CustomSelect from "../additionalComponents/CustomSelect";
import QuillForm from "../additionalComponents/QuillForm";
import CustomBtn, {CustomBtnTypes} from "../additionalComponents/CustomBtn";
import {deBounceWithConfirmation} from "../../utils/deBounce";
import {appointmentsAPI} from "../../services/AppointmentsService";
import {useAppDispatch} from "../../hooks/redux";
import {errorSlice} from "../../store/reducers/ErrorSlice";
import {messageType} from "../PopupMessage/PopupMessageItem";


interface menuActivitiesStateInterface{
    doctorSearchActive: boolean,
    patientSearchActive: boolean,
    diagnosesSearchActive: boolean,
    serviceSearchActive: boolean,
    inputValue: string,
}


interface dataState{
    id: number | null,
    serviceId: number | null,
    diagnoseId: number | null,
    doctorId: number | null,
    patientId: number | null,
    date: string | null,
    time: string | null,
    status: boolean,
    notes: string | null;
    prescription: string | null;
}

interface appointmentProps{
    id: number | null
    callBackCloseWindow: ()=>void
    callbackDelete: (id: number) => void
    refetchCallBack: ()=>void
}

const AppointmentsViewAndChangeWindow = ({id,callBackCloseWindow,callbackDelete,refetchCallBack}: appointmentProps) => {

    const [menuActivities, setMenuActivities] = useState<menuActivitiesStateInterface>({
        doctorSearchActive: false,
        patientSearchActive: false,
        diagnosesSearchActive: false,
        serviceSearchActive: false,
        inputValue: "",
    });

    const [dataState, setDataState] = useState<dataState>({
        id: null,
        doctorId: null,
        diagnoseId: null,
        patientId: null,
        serviceId: null,
        status: false,
        date: null,
        time: null,
        notes: null,
        prescription: null,
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

    const {data: Service} = serviceAPI.useFetchAllServiceQuery({
        limit: 0,
        page: 1,
    })

    const {data: Diagnosis} = diagnosesAPI.useGetAllDiagnosesQuery({
        limit: 0,
        page: 1,
    })

    const {data: Appointment, refetch} = appointmentsAPI.useGetOneAppointmentQuery(id || 0, {
        skip: !id || isNaN(Number(id)),
    })

    const {data: bookedTime} = appointmentsAPI.useGetAppointmentsBookedTimeQuery({doctor_id: dataState.doctorId || 0, date: dataState.date || ""}, {
        skip: !dataState.date || !dataState.doctorId,
    })

    const [createAppointment, ] = appointmentsAPI.useCreateAppointmentsMutation()
    const [updateAppointment, ] = appointmentsAPI.useUpdateAppointmentMutation()



    const dispatch = useAppDispatch()


    function changeFormatOfDate(date: string){
        const [day,moth,year] = date.split('-');
        return `${year}-${moth}-${day}`
    }


    function clearFunction(){
        setDataState({
            id: null,
            doctorId: null,
            diagnoseId: null,
            patientId: null,
            serviceId: null,
            status: false,
            date: null,
            time: null,
            notes: null,
            prescription: null,
        })
    }



    async function createAndUpdateRequest(){
        try {
            let response;
            if(dataState.id){
                const {prescription, notes, diagnoseId, ...needValue} = dataState;
                if(Object.entries(needValue).every((value,index)=>value[1] !== null)){
                    const obj = {
                        id: needValue.id!,
                        doctor_id: needValue.doctorId!,
                        patient_id: needValue.patientId!,
                        service_id: needValue.serviceId!,
                        date: needValue.date!,
                        time: needValue.time!,
                        status: needValue.status!,
                        notes: notes || "",
                        prescription: prescription || "",
                    }


                    if(dataState.diagnoseId){
                        //@ts-ignore
                        obj["diagnosis_id"] = dataState.diagnoseId!
                    }

                    response = await updateAppointment(obj)
                }else{
                    throw new Error("Fill all need fields")
                }
            }else{
                const {id, diagnoseId, notes, prescription, ...needValue} = dataState;
                if(Object.entries(needValue).every((value,index)=>value[1] !== null)){
                    response = await createAppointment({
                        doctor_id: needValue.doctorId!,
                        service_id: needValue.serviceId!,
                        patient_id: needValue.patientId!,
                        date: needValue.date!,
                        time: needValue.time!,
                        status: needValue.status,
                    });
                }else{
                    throw new Error("Fill all fields")
                }
            }

            if(response?.error){
                throw new Error("Error within create")
            }else{
                refetchCallBack()
                callBackCloseWindow()
                if(Appointment){
                    refetch()
                }
                dispatch(errorSlice.actions.setErrors({message: "Action has successful", type: messageType.successType}))
            }


        }catch (e){
            const errorMessage = e instanceof Error ? e.message : "Error not expected";
            dispatch(errorSlice.actions.setErrors({message: errorMessage, type: messageType.errorType}))
        }
    }


    function deActivateOther(type: "patient" | "diagnose" | "doctor" | "service"){
        setMenuActivities({
            ...menuActivities,
            serviceSearchActive: type === "service" && !menuActivities.serviceSearchActive,
            patientSearchActive:  type === "patient" && !menuActivities.patientSearchActive,
            diagnosesSearchActive:  type === "diagnose" && !menuActivities.diagnosesSearchActive,
            doctorSearchActive:  type === "doctor" && !menuActivities.doctorSearchActive,
            inputValue: ""
        })
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

        }else if(menuActivities.serviceSearchActive && Service){
            if(menuActivities.inputValue !== ""){
                object = [...Service].filter((value)=>
                    containsSubstring(value.service ,cleanSpaces(menuActivities.inputValue))
                )
            }else{
                object = [...Service]
            }

        }else if(menuActivities.diagnosesSearchActive && Diagnosis){
            if(menuActivities.inputValue !== ""){
                object = [...Diagnosis].filter((value)=>
                    containsSubstring(value.diagnosis, cleanSpaces(menuActivities.inputValue))
                )
            }else{
                object=[...Diagnosis]
            }
        }

        setRenderMassive(object)
    },[menuActivities])




    useEffect(()=>{

        if(Appointment){
            setDataState({
                id: Appointment.id,
                doctorId: Appointment.doctor_id,
                patientId: Appointment.patient_id,
                serviceId: Appointment.service_id,
                diagnoseId: Appointment.diagnosis_id,
                status: Appointment.status,
                date: Appointment.date,
                time: Appointment.time,
                prescription: Appointment.prescription || null,
                notes: Appointment.notes || null,
            })
        }

    }, [Appointment])





    const timeSelect = [
        "9:00","9:30","10:00","10:30","11:00","11:30",
        "12:00", "12:30","13:00","13:30","14:00",
    ]



    return (
        <div className={cl.container}>
            <div className={cl.content}>
                <div className={cl.titleContainer}>
                    <h2>Appointment {dataState?.id ? `Update #${dataState.id}` : "Create"}</h2>
                    <div style={{margin:"0 10px 10px 0"}} className={cl.deleteBtnContainer}>
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
                                <img src={(Doctors && Doctors.find((value) => value.id === dataState.doctorId)?.image_link) ?? "none"}/>
                            </div>
                            {dataState?.doctorId ?
                                <>
                                    <div className={cl.dataContainer}>
                                        <h2 style={{color: "#325CC8"}}>
                                            {
                                                Doctors && Doctors.find((value) => value.id === dataState.doctorId)!.first_name
                                                + " " +
                                                Doctors.find((value) => value.id === dataState.doctorId)!.last_name
                                            }
                                        </h2>
                                        <span>{Doctors && Doctors.find((value) => value.id === dataState.doctorId)!.speciality?.name || "none"}</span>
                                    </div>
                                    <div className={cl.deleteBtnContainer}>
                                        <button onClick={() => setDataState({...dataState, doctorId: null, time: null})} className={cl.closeBtn}>
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
                                    <div  className={menuActivities.doctorSearchActive ? cl.searchContainerActive : cl.searchContainer}>
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
                                                <div onClick={() => setDataState({...dataState, doctorId: value.id, time: null})}
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
                            {dataState?.patientId ?
                                <>
                                    <div className={cl.dataContainer}>
                                        <h2 style={{color: "#325CC8"}}>
                                            {
                                                Patient && Patient.find((value) => value.id === dataState.patientId)!.first_name
                                                + " " +
                                                Patient.find((value) => value.id === dataState.patientId)!.last_name
                                            }
                                        </h2>
                                        <span>{(Patient && Patient.find((value) => value.id === dataState.patientId)?.address) ?? "none"}</span>
                                    </div>
                                    <div className={cl.deleteBtnContainer}>
                                        <button onClick={() => setDataState({...dataState, patientId: null, time: null})}
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
                                    <div  className={menuActivities.patientSearchActive ? cl.searchContainerActive : cl.searchContainer}>
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
                                                <div onClick={() => setDataState({...dataState, patientId: value.id, time: null})}
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
                        <label>Service:</label>
                        <div style={{paddingLeft: "60px"}} className={cl.selectedContainer}>
                            {dataState?.serviceId ?
                                <>
                                    <div className={cl.dataContainer}>
                                        <h2 style={{color: "#325CC8", fontSize: "1.5rem"}}>
                                            {
                                                Service && Service.find((value) => value.id === dataState.serviceId)!.service
                                            }
                                        </h2>
                                    </div>
                                    <div className={cl.deleteBtnContainer}>
                                        <button onClick={() => setDataState({...dataState, serviceId: null})}
                                                className={cl.closeBtn}>
                                            <span></span>
                                        </button>
                                    </div>
                                </>
                                :
                                <div className={cl.chooseContainer}>
                                    <div onClick={() => deActivateOther("service")} className={cl.chooseTheObject}>
                                        <svg>
                                            <use xlinkHref={"./sprite.svg#AddCloudIcon"}></use>
                                        </svg>
                                    </div>
                                    <div  className={menuActivities.serviceSearchActive ? cl.searchContainerActive : cl.searchContainer}>
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
                                            {renderMassive && (renderMassive as serviceItems[]).map((value, index) =>
                                                <div onClick={() => setDataState({...dataState, serviceId: value.id})}
                                                     key={index} className={cl.searchItemsContainer__item}>
                                                    <div className={cl.item__dataContainer}>
                                                        <h2 style={{fontSize: "1.5rem"}}>{value.service}</h2>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div style={dataState.id ? {} : {display:"none"}} className={cl.itemContainer}>
                        <label>Diagnose:</label>
                        <div style={{paddingLeft: "60px"}} className={cl.selectedContainer}>
                            {dataState?.diagnoseId ?
                                <>
                                    <div className={cl.dataContainer}>
                                        <h2 style={{color: "#325CC8", fontSize: "1.5rem"}}>
                                            {
                                                Diagnosis && Diagnosis.find((value) => value.id === dataState.diagnoseId)!.diagnosis
                                            }
                                        </h2>
                                    </div>
                                    <div className={cl.deleteBtnContainer}>
                                        <button onClick={() => setDataState({...dataState, diagnoseId: null})}
                                                className={cl.closeBtn}>
                                            <span></span>
                                        </button>
                                    </div>
                                </>
                                :
                                <div  className={cl.chooseContainer}>
                                    <div onClick={() => deActivateOther("diagnose")} className={cl.chooseTheObject}>
                                        <svg>
                                            <use xlinkHref={"./sprite.svg#AddCloudIcon"}></use>
                                        </svg>
                                    </div>
                                    <div  className={menuActivities.diagnosesSearchActive ? cl.searchContainerActive : cl.searchContainer}>
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
                                            {renderMassive && (renderMassive as DiagnosesType[]).map((value, index) =>
                                                <div onClick={() => setDataState({...dataState, diagnoseId: value.id})}
                                                     key={index} className={cl.searchItemsContainer__item}>
                                                    <div className={cl.item__dataContainer}>
                                                        <h2 style={{fontSize: "1.5rem"}}>{value.diagnosis}</h2>
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
                        <label>Date:</label>
                        <div className={cl.dateContainer}>
                            <input value={changeFormatOfDate(dataState.date ?? "")} onChange={(e) => setDataState({
                                ...dataState,
                                date: changeFormatOfDate(e.target.value),
                                time: null,
                            })} className={cl.inputDateType} type={"date"}/>
                        </div>
                    </div>

                    <div style={dataState.doctorId && dataState.date ? {} : {display:"none"}} className={cl.itemContainer}>
                        <label>Time:</label>
                        <div className={cl.dateContainer}>
                            <CustomSelect dropDownStyles={{maxHeight: "120px"}} data={timeSelect.filter((value)=>bookedTime && !bookedTime.includes(value))}
                                          callback={(value: string) => setDataState({...dataState, time: value})}
                                          currentValue={dataState.time || ""}/>
                        </div>
                    </div>

                    <div style={dataState.id ? {} : {display:"none"}} className={cl.itemContainer}>
                        <label>Prescription:</label>
                        <div style={{paddingLeft: "72px"}} className={cl.dateContainer}>
                            <input value={dataState.prescription || ""} onChange={(e)=>setDataState({...dataState, prescription: e.target.value})} className={cl.prescriptionInput} placeholder={"Prescription"}/>
                        </div>
                    </div>

                    <div style={dataState.id ? {alignItems: "start"} : {display:"none"}} className={cl.itemContainer}>
                        <label>Notes:</label>
                        <div style={{paddingLeft: "72px"}} className={cl.dateContainer}>
                            <QuillForm toolbarActive={true} readonly={false} value={dataState.notes || ""} setValue={(value)=>setDataState({...dataState, notes: value})}/>
                        </div>
                    </div>

                </div>
                <div style={dataState.id ? {} : {justifyContent:"flex-end"}} className={cl.additionalContainer}>
                    <div style={dataState.id ? {} : {display:"none"}} className={cl.appointmentsStatusContainer}>
                        <label>Visited:</label>
                        <input checked={dataState.status} onChange={(e)=>setDataState({...dataState, status: e.target.checked})} type={"checkbox"}/>
                    </div>
                    <div className={cl.btnContainer}>
                        <CustomBtn onClick={()=>createAndUpdateRequest()} type={dataState.id ? CustomBtnTypes.update : CustomBtnTypes.create}/>
                        <CustomBtn styles={dataState.id ? {} : {backgroundColor: "#6c757d"}} onClick={()=>{
                            if(dataState.id) {
                                deBounceWithConfirmation(()=>{
                                    callbackDelete(dataState.id!)
                                    callBackCloseWindow()
                                })
                            }else {
                                clearFunction()
                            }
                        }} type={CustomBtnTypes.delete}>{dataState.id ? "Delete" : "Clear"}</CustomBtn>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentsViewAndChangeWindow;