import React, {useEffect, useMemo, useState} from 'react';
import cl from '../../modules/ProfilePage/ProfilePage.module.css'
import {Link, useLocation} from "react-router-dom";
import {routesEnum} from "../../types/routes.type";
import {appointmentsAPI} from "../../services/AppointmentsService";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {deBounceWithConfirmation} from "../../utils/deBounce";
import {userSlice} from "../../store/reducers/UserSlice";
import {AppointmentInterface} from "../../types/appointmentsType";
import {containsSubstring} from "../../utils/Text";
import PaginationBar from "../AdminPanel/PaginationBar";
import {searchForwardsEnum, searchObjectsInterface, searchTypeEnum} from "../../types/adminPanelType";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {formatDateForInput} from "../../utils/Date";
import {doctorAPI} from "../../services/DoctorService";
import {patientSAPI} from "../../services/PatientService";
import {errorSlice} from "../../store/reducers/ErrorSlice";
import {messageType} from "../PopupMessage/PopupMessageItem";
import CustomBtn, {CustomBtnTypes} from "../additionalComponents/CustomBtn";


const validationDataSchemaForDoctor = yup.object().shape({
    first_name:  yup.string().trim().required().transform((value) => value.charAt(0).toUpperCase() + value.slice(1)),
    last_name:  yup.string().trim().required().transform((value) => value.charAt(0).toUpperCase() + value.slice(1)),
    email: yup.string().required("Email is required").email("email is not correct"),
    date_of_birth: yup.string().required(),
    gender: yup.string().required().matches(/^.+$/, "Gender is required and cannot be empty"),
    address: yup.string().notRequired(),
    office_number: yup.string().notRequired(),
    image_link: yup.string().notRequired(),
    phone: yup.string().notRequired().transform(value => value.replace((value:string)=>{
        if (value) {
            return value.replace(/\s+/g, '');
        }
        return value;
    }, '')).required("Phone number is  required").matches(/^380\d{9}$/, 'Phone number must start with 380 and contain 12 digits in total'),
})


const validationDataSchemaForPatient = validationDataSchemaForDoctor.omit(["office_number", "image_link"]).shape({
    insurance_number: yup.string().notRequired(),
})

const validationDataSchemaForChangePassword = yup.object().shape({
    currentPassword: yup.string().required().min(6),
    newPassword: yup.string().required().min(6),
    confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Пароли должны совпадать').required('Подтвердите новый пароль'),
})

interface dataSettingsInterface{
    first_name: string,
    last_name: string,
    date_of_birth: string,
    gender: string,
    phone: string,
    email: string,
    address: string,


    ///Additional for doctors
    office_number?: string,
    image_link?: string,


    ///Additional for pattient
    insurance_number?: string,
}


interface changePasswordInterface{
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
    active: "current" | "new" | null
}

