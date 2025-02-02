import React, {useState} from 'react';
import cl from '../../modules/AdminPanel/AppointmentsManagementSection.module.css'
import CustomBtn, {CustomBtnTypes} from "../additionalComponents/CustomBtn";
import AdminTable from "./AdminTable";
import PaginationBar from "./PaginationBar";
import {
    AdminTableDataType,
    searchForwardsEnum,
    searchObjectsInterface,
    searchTypeEnum
} from "../../types/adminPanelType";
import {appointmentsAPI} from "../../services/AppointmentsService";
import {useAppDispatch} from "../../hooks/redux";
import {errorSlice} from "../../store/reducers/ErrorSlice";
import {messageType} from "../PopupMessage/PopupMessageItem";
import AppointmentsViewAndChangeWindow from "./AppointmentsViewAndChangeWindow";


interface currentAppointmentViewInterface{
    id: number | null,
    active: boolean
}

const AppointmentsManagementSection = () => {

    const [searchState, setSearchState] = useState<searchObjectsInterface>({
        limit: 10,
        page: 1,
        searchForward: searchForwardsEnum.UP,
        searchType: searchTypeEnum.id
    })

    const [currentAppointmentView, setCurrentAppointmentView] = useState<currentAppointmentViewInterface>({
        id: null,
        active: false
    })

    const {data: Appointments, refetch: AppointmentsRefetch} = appointmentsAPI.useGetAllAppointmentsQuery({
        limit: searchState.limit || 0,
        page: searchState.page || 1,
    })
    const {data: Amount, refetch: AmountRefetch} = appointmentsAPI.useGetAppointmentsAmountQuery({})
    const [appointmentDelete, {}] = appointmentsAPI.useDeleteAppointmentMutation({})

    const dispatch = useAppDispatch()

    function checkSortIconActive(type: searchTypeEnum, forward: searchForwardsEnum){
        return searchState.searchType === type && searchState.searchForward === forward
    }

    function checkSortIconChange(type: searchTypeEnum, forward: searchForwardsEnum){
        setSearchState({...searchState, searchType: type, searchForward: forward})
    }

    async function deleteRequest(id:number){
        try {
            const response = await appointmentDelete(Number(id))
            if(response?.error){
                throw new Error("Deleting error")
            }else{
                AmountRefetch()
                AppointmentsRefetch()
                dispatch(errorSlice.actions.setErrors({message:"Delete has been successful", type: messageType.successType}))
            }
        }catch (e){
            dispatch(errorSlice.actions.setErrors({message: typeof e === "string" ? e : "Error", type: messageType.errorType}))
        }

    }

    function additionalFunctionSorting(a:any, b:any){
        const customSortOneCheck = /^(0?[0-9]|1[0-2]):(00|15|30|45)$/  // time format 9:30
        const customSortTwoCheck =  /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/ // data format 30-01-2025

        if(customSortOneCheck.test(a)){
            const aStr = (a as string).split(":")
            const bStr = (b as string).split(":")

            if (Number(aStr[0]) !== Number(bStr[0])) {
                return Number(aStr[0]) - Number(bStr[0]);
            }else {
                return Number(aStr[1]) - Number(bStr[1]);
            }
        }else if(customSortTwoCheck.test(a)){
            const [aDay, aMonth, aYear] = a.split("-").map(Number);
            const [bDay, bMonth, bYear] = b.split("-").map(Number);

            const aDate = new Date(aYear, aMonth - 1, aDay);
            const bDate = new Date(bYear, bMonth - 1, bDay);

            // @ts-ignore
            return aDate - bDate;
        }else if(typeof a === "boolean"){
            //@ts-ignore
            return b - a
        }

        return null
    }

    function activateViewWindow(id?: number){
        if(id){
            setCurrentAppointmentView({
                id: id,
                active: true,
            })
        }else{
            setCurrentAppointmentView({
                id: null,
                active: !currentAppointmentView.active,
            })
        }
    }


    const dataOfAdminTable: AdminTableDataType = [
        {
            value: "#",
            searchType: searchTypeEnum.id,
            key: [searchTypeEnum.id],
            styles: {
                headers: {maxWidth: "5%", flex: "0 1 40%"},
                data: {maxWidth: "5%", flex: "0 1 40%"},
            },
        },
        {
            value: "Doctor",
            searchType: searchTypeEnum.doctor,
            key: [searchTypeEnum.first_name, searchTypeEnum.last_name],
            styles: {
                headers: {maxWidth: "15%", flex: "0 1 40%"},
                data: {maxWidth: "15%", flex: "0 1 40%"},
            },
        },
        {
            value: "Patient",
            searchType: searchTypeEnum.patient,
            key: [searchTypeEnum.first_name, searchTypeEnum.last_name],
            styles: {
                headers: {maxWidth: "15%", flex: "0 1 40%"},
                data: {maxWidth: "15%", flex: "0 1 40%"},
            },
        },
        {
            value: "Service",
            searchType: searchTypeEnum.services,
            key: [searchTypeEnum.service],
            styles: {
                headers: {maxWidth: "10%", flex: "0 1 40%"},
                data: {maxWidth: "10%", flex: "0 1 40%"},
            },
        },
        {
            value: "Date of visit",
            searchType: searchTypeEnum.date,
            key: [searchTypeEnum.date],
            styles: {
                headers: {maxWidth: "10%", flex: "0 1 40%"},
                data: {maxWidth: "10%", flex: "0 1 40%"},
            },
        },
        {
            value: "Time of visit",
            searchType: searchTypeEnum.time,
            key: [searchTypeEnum.time],
            styles: {
                headers: {maxWidth: "10%", flex: "0 1 40%"},
                data: {maxWidth: "10%", flex: "0 1 40%"},
            },
        },
        {
            value: "Status",
            searchType: searchTypeEnum.status,
            key: [searchTypeEnum.status],
            styles: {
                headers: {maxWidth: "10%", flex: "0 1 40%"},
                data: {maxWidth: "10%", flex: "0 1 40%"},
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
                            Appointments Management
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
                        massiveOfRenderData={Appointments ? Appointments : []}
                        searchParamsException={[]}
                        firstBtnName={"Update"}
                        additionalFunctionForSorting={additionalFunctionSorting}
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
            {currentAppointmentView.active && <AppointmentsViewAndChangeWindow  refetchCallBack={()=>AppointmentsRefetch()} callbackDelete={(id)=>deleteRequest(id)} callBackCloseWindow={()=>activateViewWindow()} id={currentAppointmentView.id}/>}
        </div>
    );
};

export default AppointmentsManagementSection;