import React, {useCallback, useEffect, useRef, useState} from 'react';
import cl from '../../modules/NewsPage/NewsPage.module.css';
import clSlider from '../../modules/GeneralPage/GeneralPage.module.css';
import {newsAPI, sortForwards} from "../../services/NewsService";
import {NewsItemInterface} from "../../types/newsType";
import {useLocation, useNavigate, useNavigation} from "react-router-dom";
import {dateConvert} from "../../utils/Date";
import {errorSlice} from "../../store/reducers/ErrorSlice";
import {messageType} from "../PopupMessage/PopupMessageItem";
import {useAppDispatch} from "../../hooks/redux";
import QuillForm from "../additionalComponents/QuillForm";
import {cordinateData} from "../GeneralPage/GeneralPage";

const NewsPage = () => {



    const {data, isError} = newsAPI.useFetchAllNewsQuery({sortForward: sortForwards.descending, limit: 30})
    const [currentNews, setCurrentNews] = useState<NewsItemInterface>()
    const [otherNews , setOtherNews] = useState<NewsItemInterface[]>()

    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const sliderRef = useRef<HTMLDivElement | null>(null);
    const sliderTapeRef = useRef<HTMLDivElement | null>(null);
    const itemRef = useRef<HTMLDivElement | null>(null);
    const cordinateDataRef = useRef<cordinateData | null>(null)
    const [cordinateData, setcordinateData] = useState<cordinateData>({lastPosition: 0, startX: 0, canStart: "start"})

    function onMouseDown(event: React.MouseEvent | React.TouchEvent){

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


        let coordinate: number | undefined;

        if ("touches" in event) {
            coordinate = event.touches[0]?.clientX;
        } else {
            coordinate = event.clientX;
        }

        setcordinateData({startX: coordinate, lastPosition: translateValue, canStart: "stop"})

        document.body.style.userSelect = 'none';
        if(sliderTapeRef.current){
            sliderTapeRef.current.style.transition = "none";
        }
        window.addEventListener("mousemove", move);
        window.addEventListener("touchmove", move);
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("touchend", onMouseUp);
    }


    const move = useCallback((e: MouseEvent | TouchEvent)=>{

        let coordinate: number | undefined;

        if ("touches" in e) {
            coordinate = e.touches[0]?.clientX;
        } else {
            coordinate = e.clientX;
        }

        const startPosition = cordinateDataRef.current?.startX;
        const currentPosition = cordinateDataRef.current?.lastPosition;

        if(startPosition){
            sliderTapeRef.current?.style.setProperty("transform",`translateX(${currentPosition!+(coordinate - startPosition)}px)`);
        }
    }, [])

    function onMouseUp(e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent){

        let coordinate: number | undefined;

        if ("changedTouches" in e) {
            coordinate = e.changedTouches[0]?.clientX;
        } else {
            coordinate = e.clientX;
        }

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
                if((cordinateData.startX - coordinate) > 0){
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
        window.removeEventListener("touchmove", move);
        window.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("touchend", onMouseUp);
    }






    useEffect(() => {

        return ()=>{
            window.removeEventListener("mousemove", move);
            window.removeEventListener("touchmove", move);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("touchend", onMouseUp);
        }
    }, []);

    useEffect(() => {
        cordinateDataRef.current = cordinateData;
    }, [cordinateData]);


    useEffect(()=>{
        if(data && !isError){
            const NewsId: number = Number(location.pathname.split("/")[2])
            const currentData: NewsItemInterface[] = [...data]

            const News = {...currentData.filter((value)=>value.id === NewsId)[0]}
            const OtherNews = [...currentData.filter((value)=>value.id !== NewsId)].slice(0,5);

            if(News.id){
                setCurrentNews(News)
                setOtherNews(OtherNews)
            }else{
                dispatch(errorSlice.actions.setErrors({message: "404 Page not found", type: messageType.errorType}))
                navigate("/general")
            }
        }else{
            if(isError){
                dispatch(errorSlice.actions.setErrors({message: "404 Page not found", type: messageType.errorType}))
                navigate("/general")
            }
        }
    },[data , isError , location.pathname])


    return (
        <div className={cl.container}>
            <div className={cl.leftColumn}>
                <div className={cl.imageBanner} style={{backgroundImage: `url(${currentNews?.image_link || ""})`}}>
                    <div className={cl.underSectionBanner}>{currentNews?.createdAt ? dateConvert(currentNews?.createdAt) : "none"}</div>
                </div>
                <h1>
                    {currentNews?.title || "Error Title"}
                </h1>
                <div className={cl.textContent}>
                    <QuillForm toolbarActive={false} readonly={true} value={currentNews?.text || ""}/>
                </div>
            </div>
            <div className={cl.rightColumn}>
                {otherNews?.map((value, index) =>
                    <div key={value.createdAt + `${value.id}`} className={cl.imageConteiner}
                         style={{backgroundImage: `url(${value.image_link})`}}
                         onClick={() => navigate(`/news/${value.id}`)}
                    >
                        <div className={cl.content}>
                            <span className={cl.date}>{dateConvert(value.createdAt)}</span>
                            <div className={cl.underSection}>{value.title}</div>
                        </div>
                    </div>
                )}
            </div>
            <div className={cl.containerForSlider}>
                <div className={clSlider.sliderSection}>
                    <div className={clSlider.sliderSection__content}>
                        <h2>Other News:</h2>
                        <div className={clSlider.sliderContainer} style={{height:"unset"}}>
                            <div ref={sliderRef} className={clSlider.slider}>
                                <div ref={sliderTapeRef} onTouchStart={(event) => onMouseDown(event)} onMouseDown={(event) => onMouseDown(event)} onMouseUp={(e) => onMouseUp(e)} className={clSlider.sliderTape} onTouchEnd={(e) => onMouseUp(e)}>
                                    {otherNews && otherNews.map((value, index) =>
                                        <div ref={itemRef} key={index} className={clSlider.slider__newsCardItem}>
                                            <img className={clSlider.backGroundItemImg} width={"100%"} height={"100%"} src={`${value.image_link}`} alt={""}/>
                                            <div className={clSlider.newsCardItem__data}>
                                                {dateConvert(value.createdAt)}
                                            </div>
                                            <div onClick={() => navigate(`/news/${value.id}`)} className={clSlider.newsCardItem__underInfoContainer}>
                                                {value.title}
                                            </div>
                                        </div>
                                    )}
                                    {otherNews && otherNews.length === 0 && <div className={clSlider.newsNotFound}><h2>No one News</h2></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsPage;