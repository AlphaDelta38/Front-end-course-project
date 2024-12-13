import React, {useEffect, useState} from 'react';
import cl from '../../modules/NewsPage/NewsPage.module.css';
import {newsAPI, sortForwards} from "../../services/NewsService";
import {NewsItemInterface} from "../../types/newsType";
import {useLocation, useNavigate, useNavigation} from "react-router-dom";
import {dateConvert} from "../../util/Date";
import {errorSlice} from "../../store/reducers/ErrorSlice";
import {messageType} from "../PopupMessage/PopupMessageItem";
import {useAppDispatch} from "../../hooks/redux";

const NewsPage = () => {



    const {data, isError} = newsAPI.useFetchAllNewsQuery({sortForward: sortForwards.descending, limit: 30})
    const [currentNews, setCurrentNews] = useState<NewsItemInterface>()
    const [otherNews , setOtherNews] = useState<NewsItemInterface[]>()

    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()



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
                    {currentNews?.text || "none"}
                </div>
            </div>
            <div className={cl.rightColumn}>
                {otherNews?.map((value, index) =>
                    <div key={value.createdAt + `${value.id}`} className={cl.imageConteiner}
                         style={{backgroundImage: `url(${value.image_link})`}}
                         onClick={()=>navigate(`/news/${value.id}`)}
                    >
                        <div className={cl.content}>
                            <span className={cl.date}>{dateConvert(value.createdAt)}</span>
                            <div className={cl.underSection}>{value.title}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsPage;