import React, {useCallback, useEffect, useRef, useState} from 'react';
import cl from "../../modules/GeneralPage/GeneralPage.module.css"
import {newsAPI, sortForwards} from "../../services/NewsService";
import {useAppDispatch} from "../../hooks/redux";
import {errorSlice} from "../../store/reducers/ErrorSlice";
import {messageType} from "../PopupMessage/PopupMessageItem";
import {NewsItemInterface} from "../../types/newsType";
import {doctorAPI} from "../../services/DoctorService";
import {DoctorsCardsInterface} from "../../types/doctorsType";
import {gsap} from "gsap";
import {Link, useNavigate} from "react-router-dom";
import {routesEnum} from "../../types/routes.type";
import {dateConvert} from "../../utils/Date";


interface cordinateData{
    startX: number,
    lastPosition: number,
    canStart: string,
}

const GeneralPage = () => {


    const [newsCardArray, setNewsCardArray] = useState<NewsItemInterface[]>([])
    const [doctorCardsArray, setDoctorCardsArray] = useState<DoctorsCardsInterface[]>([])

    const sliderRef = useRef<HTMLDivElement | null>(null);
    const sliderTapeRef = useRef<HTMLDivElement | null>(null);
    const itemRef = useRef<HTMLDivElement | null>(null);
    const cordinateDataRef = useRef<cordinateData | null>(null)


    const [cordinateData, setcordinateData] = useState<cordinateData>({lastPosition: 0, startX: 0, canStart: "start"})

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const {data: News, error: newsError, isLoading} = newsAPI.useFetchAllNewsQuery({limit: 30, sortForward: sortForwards.descending})
    const {data: Doctors, error: doctorsError} = doctorAPI.useFetchAllDoctorsQuery({limit: 30, role:"doctor"})




    const scrollToSection = (target:any) => {
        gsap.to(window, {
            duration: 1.5,
            scrollTo: { y: target, autoKill: true },
            ease: "power2.out"
        });
    };


    useEffect(()=>{
        if(News && News.length > 0){
            setNewsCardArray(News)
        }
    }, [News])

    useEffect(()=>{
        if(Doctors && Doctors.length > 0){
            const DoctorsArray: DoctorsCardsInterface[] = [];
            Doctors.forEach((value)=>{
                let totalNumber = 0;
                for (let i = 0; i < value.raitings.length; i++) {
                    totalNumber += value.raitings[i].rating
                }

                const raiting = totalNumber / value.raitings.length

                DoctorsArray.push({...value, raitings: raiting || 0, count: value.raitings.length || 0, bookedTime: [] })

            })
            DoctorsArray.sort((a,b)=> b.raitings - a.raitings)


            setDoctorCardsArray(DoctorsArray.filter((value,index)=>index <= 3))
        }
    }, [Doctors])




    function onMouseDown(event: React.MouseEvent){

        if(cordinateData.canStart !== "start"){
            return;
        }

        const transformValue = sliderTapeRef.current?.style.transform;
        let translateValue = 0;

        if (transformValue) {
            const translateXMatch = transformValue.match(/translateX\(([^)]+)px\)/);
            if (translateXMatch && translateXMatch[1]) {
                translateValue = parseFloat(translateXMatch[1]);
            }
        }

        setcordinateData({startX: event.clientX, lastPosition: translateValue, canStart: "stop"})

        document.body.style.userSelect = 'none';
        if(sliderTapeRef.current){
            sliderTapeRef.current.style.transition = "none";
        }
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", onMouseUp);
    }


    const move = useCallback((e: MouseEvent)=>{
        const startPosition = cordinateDataRef.current?.startX;
        const currentPosition = cordinateDataRef.current?.lastPosition;
        if(startPosition){
            sliderTapeRef.current?.style.setProperty("transform",`translateX(${currentPosition!+(e.clientX - startPosition)}px)`);
        }
    }, [])

    function onMouseUp(e: React.MouseEvent | MouseEvent){

        if(cordinateDataRef.current?.canStart !== "stop"){
            return;
        }

        const transformValue = sliderTapeRef.current?.style.transform;
        let translateValue = 0;

        const widthOfTape = sliderTapeRef.current?.clientWidth
        const widthOfSlider = sliderRef.current?.clientWidth

        if (transformValue) {
            const translateXMatch = transformValue.match(/translateX\(([^)]+)px\)/);
            if (translateXMatch && translateXMatch[1]) {
                translateValue = parseFloat(translateXMatch[1]);
            }
        }

        const itemWidth = itemRef.current?.clientWidth
        if(widthOfTape && widthOfSlider){
            if(translateValue < (widthOfSlider - widthOfTape)){
                sliderTapeRef.current?.style.setProperty("transform",`translateX(${widthOfSlider - widthOfTape}px)`);
            }else  if(translateValue > 0){
                sliderTapeRef.current?.style.setProperty("transform",`translateX(${0}px)`);
            }else{
                if((cordinateData.startX - e.clientX) > 0){
                    const xFactor = Math.ceil(translateValue/(itemWidth!+40)!*-1)
                    sliderTapeRef.current?.style.setProperty("transform",`translateX(${((itemWidth!+40)*-1) * xFactor}px)`);
                }else{
                    const xFactor = Math.floor(translateValue/(itemWidth!+40)!*-1)
                    sliderTapeRef.current?.style.setProperty("transform",`translateX(${((itemWidth!+40)*-1) * xFactor}px)`);
                }
            }
        }


        document.body.style.userSelect = "";
        if(sliderTapeRef.current){
            sliderTapeRef.current.style.transition = "0.3s ease";
        }
        setcordinateData({...cordinateData, canStart: "start"})
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", onMouseUp);
    }






    useEffect(() => {

        return ()=>{
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", onMouseUp);
        }
    }, []);

    useEffect(() => {
        cordinateDataRef.current = cordinateData;
    }, [cordinateData]);


    useEffect(()=>{
        if(newsError){
            dispatch(errorSlice.actions.setErrors({message: "Failed to load news", type: messageType.errorType}))
        }
        if(doctorsError){
            dispatch(errorSlice.actions.setErrors({message: "Failed to load doctors", type: messageType.errorType}))
        }
    },[newsError, doctorsError])

    return (
        <div className={cl.container}>
            <div className={cl.container__SheduleSection}>
                <div className={cl.sheduleContainer}>
                    <h3>MEDICAL CENTER</h3>
                    <h1>YOUR HEALTH <span className={cl.OurSpan}>OUR</span> MISSION</h1>
                    <div className={cl.shedulesBtnContainer}>
                        <button onClick={() => navigate("/doctors")} className={cl.shedules_button}>
                            Schedule now
                        </button>
                        <button onClick={() => scrollToSection("#ourDoctors")} className={cl.shedules_button}>
                            Our doctors
                        </button>
                    </div>
                </div>
                <div className={cl.lastNewsContainer}>
                    {News &&
                        <div className={cl.lastNews__content}>
                            <small className={cl.lastNews__date}>
                                {dateConvert(News[0].createdAt)}
                            </small>
                            <div className={cl.lastNews__photoContainer}>
                                <img onClick={()=>navigate(`/news/${News[0].id}`)} width="100%" height="100%" src={`${News[0].image_link}`} alt={"photo of last news"}/>
                            </div>
                            <div className={cl.lastNews_textContainer}>
                                {News[0].text}
                            </div>
                            <button onClick={()=>navigate(`/news/${News[0].id}`)} className={cl.lastNews__button}>
                                Learn more
                            </button>
                        </div>
                    }
                </div>
            </div>
            <div className={cl.container__SerivceSection}>
                <div className={cl.service__contentContainer}>
                    <h1 className={cl.service__generalText}>
                        Health service for you
                    </h1>
                    <p className={cl.service__secontText}>
                        Our clinic provides a comprehensive selection of health services focused on your wellness.
                        From heart assessments to pediatric care, each service is designed to meet your unique health
                        needs.
                        Let us support you in achieving and maintaining a healthy lifestyle.
                    </p>
                    <div className={cl.service__catalogContainer}>
                        <div className={cl.catalog__itemsContainer}>
                        <div className={cl.catalog__item}>
                                <div className={cl.item__IconContainer}>
                                    <img width={"100%"} height={"100%"} src={"/HealtIcon.png"} alt={"Icons"}/>
                                </div>
                                <div className={cl.item__text}>
                                    Heart Assessment
                                </div>
                            </div>
                            <div className={cl.catalog__item}>
                                <div className={cl.item__IconContainer}>
                                    <img width={"100%"} height={"100%"} src={"/ScopeIcon.png"} alt={"Icons"}/>
                                </div>
                                <div className={cl.item__text}>
                                    General Health Check-Up
                                </div>
                            </div>
                            <div className={cl.catalog__item}>
                                <div className={cl.item__IconContainer}>
                                    <img width={"100%"} height={"100%"} src={"/TeddyHealthIcon.png"} alt={"Icons"}/>
                                </div>
                                <div className={cl.item__text}>
                                    Pediatric Care Services
                                </div>
                            </div>
                            <div className={cl.catalog__item}>
                                <div className={cl.item__IconContainer}>
                                    <img width={"100%"} height={"100%"} src={"/HandIcon.png"} alt={"Icons"}/>
                                </div>
                                <div className={cl.item__text}>
                                    Dermatology Consultation
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className={cl.doctorImgContainer}>
                        <img src={"/DoctorService.png"} width={"100%"} height={"100%"} alt={""}/>
                        <img  className={cl.doctor_listImg} src={"/ListForDoctorService.png"} width={"100%"} height={"100%"} alt={""}/>
                    </div>
                </div>
            </div>
            <div  id="ourDoctors" className={cl.container__OurDoctorSection}>
                <div className={cl.outDoctorSection__content}>
                    <h2>Meet our expert <span>doctors</span></h2>
                    <p>
                        Our doctors are a team of highly qualified professionals with years of experience in their
                        medical fields.
                        They continuously enhance their skills and knowledge to provide patients with the highest
                        standard of care.
                    </p>
                    <div className={cl.OurDoctorsItemsContainer}>

                        {doctorCardsArray.map((value,index) =>
                            <div  key={index} className={cl.OurDoctosItem}>
                                <div className={cl.OurDoctosItem__photoContainer}>
                                    <img width={"100%"} height={"100%"} src={`${value.image_link}`} alt={"doctor img"}/>
                                </div>
                                <div className={cl.OurDoctosItem__infoContainer}>
                                    <h2>{`${value.first_name} ${value.last_name}`}</h2>
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
                    <Link style={{textDecoration: "none"}} to={routesEnum.doctors}>
                        <button className={cl.chooseDoctorBtn}>Choose a doctor</button>
                    </Link>
                </div>
            </div>
            <div id="Location" className={cl.container__geoLocationSection}>
                <div className={cl.geoLocationContent}>
                    <div className={cl.geoLocationContent__photoContainer}>
                        <img width={"100%"} height={"100%"} src={"/OurMap.png"} alt={"geolocation photo"}/>
                    </div>
                    <div className={cl.geoLocationContent__infoContainer}>
                        <h2>Find us on the map</h2>
                        <div className={cl.geoLocation__info}>
                            <table>
                                <tr>
                                    <svg className={cl.info__iconsGeoLocation}>
                                        <use xlinkHref={"/sprite.svg#GeoLocationICon"}></use>
                                    </svg>
                                </tr>
                                <td>
                                    <div style={{maxWidth: "320px"}}>
                                        Kharkiv, Molochna Street 48, Building 2
                                    </div>
                                </td>

                                <tr>
                                    <svg className={cl.info__iconsPhone}>
                                        <use xlinkHref={"/sprite.svg#PhoneIcon"}></use>
                                    </svg>
                                </tr>
                                <td>
                                    <div style={{maxWidth: "340px"}}>
                                        +38 (067) 123-45-67 +38 (050) 234-56-78 +38 (063) 345-67-89
                                    </div>
                                </td>

                                <tr>
                                    <svg className={cl.info__iconsEmail}>
                                        <use xlinkHref={"/sprite.svg#EmailIcon"}></use>
                                    </svg>
                                </tr>
                                <td>health.rebalance@gmail.com</td>
                            </table>
                        </div>
                        <div className={cl.info__navigation}>
                            <a href={"https://maps.app.goo.gl/67xguLNwFvBy5X7d7"}  rel={"noreferrer"} target="_blank">
                                <button className={cl.infoNavigation__button}>Find us</button>
                            </a>
                            <div className={cl.socialMediaContainer}>
                                <svg className={cl.socialIcon}>
                                    <use xlinkHref={"/sprite.svg#FaceBookIcon"}></use>
                                </svg>
                                <svg className={cl.socialIcon}>
                                    <use xlinkHref={"/sprite.svg#InstagramIcon"}></use>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="News" className={cl.sliderSection}>
                <div className={cl.sliderSection__content}>
                    <h2>News</h2>
                    <p>Latest news and current updates for our clients:</p>
                    <div className={cl.sliderContainer}>
                        <div ref={sliderRef} className={cl.slider}>
                            <div ref={sliderTapeRef} onMouseDown={(event) => onMouseDown(event)}
                                 onMouseUp={(e) => onMouseUp(e)} className={cl.sliderTape}>
                                {newsCardArray.map((value, index) =>
                                    <div   ref={itemRef} key={index} className={cl.slider__newsCardItem}>
                                        <img className={cl.backGroundItemImg} width={"100%"} height={"100%"}
                                             src={`${value.image_link}`} alt={""}/>
                                        <div className={cl.newsCardItem__data}>
                                            {dateConvert(value.createdAt)}
                                        </div>
                                        <div onClick={()=>navigate(`/news/${value.id}`)} className={cl.newsCardItem__underInfoContainer}>
                                            {value.title}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralPage;