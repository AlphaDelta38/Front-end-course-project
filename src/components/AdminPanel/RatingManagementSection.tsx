import React, {useState} from 'react';
import cl from '../../modules/AdminPanel/RatingManagementSection.module.css'
import AdminTable from "./AdminTable";
import PaginationBar from "./PaginationBar";
import {
    AdminTableDataType,
    searchForwardsEnum,
    searchObjectsInterface,
    searchTypeEnum
} from "../../types/adminPanelType";
import {ratingAPI} from "../../services/RatingService";
import CustomBtn, {CustomBtnTypes} from "../additionalComponents/CustomBtn";
import {errorSlice} from "../../store/reducers/ErrorSlice";
import {messageType} from "../PopupMessage/PopupMessageItem";
import {useAppDispatch} from "../../hooks/redux";
import RatingViewAndChangeWindow from "./RatingViewAndChangeWindow";




interface currentRatingViewInterface{
    id: number | null,
    active: boolean
}


const RatingManagementSection = () => {

    const [searchState, setSearchState] = useState<searchObjectsInterface>({
        limit: 10,
        page: 1,
        searchForward: searchForwardsEnum.UP,
        searchType: searchTypeEnum.id
    })

    const [currentRatingView, setCurrentRatingView] = useState<currentRatingViewInterface>({
        id: null,
        active: false
    })



    const {data: Amount, refetch: AmountRefetch} = ratingAPI.useGetAmountOfRatingQuery({})
    const {data: Rating, refetch: RatingRefetch} = ratingAPI.useGetAllRatingsQuery({
        limit: searchState.limit || 10,
        page: searchState.page || 1,
    })


    const [deleteRating] = ratingAPI.useDeleteRatingMutation({})



    const dispatch = useAppDispatch()

    function checkSortIconActive(type: searchTypeEnum, forward: searchForwardsEnum){
        return type === searchState.searchType && forward === searchState.searchForward
    }

    function checkSortIconChange(type: searchTypeEnum, forward: searchForwardsEnum){
        setSearchState({...searchState, searchType: type, searchForward: forward})
    }


    function activateViewWindow(id?: number){
        if(id){
            setCurrentRatingView({
                id: id,
                active: true,
            })
        }else{
            setCurrentRatingView({
                id: null,
                active: !currentRatingView.active,
            })
        }
    }



    async function deleteRequest(id:number){
        try {
            const response = await deleteRating(Number(id))
            if(response?.error){
                throw new Error("Deleting error")
            }else{
                AmountRefetch()
                RatingRefetch()
                dispatch(errorSlice.actions.setErrors({message:"Delete has been successful", type: messageType.successType}))
            }
        }catch (e){
            dispatch(errorSlice.actions.setErrors({message: typeof e === "string" ? e : "Error", type: messageType.errorType}))
        }

    }



    const dataOfAdminTable: AdminTableDataType = [
        {
            value: "#",
            searchType: searchTypeEnum.id,
            key: [searchTypeEnum.id],
            styles: {
                headers: {maxWidth: "5%", flex: "0 1 5%"},
                data: {maxWidth: "5%", flex: "0 1 5%"},
            },
        },
        {
            value: "Doctor",
            searchType: searchTypeEnum.doctor,
            key: [searchTypeEnum.first_name, searchTypeEnum.last_name],
            styles: {
                headers: {maxWidth: "35%", flex: "0 1 35%"},
                data: {maxWidth: "35%", flex: "0 1 35%"},
            },
        },
        {
            value: "Patient",
            searchType: searchTypeEnum.patient,
            key: [searchTypeEnum.first_name, searchTypeEnum.last_name],
            styles: {
                headers: {maxWidth: "35%", flex: "0 1 35%"},
                data: {maxWidth: "35%", flex: "0 1 35%"},
            },
        },
        {
            value: "Rating",
            searchType: searchTypeEnum.rating,
            key: [searchTypeEnum.rating],
            styles: {
                headers: {maxWidth: "5%", flex: "0 1 5%"},
                data: {maxWidth: "5%", flex: "0 1 5%"},
            },
        },
    ]


    return (
        <div className={cl.container}>
            <div className={cl.content}>
                <div className={cl.createBtnContainer}>
                    <div className={cl.headOfSearch}>
                        <h1 className={cl.textOfHead}>
                            <svg className={cl.PCandPhoneIcon}>
                                <use xlinkHref={"/sprite.svg#PCAndPhoneIcon"}></use>
                            </svg>
                            Ratings Management
                        </h1>
                    </div>
                    <CustomBtn styles={{maxWidth: "200px"}} onClick={activateViewWindow} type={CustomBtnTypes.create}/>
                </div>
                <div className={cl.tableContainer}>
                    <AdminTable
                        viewBtnOnClick={activateViewWindow}
                        deleteBtnOnClick={deleteRequest}
                        checkSortIconActive={checkSortIconActive}
                        onClickSortIconChange={checkSortIconChange}
                        TableData={dataOfAdminTable}
                        searchState={searchState}
                        setSearchState={setSearchState}
                        massiveOfRenderData={Rating ? Rating : []}
                        searchParamsException={[]}
                        firstBtnName={"Update"}
                    />
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
            </div>
            {currentRatingView.id && <RatingViewAndChangeWindow
                id={currentRatingView.id}
                callBackCloseWindow={()=>activateViewWindow()}
                callbackDelete={(id)=>deleteRequest(id)}
                refetchCallBack={RatingRefetch}
            />
            }
        </div>
    );
};

export default RatingManagementSection;