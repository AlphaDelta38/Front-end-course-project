import React, {useCallback, useEffect, useMemo, useState} from 'react';
import cl from '../../modules/AdminPanel/NewsManagementSection.module.css'
import {newsAPI, sortForwards} from "../../services/NewsService";
import NewsAdminPanelCard from "./NewsAdminPanelCard";
import EntriesSelect from "./entriesSelect";
import {NewsItemInterface} from "../../types/newsType";
import {cleanSpaces} from "../../utils/Text";
import PaginationBar from "./PaginationBar";
import NewsSettings, {newsProps} from "./NewsSettings";
import {errorSlice} from "../../store/reducers/ErrorSlice";
import {messageType} from "../PopupMessage/PopupMessageItem";
import {useAppDispatch} from "../../hooks/redux";


interface howManyNewsInterface{
    page: number,
    limit: number,
}

enum isChangingActionEnum{
    show="show",
    change="change",
    create="create"
}


export interface isChangingInterface{
    action: isChangingActionEnum,
    id: number | null,
}


const NewsManagementSection = () => {

    const [howManyNews, setHowManyNews] = useState<howManyNewsInterface>({
        page:1,
        limit: 10,
    });

    const [newsState, setNewsState] = useState<NewsItemInterface[]>([])
    const [isChanging, setIsChanging] = useState<isChangingInterface>({
        action: isChangingActionEnum.show,
        id: null,
    })

    const {data: News, error: newsError, isLoading, refetch: NewsRefetch} = newsAPI.useFetchAllNewsQuery({
        limit: howManyNews.limit,
        page: howManyNews.page,
        sortForward: sortForwards.descending
    })
    const {data: newsAmount, error: newsAmountError, isLoading: NewsAmountLoading, refetch: NewsAmountRefetch} = newsAPI.useFetchAmountOfNewsQuery({})
    const [deleteNews, {isLoading: newsIsLoadingDelete }] = newsAPI.useDeleteNewsMutation({})

    const dispatch = useAppDispatch()

    function changeAmountOfNews(optionValue:string){
        if(Number(optionValue)){
            setHowManyNews({...howManyNews, limit: Number(optionValue)})
        }
    }

    function searchFunction(word: string){
        let newsBeforeFilter:NewsItemInterface[] =[];
        if(News){
            newsBeforeFilter = [...News]
        }
        const searchKeyWord = cleanSpaces(word).toLowerCase()
        setNewsState(newsBeforeFilter.filter((value)=> searchKeyWord.length > 0 ? value.title.toLowerCase().includes(searchKeyWord) : true))
    }


    const returnNewsObjectValue = useMemo((): Omit<newsProps, "backFunc" | "deleteFunc">=>{
        if(News){
            const needObject = News.find((value)=>value.id === isChanging.id)
            if(needObject){
                return  {
                    id: needObject.id,
                    image_link: needObject.image_link || "",
                    text: needObject.text  || "",
                    title: needObject.title || "",
                    createdAt: needObject.createdAt
                }
            }
        }

        return  {
            id: 0,
            image_link:  "",
            text:  "",
            title:  "",
            createdAt: "",
        }
    }, [isChanging.id])

    async function deleteNewsHandler(id: number){
        try {
            if(id){
                const response = await deleteNews(id)
                if(!response.error){
                    dispatch(errorSlice.actions.setErrors({message:"news delete successful", type: messageType.successType}))
                    NewsRefetch()
                    NewsAmountRefetch()
                    return 1
                }else{
                    dispatch(errorSlice.actions.setErrors({message:"news delete failed", type: messageType.errorType}))
                    return 0
                }
            }
            return 0
        }catch (e){
            dispatch(errorSlice.actions.setErrors({message:"news delete failed", type: messageType.errorType}))
            return 0
        }
    }



    useEffect(()=>{
        if(News && News.length > 0){
            setNewsState(News)
        }
    }, [News])



    return (
        <div className={cl.container}>
            <div className={cl.content}>
                { isChanging.action === isChangingActionEnum.show ?
                    <>
                <div className={cl.filtersContainer}>
                    <PaginationBar
                        nextPageFunc={()=>{
                            setHowManyNews({...howManyNews, page: howManyNews.page + 1});
                        }}
                        previousPageFunc={()=>{
                            setHowManyNews({...howManyNews, page: howManyNews.page - 1});
                        }}
                        setPageFunc={(page: number)=>{
                            setHowManyNews({...howManyNews, page: page});
                        }}
                        currentPage={howManyNews.page}
                        amount={newsAmount && newsAmount || 1}
                        limit={howManyNews.limit}
                    />
                    <EntriesSelect textBeforeSelect={"Show"} textAfterSelect={"entries"} options={["10","25", "50", "100"]} setState={changeAmountOfNews} style={{justifyContent:"end"}}/>
                </div>
                <div className={cl.searchContainer}>
                    <input className={cl.searchInput} onChange={(e)=>searchFunction(e.target.value)}/>
                    <button onClick={()=>setIsChanging({action: isChangingActionEnum.create, id:null})}>Create</button>
                </div>
                <div className={cl.newsCardsItemContainer}>
                    {newsState && newsState.map((value, index) =>
                        <NewsAdminPanelCard
                            deleteCallback={deleteNewsHandler}
                            key={value.title + `${index}`}
                            changeCallback={(id: number)=>setIsChanging({action: isChangingActionEnum.change, id: id})}
                            date={value.createdAt}
                            imgLink={value.image_link}
                            title={value.title}
                            id={value.id}
                        />
                    )}
                </div>
                    </>
                    :
                    <NewsSettings
                        deleteFunc={deleteNewsHandler}
                        id={returnNewsObjectValue.id}
                        title={returnNewsObjectValue.title}
                        text={returnNewsObjectValue.text}
                        image_link={returnNewsObjectValue.image_link}
                        createdAt={returnNewsObjectValue.createdAt}
                        backFunc={()=>{
                            setIsChanging({action: isChangingActionEnum.show, id: null});
                        }}
                    />
            }
            </div>
        </div>
    );
};

export default NewsManagementSection;