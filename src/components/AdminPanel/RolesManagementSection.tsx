import React, {useState} from 'react';
import cl from '../../modules/AdminPanel/RolesManagementSection.module.css'
import CustomBtn, {CustomBtnTypes} from "../additionalComponents/CustomBtn";
import AdminTable from "./AdminTable";
import PaginationBar from "./PaginationBar";
import {
    AdminTableDataType,
    searchForwardsEnum,
    searchObjectsInterface,
    searchTypeEnum
} from "../../types/adminPanelType";
import {rolesAPI} from "../../services/RolesService";
import {useAppDispatch} from "../../hooks/redux";
import SoloInputModalWindow from "../additionalComponents/soloInputModalWindow";
import {errorSlice} from "../../store/reducers/ErrorSlice";
import {messageType} from "../PopupMessage/PopupMessageItem";
import soloInputModalWindow from "../additionalComponents/soloInputModalWindow";


const RolesManagementSection = () => {

    const [searchState, setSearchState] = useState<searchObjectsInterface>({
        limit: 10,
        page: 1,
        searchForward: searchForwardsEnum.UP,
        searchType: searchTypeEnum.id
    })

    const [modalWindowActive, setModalWindowActive] = useState<{id: number | null, active: boolean}>({id: null, active: false })

    const {data: Amount, refetch: AmountRefetch} = rolesAPI.useGetAmountRolesQuery({})
    const {data: Roles, refetch: RolesRefetch} = rolesAPI.useGetAllRolesQuery({
        limit: searchState.limit || 0,
        page: searchState.page || 1,
    })

    const [deleteRole, {}] = rolesAPI.useDeleteRoleMutation()
    const [createRole, {}] = rolesAPI.useCreateRoleMutation()
    const [updateRole, {}] = rolesAPI.useUpdateRoleMutation()

    const dispatch = useAppDispatch()


    function checkSortIconActive(type: searchTypeEnum, forward: searchForwardsEnum){
        return type === searchState.searchType && forward === searchState.searchForward
    }

    function checkSortIconChange(type: searchTypeEnum, forward: searchForwardsEnum){
        setSearchState({...searchState, searchType: type, searchForward: forward})
    }



    async function createAndUpdate(role: string){
        try {
            let response;
            if(modalWindowActive.id){
                response = await updateRole({id: modalWindowActive.id, role: role})
            }else{
                response = await createRole({role: role})
            }

            if(response.error || response.data === 0){
                //@ts-ignore
                throw new Error(response?.error.data.message.message)
            }

            RolesRefetch()
            AmountRefetch()
            dispatch(errorSlice.actions.setErrors({message: "Action has been success", type: messageType.successType}))
        }catch (e){
            const error = typeof e === "string" ? e : "Error with delete this role"
            dispatch(errorSlice.actions.setErrors({message: error, type: messageType.errorType}))
        }
    }

    async function deleteRequest(id: number){
        try {
            const response = await deleteRole(id)
            if(response.error || response.data === 0){
                //@ts-ignore
                throw new Error(response?.error.data.message.message)
            }
            RolesRefetch()
            AmountRefetch()
            dispatch(errorSlice.actions.setErrors({message: "Action has been success", type: messageType.successType}))
        }catch (e){
            const error = typeof e === "string" ? e : "Error with delete this role"
            dispatch(errorSlice.actions.setErrors({message: error, type: messageType.errorType}))
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
            value: "Role",
            searchType: searchTypeEnum.role,
            key: [searchTypeEnum.role],
            styles: {
                headers: {maxWidth: "40%", flex: "0 1 40%"},
                data: {maxWidth: "40%", flex: "0 1 40%"},
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
                            Roles Management
                        </h1>
                    </div>
                    <CustomBtn styles={{maxWidth: "200px"}} onClick={()=>setModalWindowActive({id: null, active: true})} type={CustomBtnTypes.create}/>
                </div>
                <div className={cl.tableContainer}>
                    <AdminTable
                        viewBtnOnClick={(id)=>setModalWindowActive({id, active: true})}
                        deleteBtnOnClick={deleteRequest}
                        checkSortIconActive={checkSortIconActive}
                        onClickSortIconChange={checkSortIconChange}
                        TableData={dataOfAdminTable}
                        searchState={searchState}
                        setSearchState={setSearchState}
                        massiveOfRenderData={Roles ? Roles : []}
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
            {modalWindowActive.active &&
                <SoloInputModalWindow
                    closeCallBackFunc={()=>setModalWindowActive({id: null, active: false})}
                    acceptCallBackFunc={(text:string)=>createAndUpdate(text)}
                />
            }
        </div>
    );
};

export default RolesManagementSection;