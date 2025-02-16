import React, {ReactNode, useEffect, useState} from 'react';
import cl from '../../modules/AppointmentPage/Appointment.module.css'
import {Link, useLocation, useNavigate} from "react-router-dom";
import {appointmentsAPI} from "../../services/AppointmentsService";
import {specialityInterface} from "../../types/specialityType";
import {specialityAPI} from "../../services/SpecialityService";
import {ratingAPI} from "../../services/RatingService";
import {calculateAge, convertToInputTypeDate, dateConvert} from "../../utils/Date";
import {errorSlice} from "../../store/reducers/ErrorSlice";
import {messageType} from "../PopupMessage/PopupMessageItem";
import {useAppDispatch} from "../../hooks/redux";



const Speciality = ({ specialityId }: { specialityId: number }) =>{
    const {data: Speciality}  = specialityAPI.useGetOneSpecialityQuery(specialityId)
    return (
        <span>{Speciality ? Speciality.name : ""}</span>
    )
}


const AppointmentPage = () => {


    const [modalWindowActive, setModalWindowActive] = useState<boolean>(false)
    const location = useLocation()
    const navigate = useNavigate()
    const id = Number(location.pathname.split("/")[2]) || 0
    const dispatch = useAppDispatch()


    const [createRating] = ratingAPI.useCreateRatingMutation({})
    const {data: AppointmentsData, isError, error: Errors} = appointmentsAPI.useGetOneAppointmentQuery(id)
    const {data: Rating, refetch: RatingRefetch} = ratingAPI.useGetAllRatingsQuery({
        id: AppointmentsData?.doctor.id || 0,
        type: "doctor",
    }, {
        skip: !AppointmentsData,
    })


    function calculateSummaryRating():number{
        if(Rating){
            let countRating = 0;
            Rating.forEach((value)=>{
                countRating += Number(value.rating)
            })

            return countRating !== 0 ? Math.round(countRating/Rating.length) : 0
        }
        return 0
    }


    function calculateRatingSetOfPatient():number{
        if(Rating){
            let countRating = 0;
            Rating.forEach((value)=>{
                if(AppointmentsData && value.patient_id === AppointmentsData.patient_id){
                    countRating = value.rating
                }
            })

            return countRating || 0
        }
        return 0
    }

    function AmPmFormat(inputTime: string){
        const time = Number(inputTime.split(":")[0])
        return time < 12 ? "AM" : "PM"
    }

    async function setDoctorRating(rating:number){
        try {
            let response;
            if(AppointmentsData){
                response  = await createRating({
                    rating: rating,
                    doctor_id: AppointmentsData.doctor_id,
                    patient_id: AppointmentsData.patient_id,
                })
            }

            if(response?.error){
                //@ts-ignore
                throw new Error(response?.error.data.message)

            }else{
                RatingRefetch()
                dispatch(errorSlice.actions.setErrors({message: "Set rating is successfully", type: messageType.successType}))
            }

        }catch (e){
            //@ts-ignore
            const error = e.message || "Error with update"
            dispatch(errorSlice.actions.setErrors({message: error, type: messageType.errorType}))
        }
    }

    useEffect(()=>{
        if(isError){
            navigate("/general")
        }
    },[isError])

    return (
        <div className={cl.container}>
            <div className={cl.content}>
                <div className={cl.doctorContainer}>
                    <div className={cl.photoWithNameContainer}>
                        <div className={cl.doctorPhoto}>
                            <img src={AppointmentsData ? AppointmentsData.doctor.image_link : ""} alt={"doctor photo"}/>
                        </div>
                        <div className={cl.doctorName}>
                            <h2>{AppointmentsData ? AppointmentsData.doctor.first_name + " " + AppointmentsData.doctor.last_name : ""}</h2>
                        </div>
                    </div>
                    <div className={cl.doctorDataContainer}>
                        <div className={cl.doctorPositionContainer}>
                            <span>Position: </span>
                            {AppointmentsData && <Speciality specialityId={AppointmentsData.doctor.speciality_id}/>}
                        </div>
                        <br/>
                        <div className={cl.doctorRating}>
                            <svg>
                                <use xlinkHref={"/sprite.svg#StarIcon"}></use>
                            </svg>
                            <span>
                                {Rating && calculateSummaryRating()}/5
                            </span>
                            <span>{`(${Rating?.length || 0})`}</span>
                        </div>
                        <table className={cl.doctorData}>
                            <tbody>
                            <tr>
                                <th>Full name:</th>
                                <td>{AppointmentsData ? AppointmentsData.doctor.first_name + " " + AppointmentsData.doctor.last_name : ""}</td>
                            </tr>
                            <tr>
                                <th>Age:</th>
                                <td>{AppointmentsData ? calculateAge(AppointmentsData.doctor.date_of_birth) : ""}</td>
                            </tr>
                            <tr>
                                <th>Phone:</th>
                                <td>{AppointmentsData ? AppointmentsData.doctor.phone : ""}</td>
                            </tr>
                            <tr>
                                <th>Email:</th>
                                <td>{AppointmentsData ? AppointmentsData.doctor.email : ""}</td>
                            </tr>
                            <tr>
                                <th>Office number:</th>
                                <td>{AppointmentsData ? AppointmentsData.doctor.office_number : ""}</td>
                            </tr>
                            </tbody>
                        </table>
                        <div className={cl.setRatingContainer}>
                            <span>
                                Rate this doctor:
                            </span>
                            <div className={cl.starsContainer}>
                                {Array.from({length: 5}).map((value,index) =>
                                    <div className={cl.star}>
                                        <svg onClick={()=>setDoctorRating(5-index)} style={Rating && calculateRatingSetOfPatient() >= (5-index) ? {fill: "yellow"} : {}}>
                                            <use xlinkHref={"/sprite.svg#StarIcon"}></use>
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cl.AppointmentDataContainer}>
                    <div className={cl.doctorRecommendationContainer}>
                        <div className={cl.doctorRecommendation}>
                            <div className={cl.notesContainer}>
                                <h2>Notes from your doctor:</h2>
                                <div className={cl.notesTextContainer}>
                                    <span className={cl.quatationMark}>"</span>
                                    <span className={cl.text}>{AppointmentsData?.notes ?? "not yet"}</span>
                                </div>
                            </div>
                            <div className={cl.prescriptionContainer}>
                                <h2>Prescription:</h2>
                                <div className={cl.notesTextContainer}>
                                    <span className={cl.tabletsMark}>
                                        <svg>
                                            <use xlinkHref={"/sprite.svg#TabletIcon"}></use>
                                        </svg>
                                    </span>
                                    <span className={cl.text}>{AppointmentsData?.prescription ?? "not yet"}</span>
                                </div>
                            </div>
                        </div>
                        <div className={cl.btnContainer}>
                            <Link to={"/profile/appointmentsHistory"} style={{textDecoration:"none", color:"inherit"}} >
                                <button className={cl.returnBtn}>Back</button>
                            </Link>
                        </div>
                    </div>
                    <div className={cl.patientAndAppointmentDataContainer}>
                        <div className={cl.dataColum}>
                            <span>Patient name:</span>
                            <span>{AppointmentsData ? AppointmentsData.patient.first_name + " " + AppointmentsData.patient.last_name : ""}</span>
                            <span>Patient age:</span>
                            <span>{AppointmentsData ? calculateAge(AppointmentsData.patient.date_of_birth) : ""}</span>
                            <button onClick={()=>setModalWindowActive(true)} className={cl.moreBtn}>More</button>
                        </div>
                        <div className={cl.dataColum}>
                            <span>Data:</span>
                            <span>{AppointmentsData ? convertToInputTypeDate(AppointmentsData.date) : ""}</span>
                            <span>Time:</span>
                            <span>{AppointmentsData ? `${AppointmentsData.time} ${AmPmFormat(AppointmentsData.time)}` : ""}</span>
                        </div>
                        <div className={cl.dataColum}>
                            <span>Diagnose:</span>
                            <span>{AppointmentsData?.diagnosis?.diagnosis ?? "not yet"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {
                modalWindowActive &&
                <div className={cl.modalWindowContainer}>
                    <div className={cl.moreInfoContainer}>
                        <div className={cl.closeBtnContainer}>
                            <div className={cl.closeBtn}>
                                <button onClick={() => setModalWindowActive(false)} className={cl.closeBtn}>
                                    <span></span>
                                </button>
                            </div>
                        </div>
                        <table>
                            <tbody>
                            <tr>
                                <th style={{color: "#325CC8"}}>First name:</th>
                                <td>
                                    <input value={AppointmentsData ? AppointmentsData.patient.first_name : ""} placeholder={"first  name"}/>
                                </td>
                            </tr>
                            <tr>
                                <th>Phone:</th>
                                <td>
                                    <input value={AppointmentsData ? AppointmentsData.patient.phone : ""} placeholder={"Phone"}/>
                                </td>
                            </tr>
                            <tr>
                                <th style={{color: "#325CC8"}}>Last name:</th>
                                <td>
                                    <input value={AppointmentsData ? AppointmentsData.patient.last_name : ""} placeholder={"Last name"}/>
                                </td>
                            </tr>
                            <tr>
                                <th>Email:</th>
                                <td>
                                    <input value={AppointmentsData ? AppointmentsData.patient.email : ""} placeholder={"Email"}/>
                                </td>
                            </tr>
                            <tr>
                                <th>Birthday:</th>
                                <td>
                                    <input value={AppointmentsData ? convertToInputTypeDate(AppointmentsData.patient.date_of_birth) : ""} placeholder={"Birthday"}/>
                                </td>
                            </tr>
                            <tr>
                                <th>Address:</th>
                                <td>
                                    <input value={AppointmentsData ? AppointmentsData.patient.address : ""}  placeholder={"Address"}/>
                                </td>
                            </tr>
                            <tr>
                                <th>Gender:</th>
                                <td>
                                    <input value={AppointmentsData ? AppointmentsData.patient.gender : ""} placeholder={"Gender"}/>
                                </td>
                            </tr>
                            <tr>
                                <th>Insurance num:</th>
                                <td>
                                    <input value={AppointmentsData ? AppointmentsData.patient.insurance_number : ""} placeholder={"Insurance number"}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            }

        </div>
    );
};

export default AppointmentPage;