const ProfilePage = () => {


    const [searchInput, setSearchInput] = useState<string>("");
    const [filteredAppointments, setFilteredAppointments] = useState<AppointmentInterface[]>();
    const [changePasswordState, setChangePasswordState] = useState<changePasswordInterface>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        active: null,
    })

    const [dataSettingsState, setDataSettingsState] = useState<dataSettingsInterface>({
        first_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        office_number: "",
        image_link: "",
        insurance_number: "",
    });


    const userData = useAppSelector(state => state.userReducer)
    const dispatch = useAppDispatch()
    const location = useLocation()


    const selectedSchema = useMemo(()=>{
            return userData.roles && userData.roles?.length > 0 ? validationDataSchemaForDoctor : validationDataSchemaForPatient
    }, [userData])


    const {
        register,
        formState: {errors},
        handleSubmit,
        setValue
    } = useForm({
        resolver: yupResolver(selectedSchema as yup.ObjectSchema<any> ),
        mode: "onSubmit",
    })

    const {
        register: changePasswordRegister,
        handleSubmit: changePasswordHandleSubmit,
        formState: {errors: changePasswordErrors},
    } = useForm({
        resolver: yupResolver(validationDataSchemaForChangePassword ),
        mode: "onSubmit",
    })

    const [searchState, setSearchState] = useState<searchObjectsInterface>({
        limit: 10,
        page: 1,
        searchForward: searchForwardsEnum.UP,
        searchType: searchTypeEnum.id
    })


    const {data: Appointments} = appointmentsAPI.useGetAllAppointmentsQuery({
        limit: searchState.limit || 10,
        page: searchState.page || 1,
        type: userData.roles && userData.roles.length > 0  ? "doctor" : "patient",
        id: userData.id
    })

    const [updateDoctor] = doctorAPI.useUpdateSelfMutation()
    const [updatePatient] = patientSAPI.useUpdateForSelfMutation()

    const [updatePasswordDoctor] = doctorAPI.usePasswordUpdateSelfMutation()
    const [updatePasswordPatient] = patientSAPI.usePasswordUpdateSelfMutation()


    const {data: Amount} = appointmentsAPI.useGetAppointmentsAmountQuery({
        id: userData.id,
        type:  userData.roles && userData.roles.length > 0  ? "doctor" : "patient",
    })

    function logOut(){
        localStorage.setItem("token", "")
        dispatch(userSlice.actions.logOut())
    }


    function changeIconActivePasswordChange(type: "current" | "new"){
        if(changePasswordState.active === type){
            setChangePasswordState({...changePasswordState, active: null})
        }else{
            setChangePasswordState({...changePasswordState, active: type})
        }
    }

    async function onSubmitChangePassword (data: Omit<changePasswordInterface, "active">) {
        try {

            const response = userData.roles && userData?.roles?.length > 0 ?
                await updatePasswordDoctor({currentPassword: data.currentPassword,newPassword:data.newPassword })
                :
                await updatePasswordPatient({currentPassword: data.currentPassword,newPassword:data.newPassword })

            if(response?.error){
                //@ts-ignore
                throw new Error(response?.error.data.message)

            }else{
                dispatch(errorSlice.actions.setErrors({message: "change is successfully", type: messageType.successType}))
            }


        } catch (e) {
            //@ts-ignore
            const error = e.message || "Error with change"
            dispatch(errorSlice.actions.setErrors({message: error, type: messageType.errorType}))
        }
    }



    async function onSubmit (data: dataSettingsInterface) {
        try {
            const {office_number,image_link,insurance_number, ...otherData} = data
            const needValueToRequest: any = {...otherData}
            if(userData.roles && userData?.roles?.length > 0){
                needValueToRequest["image_link"] = image_link
                needValueToRequest["office_number"] = office_number
            }else{
                needValueToRequest["insurance_number"] = insurance_number
            }


            const response = userData.roles && userData?.roles?.length > 0 ? await updateDoctor({ newDoctor: needValueToRequest}) : await updatePatient(needValueToRequest)
            if(response?.error){
                //@ts-ignore
                throw new Error(response?.error.data.message)

            }else{
                dispatch(errorSlice.actions.setErrors({message: "Update is successfully", type: messageType.successType}))
            }


        } catch (e) {
            //@ts-ignore
            const error = e.message || "Error with update"
            dispatch(errorSlice.actions.setErrors({message: error, type: messageType.errorType}))
        }
    }

    useEffect(()=>{
        if(errors){
            Object.entries(errors).forEach((value)=>{
                //@ts-ignore
                if(value[1]?.message){
                    dispatch(errorSlice.actions.setErrors({message: value[1]?.message?.toString(), type: messageType.errorType}))
                }
            })
        }

        if(changePasswordErrors){
            Object.entries(changePasswordErrors).forEach((value)=>{
                //@ts-ignore
                if(value[1]?.message){
                    dispatch(errorSlice.actions.setErrors({message: value[1]?.message?.toString(), type: messageType.errorType}))
                }
            })
        }
    },[errors, changePasswordErrors])


    useEffect(()=>{
        if(Appointments){
            let fitered: AppointmentInterface[] = [...Appointments]

            fitered = fitered.filter((value)=>{
                const docOrPatient = userData.roles && userData.roles.length > 0 ?  (value.doctor.first_name + " " + value.doctor.last_name) : (value.patient.first_name + " " + value.patient.last_name)

                if(containsSubstring(docOrPatient, searchInput)){
                    return true
                }

                if(value?.diagnosis  && value?.diagnosis?.diagnosis && containsSubstring(value.diagnosis.diagnosis.toString(), searchInput)){
                    return true
                }

                if(value?.services  && value?.services?.service && containsSubstring(value.services.service.toString(), searchInput)){
                    return true
                }

                if(containsSubstring(value.status ? "Completed" : "In proggres", searchInput)){
                    return true
                }

                if(containsSubstring(value.date, searchInput) ||containsSubstring(value.time, searchInput)){
                    return true
                }

                return false
            })


            setFilteredAppointments(fitered)
        }
    }, [Appointments,searchInput])


    useEffect(()=>{
        if(userData){
            const {speciality, id,roles, ...needValue} = userData
            setDataSettingsState({
                ...needValue
            })
            setValue("first_name", needValue.first_name || "");
            setValue("last_name", needValue.last_name || "");
            setValue("date_of_birth", needValue.date_of_birth || "");
            setValue("gender", needValue.gender || "");
            setValue("phone", needValue.phone || "");
            setValue("email", needValue.email || "");
            setValue("address", needValue.address || "");
            setValue("office_number", needValue.office_number || "");
            setValue("image_link", needValue.image_link || "");
            setValue("insurance_number", needValue.insurance_number || "");
        }
    }, [userData, location.pathname])

    return (
        <div className={cl.container}>
            <div className={cl.content}>
                <div className={cl.navigationContainer}>
                    <div className={cl.navigationContent}>
                        <div className={cl.textAndLogOutContainer}>
                            <h2>Personal account</h2>
                            <button onClick={()=>deBounceWithConfirmation(()=>logOut())} className={cl.logOutBtn}>Log out</button>
                        </div>
                        <div className={cl.btnContainer}>
                            <Link to={routesEnum.profilePersonalData}>
                                <button
                                    className={location.pathname === routesEnum.profilePersonalData ? cl.navigationBtnActive : cl.navigationBtn}>Personal
                                    data
                                </button>
                            </Link>
                            <Link to={routesEnum.profileAppointmentsHistory}>
                                <button
                                    className={location.pathname === routesEnum.profileAppointmentsHistory ? cl.navigationBtnActive : cl.navigationBtn}>Appointment
                                    history
                                </button>
                            </Link>
                            <Link to={routesEnum.profileAChangePassword}>
                                <button
                                    className={location.pathname === routesEnum.profileAChangePassword ? cl.navigationBtnActive : cl.navigationBtn}>Change
                                    password
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={cl.ChangebleContentContainer}>
                    {location.pathname === routesEnum.profilePersonalData &&
                        <div className={cl.personalDataContainer}>
                            <div className={cl.profileFirstDataContainer}>
                                <div className={cl.profilePhoto}>
                                    <img width={"100%"} height={"100%"} src={dataSettingsState?.image_link ? dataSettingsState.image_link : "/ProfilePhoto.png"}/>
                                </div>
                                <h3 className={cl.fullname}>
                                    {userData.first_name + " " + userData.last_name}
                                    <span style={userData?.speciality?.name ? {} : {display: "none"}} className={cl.speciality}>{userData?.speciality?.name}</span>
                                </h3>

                                <div className={cl.emailContainer}>
                                <div className={cl.EmailSvgIconContainer}>
                                        <svg>
                                            <use xlinkHref={"/sprite.svg#EmailSvgIcon"}></use>
                                        </svg>
                                    </div>
                                    <span className={cl.email}>{userData.email}</span>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className={cl.dataContainerWithSaveBtn}>
                                <div className={cl.changeDataContainer}>
                                    <div className={cl.inputFieldContainer}>
                                        <label>First name</label>
                                        <input {...register('first_name')}
                                               onChange={(e)=>setDataSettingsState({...dataSettingsState, first_name: e.target.value || ""})}
                                               value={dataSettingsState?.first_name || ""}
                                               placeholder={"First name"}/>
                                    </div>
                                    <div className={cl.inputFieldContainer}>
                                        <label>Last name</label>
                                        <input {...register('last_name')}
                                               onChange={(e)=>setDataSettingsState({...dataSettingsState, last_name: e.target.value || ""})}
                                               value={dataSettingsState?.last_name || ""}
                                               placeholder={"Last name"}/>
                                    </div>
                                    <div className={cl.inputFieldContainer}>
                                        <label>Email</label>
                                        <input {...register('email')}
                                               onChange={(e)=>setDataSettingsState({...dataSettingsState, email: e.target.value || ""})}
                                               value={dataSettingsState?.email || ""}
                                               placeholder={"Email"}/>
                                    </div>
                                    <div className={cl.inputFieldContainer}>
                                        <label>Date of birth</label>
                                        <input {...register('date_of_birth')}
                                               onChange={(e)=>setDataSettingsState({...dataSettingsState, date_of_birth:e.target.value})}
                                               value={formatDateForInput(dataSettingsState?.date_of_birth || "")}
                                               style={{paddingRight: "12px"}} type={"date"}
                                               placeholder={"Date of birth"}/>
                                    </div>
                                    <div className={cl.inputFieldContainer}>
                                        <label>Phone</label>
                                        <input {...register('phone')}
                                               onChange={(e)=>setDataSettingsState({...dataSettingsState, phone: e.target.value || ""})}
                                               value={dataSettingsState?.phone || ""}
                                               type={"number"}
                                               placeholder={"Phone"}/>
                                    </div>
                                    {userData.roles && userData.roles.length > 0 ?
                                        <>
                                            <div className={cl.inputFieldContainer}>
                                                <label>Office number</label>
                                                <input {...register('office_number')}
                                                       onChange={(e)=>setDataSettingsState({...dataSettingsState, office_number: e.target.value || ""})}
                                                       value={dataSettingsState?.office_number || ""}
                                                       placeholder={"office number"}/>
                                            </div>
                                            <div className={cl.inputFieldContainer}>
                                                <label>Image link</label>
                                                <input {...register('image_link')}
                                                       onChange={(e)=>setDataSettingsState({...dataSettingsState, image_link: e.target.value || ""})}
                                                       value={dataSettingsState?.image_link || ""}
                                                       placeholder={"image link"}/>
                                            </div>
                                        </>
                                        :
                                        <div className={cl.inputFieldContainer}>
                                            <label>Insurance number</label>
                                            <input {...register('insurance_number')}
                                                   onChange={(e)=>setDataSettingsState({...dataSettingsState, insurance_number: e.target.value || ""})}
                                                   value={dataSettingsState?.insurance_number || ""}
                                                   placeholder={"Insurance number"}/>
                                        </div>
                                    }
                                    <div className={cl.inputFieldContainer}>
                                        <label>Address</label>
                                        <input {...register('address')}
                                               onChange={(e)=>setDataSettingsState({...dataSettingsState, address: e.target.value || ""})}
                                               value={dataSettingsState?.address || ""}
                                               placeholder={"Address"}/>
                                    </div>
                                    <div className={cl.inputFieldContainer}>
                                        <label>Gender</label>
                                        <input
                                            {...register('gender')}
                                            onChange={(e)=>setDataSettingsState({...dataSettingsState, gender: e.target.value || ""})}
                                            value={dataSettingsState?.gender || ""}
                                            placeholder={"Gender"}/>
                                    </div>
                                </div>
                                <div className={cl.saveBtnContainer}>
                                    <button type={"submit"}>Save</button>
                                </div>
                            </form>
                        </div>
                    }

                    {location.pathname === routesEnum.profileAppointmentsHistory &&
                        <div className={cl.appointmentHistoryContainer}>
                            <div className={cl.searchContainer}>
                                <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                                       placeholder={"search"} className={cl.search}/>
                            </div>
                            <table className={cl.customTable}>
                                <thead>
                                <tr>
                                    <th>{userData.roles && userData.roles.length > 0 ? "Patient" : "Doctor"}</th>
                                    <th>Service</th>
                                    <th>Diagnose</th>
                                    <th>Data</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredAppointments && filteredAppointments.length > 0 ?
                                    filteredAppointments.map((value, index) =>
                                        <tr key={index}>
                                            <td>{userData.roles && userData.roles.length > 0 ? value.patient.first_name + " " + value.patient.last_name : value.doctor.first_name + " " + value.doctor.last_name}</td>
                                            <td>{value.services.service || "not found"}</td>
                                            <td>{value?.diagnosis?.diagnosis || "not yet"}</td>
                                            <td>{value.date}</td>
                                            <td>{value.time}</td>
                                            <td>{value.status ? "Completed" : "In progres"}</td>
                                            <td>
                                                <button className={cl.moreBtn}>More</button>
                                            </td>
                                        </tr>
                                    )
                                    :
                                    <tr style={{display: "flex", justifyContent: "center"}}>
                                        <td style={{minWidth: "100%"}}>currently nothing</td>
                                    </tr>
                                }
                                </tbody>
                            </table>
                            <div className={cl.paginationPanelContainer}>
                                <div className={cl.statusInfoContainer}>
                                    <div
                                        className={cl.statusInfoText}>{`Showing ${searchState && (searchState.limit * (searchState.page - 1)) + 1} to ${searchState?.limit * searchState.page} of ${Amount || 0} entries`}</div>
                                </div>
                                <PaginationBar
                                    previousPageFunc={() => {
                                        setSearchState({...searchState!, page: searchState!.page - 1})
                                    }}
                                    setPageFunc={(page: number) => {
                                        if (searchState) {
                                            setSearchState({...searchState, page: page})
                                        }
                                    }}
                                    nextPageFunc={() => {
                                        setSearchState({...searchState!, page: searchState!.page + 1})
                                    }}
                                    currentPage={searchState && searchState.page || 1}
                                    amount={Amount && Amount || 1}
                                    limit={searchState && searchState.limit || 1}
                                    style={{justifyContent: "end"}}
                                />
                            </div>
                        </div>
                    }

                    {location.pathname === routesEnum.profileAChangePassword &&
                        <form onSubmit={changePasswordHandleSubmit(onSubmitChangePassword)} className={cl.changePasswordContainer}>
                            <div className={cl.changePasswordFieldsContainer}>
                                <div className={cl.inputFieldContainer}>
                                    <label>Current password</label>
                                    <div className={cl.closeVisionIconWithInput}>
                                        <input
                                            type={changePasswordState && changePasswordState.active === "current" ? "text" : "password"}
                                            style={{paddingRight: "24px"}} {...changePasswordRegister("currentPassword")}
                                            value={changePasswordState.currentPassword}
                                            onChange={(e) => setChangePasswordState({
                                                ...changePasswordState,
                                                currentPassword: e.target.value
                                            })} placeholder={"Current password"}/>
                                        <div onClick={()=>changeIconActivePasswordChange("current")} className={cl.iconEyeContainer}>
                                            <svg>
                                                <use xlinkHref={changePasswordState && changePasswordState.active === "current" ?  "/sprite.svg#OpenEyeIcon" : "/sprite.svg#CloseEyeIcon"}></use>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className={cl.inputFieldContainer}>
                                    <label>New password</label>
                                    <div className={cl.closeVisionIconWithInput}>
                                        <input
                                            style={{paddingRight:"24px"}} {...changePasswordRegister("newPassword")}
                                            type={changePasswordState && changePasswordState.active === "new" ? "text" : "password"}
                                           value={changePasswordState.newPassword}
                                           onChange={(e)=>setChangePasswordState({...changePasswordState, newPassword: e.target.value})} placeholder={"New password"}/>
                                        <div onClick={()=>changeIconActivePasswordChange("new")} className={cl.iconEyeContainer}>
                                            <svg>
                                                <use xlinkHref={changePasswordState && changePasswordState.active === "new" ?  "/sprite.svg#OpenEyeIcon" : "/sprite.svg#CloseEyeIcon"}></use>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className={cl.inputFieldContainer}>
                                <div className={cl.closeVisionIconWithInput}>
                                    <label>Confirm new password</label>
                                        <input
                                            type={changePasswordState && changePasswordState.active === "new" ? "text" : "password"}
                                            style={{paddingRight:"24px"}}
                                            {...changePasswordRegister("confirmPassword")} value={changePasswordState.confirmPassword}
                                           onChange={(e)=>setChangePasswordState({...changePasswordState, confirmPassword: e.target.value})} placeholder={"Confirm new password"}/>
                                    </div>
                                </div>
                            </div>
                            <div className={cl.changePasswordBtnContainer}>
                                <CustomBtn btnType={"submit"} styles={{width: "142px"}} type={CustomBtnTypes.update}/>
                            </div>
                        </form>
                    }

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;