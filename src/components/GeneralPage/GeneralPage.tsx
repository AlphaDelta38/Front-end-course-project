import React, {useCallback, useEffect, useRef, useState} from 'react';
import cl from "../../modules/GeneralPage/GeneralPage.module.css"



interface cordinateData{
    startX: number,
    lastPosition: number,
    canStart: string,
}

const GeneralPage = () => {

    const test = [1,2,3,4]

    const NewsCardsTest = [1,2,3,4,5,6,7,8,9]

    const sliderRef = useRef<HTMLDivElement | null>(null);
    const sliderTapeRef = useRef<HTMLDivElement | null>(null);
    const itemRef = useRef<HTMLDivElement | null>(null);
    const cordinateDataRef = useRef<cordinateData | null>(null)


    const [cordinateData, setcordinateData] = useState<cordinateData>({lastPosition: 0, startX: 0, canStart: "start"})


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


    return (
        <div className={cl.container}>
            <div className={cl.container__SheduleSection}>
                <div className={cl.sheduleContainer}>
                    <h3>MEDICAL CENTER</h3>
                    <h1>YOUR HEALTH <span className={cl.OurSpan}>OUR</span> MISSION</h1>
                    <div className={cl.shedulesBtnContainer}>
                        <button className={cl.shedules_button}>
                            Schedule now
                        </button>
                        <button className={cl.shedules_button}>
                            Our doctors
                        </button>
                    </div>
                </div>
                <div className={cl.lastNewsContainer}>
                    <div className={cl.lastNews__content}>
                        <small className={cl.lastNews__date}>
                            September 14, 2024
                        </small>
                        <div className={cl.lastNews__photoContainer}>
                            <img width="100%"  height="100%"  src={"/img.png"}  alt={"photo of last news"}/>
                        </div>
                        <div className={cl.lastNews_textContainer}>
                            Our clinic has acquired a <span>state-of-the-art ultrasound scanner</span> for cardiovascular diagnostics, enabling highly accurate... dsadadadsadasd
                        </div>
                        <button className={cl.lastNews__button}>
                            Learn more
                        </button>
                    </div>
                </div>
            </div>
            <div className={cl.container__SerivceSection}>
                <div className={cl.service__contentContainer}>
                    <h1 className={cl.service__generalText}>
                        Health service for you
                    </h1>
                    <p className={cl.service__secontText}>
                        Our clinic provides a comprehensive selection of health services focused on your wellness.
                        From heart assessments to pediatric care, each service is designed to meet your unique health needs.
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
            <div className={cl.container__OurDoctorSection}>
                <div className={cl.outDoctorSection__content}>
                    <h2>Meet our expert <span>doctors</span></h2>
                    <p>
                        Our doctors are a team of highly qualified professionals with years of experience in their
                        medical fields.
                        They continuously enhance their skills and knowledge to provide patients with the highest
                        standard of care.
                    </p>
                    <div className={cl.OurDoctorsItemsContainer}>

                        {test.map((value,index) =>
                            <div  key={index} className={cl.OurDoctosItem}>
                                <div className={cl.OurDoctosItem__photoContainer}>
                                    <img width={"285px"} height={"249px"} src={"/testDoctorImg.png"} alt={"doctor img"}/>
                                </div>
                                <div className={cl.OurDoctosItem__infoContainer}>
                                    <h2>Dr. Emily Carter</h2>
                                    <span>Cardiologist</span>
                                    <div className={cl.OurDoctosItem__raitingContainer}>
                                        <div className={cl.raiting}>
                                            <svg className={cl.raiting__starIcon}>
                                                <use xlinkHref={"/sprite.svg#StarIcon"}></use>
                                            </svg>
                                            5.0
                                        </div>
                                        <div className={cl.countOfLikes}>
                                            (858)
                                        </div>
                                    </div>
                                </div>
                        </div>
                        )}

                    </div>
                    <button className={cl.chooseDoctorBtn}>Choose a doctor</button>
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
                                {NewsCardsTest.map((value, index) =>
                                    <div ref={itemRef} key={index} className={cl.slider__newsCardItem}>
                                        <img className={cl.backGroundItemImg} width={"100%"} height={"100%"}
                                             src={"/TestItem.png"} alt={""}/>
                                        <div className={cl.newsCardItem__data}>
                                            June 12, 2024
                                        </div>
                                        <div className={cl.newsCardItem__underInfoContainer}>
                                            Free Pediatric Check-Ups for New Patients
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