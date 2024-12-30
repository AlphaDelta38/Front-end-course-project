import React, {useEffect, useState} from 'react';
import cl from '../../modules/DoctorPage/DoctorPage.module.css'
import {DoctorsCardsInterface} from "../../types/doctorsType";
import {doctorAPI} from "../../services/DoctorService";
import {serviceAPI} from "../../services/ServicesService";
import {serviceItems} from "../../types/serviceType";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {useNavigate} from "react-router-dom";
import {routesEnum} from "../../types/routes.type";
import {errorSlice} from "../../store/reducers/ErrorSlice";
import {messageType} from "../PopupMessage/PopupMessageItem";


interface filtersAcitvityInterface{
    rating: string
    type: string,
    menuListTypeActive: string,
}


interface chooseAppoinmentsTimeStateInterface{
    currentTimeChosen: string,
    typeOfListActivity: boolean,
    chosenDate: string,
    chosenService: string,
    menuActive: boolean,
    doctorId: number

}


enum EnumAppointmnetsFilters{
    date=  "date",
    service= "service",
    listActivity= "listActivity",
    menuActive= "menuActive",
    time= "time",
}


const DoctorPage = () => {

    const [doctorCardsArray, setDoctorCardsArray] = useState<DoctorsCardsInterface[]>([])
    const [rolesFilterArray, setRolesFilterArray] = useState<string[]>([])
    const [filtersAcitvity, setFiltersActivity] = useState<filtersAcitvityInterface>({rating: "all", type:"all", menuListTypeActive:"none"})
    const [chooseSettingsForAppointments, setChooseSettingsForAppointments] = useState<chooseAppoinmentsTimeStateInterface>({
        chosenDate:  new Date().toISOString().split("T")[0],
        chosenService: "none",
        currentTimeChosen:"none",
        typeOfListActivity: false,
        menuActive: false,
        doctorId: 0,
    })
    const [services, setServices] = useState<serviceItems[]>()


    const [booketTimeState, setBookedTimeState] = useState<string[]>([])
    const ratingConstant = ["from 0 to 1", "from 1 to 2", "from 2 to 3","from 3 to 4","from 4 to 5"];
    const timeToAppointmentsConstant = ["9:00","9:30","10:00","10:30", "11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30",];
    const toDay = new Date().toISOString().split("T")[0]
    const navigate = useNavigate();

    const {data: Doctors, error: doctorsError, refetch} = doctorAPI.useFetchAllDoctorsQuery({limit: 30, role:"doctor"})
    const {data: Services, error: ServicesError} = serviceAPI.useFetchAllServiceQuery("")
    const [createAppointments, { isLoading, isSuccess, error: appoinmentsError }] = doctorAPI.useCreateAppointmentsMutation();

    const {id: UserId} = useAppSelector(state => state.userReducer)
    const dispatch = useAppDispatch()

    function changeAppointmentsState(caller: EnumAppointmnetsFilters, state: any){
        if(caller === EnumAppointmnetsFilters.date){
            setChooseSettingsForAppointments({...chooseSettingsForAppointments, chosenDate: state, currentTimeChosen: ""})
        }else if(caller === EnumAppointmnetsFilters.service){
            setChooseSettingsForAppointments({...chooseSettingsForAppointments, chosenService: state, typeOfListActivity: false})
        }else if(caller === EnumAppointmnetsFilters.listActivity){
           if(chooseSettingsForAppointments.typeOfListActivity){
               setChooseSettingsForAppointments({...chooseSettingsForAppointments, typeOfListActivity: false})
           }else{
               setChooseSettingsForAppointments({...chooseSettingsForAppointments, typeOfListActivity: true})
           }
        }else if(caller === EnumAppointmnetsFilters.menuActive){
            if(chooseSettingsForAppointments.menuActive){
                setChooseSettingsForAppointments({...chooseSettingsForAppointments, menuActive: false, currentTimeChosen: "", chosenDate: new Date().toISOString().split("T")[0]})
            }else{
                setBookedTimeState(doctorCardsArray[state].bookedTime)
                setChooseSettingsForAppointments({...chooseSettingsForAppointments, menuActive: true, doctorId: state})
            }
        }else if(caller === EnumAppointmnetsFilters.time){
            setChooseSettingsForAppointments({...chooseSettingsForAppointments, currentTimeChosen: state})
        }

    }



    useEffect(()=>{
        if(Doctors && Doctors.length > 0){
            const DoctorsArray: DoctorsCardsInterface[] = [];
            let roles: string[] = [];

            Doctors.forEach((value)=>{
                let totalNumber = 0;
                for (let i = 0; i < value.raitings.length; i++) {
                    totalNumber += value.raitings[i].rating
                }

                const raiting = totalNumber / value.raitings.length

                value.roles.forEach((value)=>{
                    roles.push(value.role)
                })

                const bookedTimes: string[] = [];
                value.appointments.filter((value)=>{
                    const day = value.date.toString().split("-")[0]
                    const month = value.date.toString().split("-")[1]
                    const year = value.date.toString().split("-")[2]
                    const fulldate = `${year}-${month}-${day}`
                    return fulldate === chooseSettingsForAppointments.chosenDate.toString().split("T")[0]
                }).forEach((value)=>{

                    bookedTimes.push(value.time)
                })

                DoctorsArray.push({...value, raitings: raiting || 0, count: value.raitings.length || 0, bookedTime: bookedTimes })

            })

            const uniqueArray = new Set(roles)
            roles = [];

            uniqueArray.forEach((value)=>{
                roles.push(value)
            })

            setRolesFilterArray(roles);
            setDoctorCardsArray(DoctorsArray.filter((value)=>value.speciality && value.speciality.name !== "none" ))
        }
    }, [Doctors])


    function changeState(caller: string, info: string){
        if(caller === "type"){
            setFiltersActivity({...filtersAcitvity, type: info, menuListTypeActive:"none"})
        }else if(caller === "rating"){
            setFiltersActivity({...filtersAcitvity, rating: info, menuListTypeActive:"none"})
        }else if(caller === "typeActive"){
            if(filtersAcitvity.menuListTypeActive === "type"){
                setFiltersActivity({...filtersAcitvity, menuListTypeActive:"none"})
            }else{
                setFiltersActivity({...filtersAcitvity, menuListTypeActive:"type"})
            }
        }else if(caller === "ratingType"){
            if(filtersAcitvity.menuListTypeActive === "rating"){
                setFiltersActivity({...filtersAcitvity, menuListTypeActive:"none"})
            }else{
                setFiltersActivity({...filtersAcitvity, menuListTypeActive:"rating"})
            }
        }

    }

    async function createAppointmentsSumbit(){
        try {
            if(UserId !== 0){
                if(chooseSettingsForAppointments.currentTimeChosen === ""){
                    return;
                }


                let serviceId: number = 0;

                services?.forEach((value)=>{
                    if(value.service === chooseSettingsForAppointments.chosenService){
                        serviceId = value.id
                    }
                } )
                const day = chooseSettingsForAppointments.chosenDate.toString().split("T")[0].split("-")[2]
                const month = chooseSettingsForAppointments.chosenDate.toString().split("T")[0].split("-")[1]
                const year = chooseSettingsForAppointments.chosenDate.toString().split("T")[0].split("-")[0]

                const response = await createAppointments({
                    date: `${day}-${month}-${year}`,
                    doctor_id: doctorCardsArray[chooseSettingsForAppointments.doctorId].id,
                    time: chooseSettingsForAppointments.currentTimeChosen,
                    status: false,
                    service_id: serviceId,
                    patient_id: UserId,
                }).unwrap()

                setChooseSettingsForAppointments({...chooseSettingsForAppointments, menuActive: false, currentTimeChosen:""})
                refetch()
                dispatch(errorSlice.actions.setErrors({message:"Appointments successful created", type: messageType.successType}))
            }else{
                navigate(routesEnum.login)
            }
        }catch (e){
            dispatch(errorSlice.actions.setErrors({message:"Failed to create appointments", type: messageType.errorType}))
        }
    }


    useEffect(()=>{
        let DoctorsArray: DoctorsCardsInterface[] = [];

        if(Doctors){
            Doctors.forEach((value)=>{
                let totalNumber = 0;
                for (let i = 0; i < value.raitings.length; i++) {
                    totalNumber += value.raitings[i].rating
                }

                const raiting = totalNumber / value.raitings.length

                const bookedTimes: string[] = [];

                value.appointments.filter((value)=>{
                    const day = value.date.toString().split("-")[0]
                    const month = value.date.toString().split("-")[1]
                    const year = value.date.toString().split("-")[2]
                    const fulldate = `${year}-${month}-${day}`
                    return fulldate === chooseSettingsForAppointments.chosenDate.toString().split("T")[0]
                }).forEach((value)=>{
                    bookedTimes.push(value.time)
                })

                DoctorsArray.push({...value, raitings: raiting || 0, count: value.raitings.length || 0,  bookedTime: bookedTimes})
            })
        }


        if(filtersAcitvity.rating !== "all"){
            const from = Number(filtersAcitvity.rating.split(" ")[1])
            const to = Number(filtersAcitvity.rating.split(" ")[3])
            DoctorsArray = DoctorsArray.filter((value)=>from <= value.raitings && to >= value.raitings)
        }
        if(filtersAcitvity.type !== "all"){
            DoctorsArray = DoctorsArray.filter((value)=>value.roles.some((value)=>value.role === filtersAcitvity.type))
        }



        setDoctorCardsArray(DoctorsArray.filter((value)=>value.speciality && value.speciality.name !== "none" ))
    }, [filtersAcitvity.rating, filtersAcitvity.type])




    useEffect(()=>{
        if(Services){
            setServices(Services)
            changeAppointmentsState(EnumAppointmnetsFilters.service, Services[0].service)
        }
    }, [Services])


    useEffect(()=>{
        if(doctorCardsArray && doctorCardsArray.length > 0){
            const DoctorsArray: DoctorsCardsInterface[] = [];
            const bookedTimes: string[] = [];

            doctorCardsArray[chooseSettingsForAppointments.doctorId].appointments.filter((value)=>{
                const day = value.date.toString().split("-")[0]
                const month = value.date.toString().split("-")[1]
                const year = value.date.toString().split("-")[2]
                const fulldate = `${year}-${month}-${day}`
                return fulldate === chooseSettingsForAppointments.chosenDate.toString()
            }).forEach((value)=>{
                bookedTimes.push(value.time)
            })

            setBookedTimeState(bookedTimes)

        }
    }, [chooseSettingsForAppointments.chosenDate])





    return (
        <div className={cl.container}>
            <div className={cl.content}>
                <div className={cl.chooseTypeOfDoctorContainer}>
                    <div className={cl.textContainer}>
                        <h1>Team of doctors</h1>
                        <p>Our professionals</p>
                    </div>
                    <div className={cl.chooseActionContainer}>
                        <div className={cl.chooseContainer}>
                            <div className={cl.doctorTypeChooseContainer}>
                                <div className={cl.circle}>
                                    <svg width={"34px"} height={"32px"}>
                                        <use xlinkHref={"/sprite.svg#HumanIcon"}></use>
                                    </svg>
                                </div>
                                <div className={cl.chooseTextContainer}>
                                    <h2>Doctor type:</h2>
                                    <div className={cl.buttonChooseContainer}>
                                        <button onClick={()=>changeState("typeActive", "")} className={cl.chooseBtn}>{filtersAcitvity.type === "all" ? "All doctors" : filtersAcitvity.type}</button>
                                        <div style={filtersAcitvity.menuListTypeActive === "type" ? {transform: "rotate(180deg)"} : {}} className={cl.shevronContainer}>
                                            <svg width={"24px"} height={"14px"}>
                                                <use xlinkHref={"/sprite.svg#ShevronIcon"}></use>
                                            </svg>
                                        </div>
                                        <div style={filtersAcitvity.menuListTypeActive === "type" ? {} : {display: "none"} } className={cl.upDownList}>
                                            <button style={filtersAcitvity.type === "all" ? {color:"#325CC8"} : {}} onClick={()=>changeState("type", "all")} className={cl.actionButtonList}>All doctors</button>
                                            {rolesFilterArray && rolesFilterArray.map((value, index) =>
                                                <button style={filtersAcitvity.type === value ?  {color:"#325CC8"} : {}} key={index} onClick={()=>changeState("type", value)} className={cl.actionButtonList}>{value}</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cl.doctorTypeChooseContainer}>
                                <div className={cl.circle}>
                                    <svg width={"34px"} height={"34px"}>
                                        <use xlinkHref={"/sprite.svg#SmileIcon"}></use>
                                    </svg>
                                </div>
                                <div className={cl.chooseTextContainer}>
                                    <h2>Doctor rating:</h2>
                                    <div className={cl.buttonChooseContainer}>
                                        <button onClick={()=>changeState("ratingType", "")} className={cl.chooseBtn}>{filtersAcitvity.rating === "all" ? "All rating" : filtersAcitvity.rating}</button>
                                        <div style={filtersAcitvity.menuListTypeActive === "rating" ? {transform: "rotate(180deg)"} : {}} className={cl.shevronContainer}>
                                            <svg width={"24px"} height={"14px"}>
                                                <use xlinkHref={"/sprite.svg#ShevronIcon"}></use>
                                            </svg>
                                        </div>
                                        <div
                                            style={filtersAcitvity.menuListTypeActive === "rating" ? {} : {display: "none"}}
                                            className={cl.upDownList}>
                                            <button style={filtersAcitvity.rating === "all" ? {color: "#325CC8"} : {}} onClick={() => changeState("rating", "all")} className={cl.actionButtonList}>All rating
                                            </button>
                                            {ratingConstant && ratingConstant.map((value, index) =>
                                                <button style={filtersAcitvity.rating === value ? {color: "#325CC8"} : {}} key={index} onClick={() => changeState("rating", value)} className={cl.actionButtonList}>{value}</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cl.DoctorItemsCardContainer}>
                    {doctorCardsArray.map((value, index) =>
                        <div key={index} className={cl.OurDoctosItem}>
                            <div className={cl.OurDoctosItem__photoContainer}>
                                <img width={"100%"} height={"100%"} src={`${value.image_link}`} alt={"doctor img"}/>
                                <button  onClick={()=>changeAppointmentsState(EnumAppointmnetsFilters.menuActive, index)} className={cl.bookBtn}>Book</button>
                            </div>
                            <div className={cl.OurDoctosItem__infoContainer}>
                                <h2>{`${value.first_name} ${value.last_name}`}</h2>
                                <small>Mon-Fri, 9:00 AM - 6:00 PM</small>
                                <span>{value.speciality && value.speciality.name}</span>
                                <div className={cl.OurDoctosItem__raitingContainer}>
                                    <div className={cl.raiting}>
                                        <svg className={cl.raiting__starIcon}>
                                            <use xlinkHref={"/sprite.svg#StarIcon"}></use>
                                        </svg>
                                        {value.raitings}
                                    </div>
                                    <div className={cl.countOfLikes}>
                                        {`(${value.count})`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {
                    chooseSettingsForAppointments.menuActive &&
                        <div className={cl.bookMenuContainer}>
                            <div className={cl.bookMenuActive}>
                                <div className={cl.bookMenuHeader}>
                                    {`${doctorCardsArray[chooseSettingsForAppointments.doctorId].first_name} ${doctorCardsArray[chooseSettingsForAppointments.doctorId].last_name}`}
                                </div>
                                <div className={cl.bookMeniContentContainer}>
                                    <div className={cl.specialityBox}>
                                        {doctorCardsArray[chooseSettingsForAppointments.doctorId].speciality.name}
                                    </div>
                                    <div className={cl.chooseActionsContainer}>
                                        <div className={cl.actionContainer}>
                                            <div className={cl.textDay}>
                                                day:
                                            </div>
                                            <div className={cl.chosenDayContainer}>
                                                <input defaultValue={toDay} onChange={(e)=>changeAppointmentsState(EnumAppointmnetsFilters.date, e.target.value )} type={"date"}  min={new Date().toISOString().split('T')[0]}  className={cl.dataChoose}/>
                                            </div>
                                        </div>
                                        <div className={cl.actionContainer}>
                                            <div className={cl.textDay}>
                                                services:
                                            </div>
                                            <div className={cl.chosenDayContainer}>
                                                <button onClick={()=>changeAppointmentsState(EnumAppointmnetsFilters.listActivity, "")}>{chooseSettingsForAppointments.chosenService}</button>
                                                <div style={chooseSettingsForAppointments.typeOfListActivity ? {transform: "rotate(180deg)"} : {}} className={cl.shevronContainer}>
                                                    <svg width={"17px"} height={"10px"}>
                                                        <use xlinkHref={"/sprite.svg#SmallShevronIcon"}></use>
                                                    </svg>
                                                </div>
                                                <div style={chooseSettingsForAppointments.typeOfListActivity ? {} : {display: "none"}} className={cl.appointmentsListContainer}>
                                                    {services && services.map((value)=><div onClick={()=>changeAppointmentsState(EnumAppointmnetsFilters.service, value.service)} key={value.id}>{value.service}</div>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cl.ChooseTimeContainer}>
                                        {booketTimeState && timeToAppointmentsConstant.map((value, index) =>
                                            <button
                                                disabled={booketTimeState.some((e)=>e === value)}
                                                onClick={()=>changeAppointmentsState(EnumAppointmnetsFilters.time, value)}
                                                style={booketTimeState.some((e)=>e === value)
                                                    ? {backgroundColor:"red"}
                                                    : chooseSettingsForAppointments.currentTimeChosen === value ? {backgroundColor:"green"} : {}
                                            } key={index} className={cl.chooseTimeBtn}>{value}</button>
                                        )}
                                    </div>
                                    <div className={cl.finalBtnsOfBook}>
                                        <button onClick={()=>createAppointmentsSumbit()} className={cl.finalBtn}>
                                            Book
                                        </button>
                                        <button onClick={()=>changeAppointmentsState(EnumAppointmnetsFilters.menuActive, "")} className={cl.finalBtn}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        </div>
    );
};

export default DoctorPage;