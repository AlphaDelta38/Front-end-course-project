import React, {useEffect, useState} from 'react';
import cl from '../../modules/DoctorPage/DoctorPage.module.css'
import {DoctorsCardsInterface, roleInterface} from "../../types/doctorsType";
import {doctorAPI} from "../../services/DoctorService";


interface filtersAcitvityInterface{
    rating: string
    type: string,
    menuListTypeActive: string,
}





const DoctorPage = () => {

    const [doctorCardsArray, setDoctorCardsArray] = useState<DoctorsCardsInterface[]>([])
    const [rolesFilterArray, setRolesFilterArray] = useState<string[]>([])
    const [filtersAcitvity, setFiltersActivity] = useState<filtersAcitvityInterface>({rating: "all", type:"all", menuListTypeActive:"none"})

    const ratingConstant = ["from 0 to 1", "from 1 to 2", "from 2 to 3","from 3 to 4","from 4 to 5"];

    const {data: Doctors, error: doctorsError} = doctorAPI.useFetchAllDoctorsQuery({limit: 30, role:"doctor"})




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

                DoctorsArray.push({...value, raitings: raiting || 0, count: value.raitings.length || 0 })

            })

            const uniqueArray = new Set(roles)
            roles = [];

            uniqueArray.forEach((value)=>{
                roles.push(value)
            })

            setRolesFilterArray(roles);
            setDoctorCardsArray(DoctorsArray)
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


    useEffect(()=>{
        let DoctorsArray: DoctorsCardsInterface[] = [];

        if(Doctors){
            Doctors.forEach((value)=>{
                let totalNumber = 0;
                for (let i = 0; i < value.raitings.length; i++) {
                    totalNumber += value.raitings[i].rating
                }

                const raiting = totalNumber / value.raitings.length
                DoctorsArray.push({...value, raitings: raiting || 0, count: value.raitings.length || 0 })

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



        setDoctorCardsArray(DoctorsArray)
    }, [filtersAcitvity.rating, filtersAcitvity.type])


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
                            </div>
                            <div className={cl.OurDoctosItem__infoContainer}>
                                <h2>{`${value.first_name} ${value.last_name}`}</h2>
                                <small>Mon-Fri, 9:00 AM - 6:00 PM</small>
                                <span>{value.speciality}</span>
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
            </div>
        </div>
    );
};

export default DoctorPage;