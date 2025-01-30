import React, {useState} from 'react';
import cl from '../../modules/AdminPanel/SpecialityManagementSection.module.css'
import Loader from "../additionalComponents/loader";
import CustomBtn, {CustomBtnTypes} from "../additionalComponents/CustomBtn";
import AdminTable from "./AdminTable";
import PaginationBar from "./PaginationBar";
import SoloInputModalWindow from "../additionalComponents/soloInputModalWindow";
import {
    AdminTableDataType,
    searchForwardsEnum,
    searchObjectsInterface,
    searchTypeEnum
} from "../../types/adminPanelType";
import {serviceAPI} from "../../services/ServicesService";
import {useAppDispatch} from "../../hooks/redux";
import {errorSlice} from "../../store/reducers/ErrorSlice";
import {messageType} from "../PopupMessage/PopupMessageItem";
import {specialityAPI} from "../../services/SpecialityService";




interface soloInputFieldState{
    id: number | null
    active: boolean,
    typeOfRequest: "POST" | "PUT" | null
}



const SpecialityManagementSection = () => {


    const [searchState, setSearchState] = useState<searchObjectsInterface>({
        limit: 10,
        page: 1,
        searchForward: searchForwardsEnum.UP,
        searchType: searchTypeEnum.id
    })


    const {data: Speciality, refetch: SpecialityRefetch} = specialityAPI.useGetAllSpecialityQuery({
        limit: searchState.limit || 10,
        page: searchState.page || 1,
    })

    const {data: Amount,refetch: AmountRefetch} = specialityAPI.useGetAmountSpecialityQuery(0)

    const [createSpeciality,{isLoading: isLoadingCreate}] = specialityAPI.useCreateSpecialityMutation({})
    const [updateSpeciality,{isLoading: isLoadingUpdate}] = specialityAPI.useUpdateSpecialityMutation({})
    const [deleteSpeciality,{isLoading: isLoadingDelete}] = specialityAPI.useDeleteSpecialityMutation({})


    const dispatch = useAppDispatch()


    const [soloInputFieldState, setSoloInputState] = useState<soloInputFieldState>({
        id: null,
        active: false,
        typeOfRequest: null
    })

    function checkSortIconActive(type: searchTypeEnum, forward: searchForwardsEnum){
        return type === searchState.searchType && forward === searchState.searchForward
    }

    function checkSortIconChange(type: searchTypeEnum, forward: searchForwardsEnum){
        setSearchState({...searchState, searchType: type, searchForward: forward})
    }

    async function createOrUpdateFunc(value: string){
        try {
            let response;
            if(soloInputFieldState.typeOfRequest === "POST"){
                response = await createSpeciality(value)
            }else if(soloInputFieldState.typeOfRequest === "PUT" && soloInputFieldState.id){
                response = await updateSpeciality({
                    id: soloInputFieldState.id,
                    name: value,
                })
            }

            if(!response?.error){
                SpecialityRefetch()
                AmountRefetch()
                setSoloInputState({...soloInputFieldState,id: null, typeOfRequest: null, active: false})
                dispatch(errorSlice.actions.setErrors({message:"Action has been success", type: messageType.successType}))
            }else{
                throw new Error("Server Error")
            }
        }catch (e){
            console.log(e)
            dispatch(errorSlice.actions.setErrors({message: typeof e === "string" ? e : "Server Error", type: messageType.errorType}))
        }
    }


    async function deleteDiagnoseRequest(id: number){
        try {
            const hasDeleted = await deleteSpeciality(id)
            if(hasDeleted){
                SpecialityRefetch()
                AmountRefetch()
                dispatch(errorSlice.actions.setErrors({message:"Action has been success", type: messageType.successType}))
            }
        }catch (e){

        }
    }

    function changeSoloInputState(id?: number){
        if(id){
            setSoloInputState({...soloInputFieldState, typeOfRequest: "PUT", active: true,id: id})
        }else{
            setSoloInputState({...soloInputFieldState, typeOfRequest: "POST", active: true})
        }
    }


    const dataOfAdminTable: AdminTableDataType = [
        {
            value: "#",
            searchType: searchTypeEnum.id,
            key: [searchTypeEnum.id],
            styles: {
                headers: {maxWidth: "40%", flex: "0 1 40%"},
                data: {maxWidth: "40%", flex: "0 1 40%"},
            },
        },
        {
            value: "Name of speciality",
            searchType: searchTypeEnum.specialityTitleField,
            key: [searchTypeEnum.specialityTitleField],
            styles: {
                headers: {maxWidth: "40%", flex: "0 1 40%"},
                data: {maxWidth: "40%", flex: "0 1 40%"},
            },
        },
    ]





    return (
        <div className={cl.container}>
            <Loader isLoading={isLoadingDelete || isLoadingUpdate} isChildElement={true}/>
            <div className={cl.content}>
                <div className={cl.createBtnContainer}>
                    <div className={cl.headOfSearch}>
                        <h1 className={cl.textOfHead}>
                            <svg className={cl.PCandPhoneIcon}>
                                <use xlinkHref={"/sprite.svg#PCAndPhoneIcon"}></use>
                            </svg>
                            Diagnoses Management
                        </h1>
                    </div>
                    <CustomBtn styles={{maxWidth: "200px"}} onClick={() => {
                        changeSoloInputState()
                    }} type={CustomBtnTypes.create}/>
                </div>
                <div className={cl.tableContainer}>
                    <AdminTable
                        viewBtnOnClick={changeSoloInputState}
                        deleteBtnOnClick={deleteDiagnoseRequest}
                        checkSortIconActive={checkSortIconActive}
                        onClickSortIconChange={checkSortIconChange}
                        TableData={dataOfAdminTable}
                        searchState={searchState}
                        setSearchState={setSearchState}
                        massiveOfRenderData={Speciality ? Speciality : []}
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
                {soloInputFieldState.active &&
                    <SoloInputModalWindow closeCallBackFunc={(active: boolean) => {
                        setSoloInputState({...soloInputFieldState, active})
                    }} acceptCallBackFunc={(value) => {
                        createOrUpdateFunc(value)
                    }}
                    />
                }
            </div>
        </div>
    );
};

export default SpecialityManagementSection;