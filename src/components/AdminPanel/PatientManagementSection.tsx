import React, {useEffect, useState} from 'react';
import cl from '../../modules/AdminPanel/PatientManagementSection.module.css'
import {patientSAPI} from "../../services/PatientService";
import AdminTable from "./AdminTable";
import {
    AdminTableDataType,
    searchForwardsEnum,
    searchObjectsInterface,
    searchTypeEnum
} from "../../types/adminPanelType";
import * as yup from "yup"
import PaginationBar from "./PaginationBar";
import ViewManageDataComponent from "./ViewManageDataComponent";
import {dataViewContainer, PatientsInterface, viewDataReturnOnSubmitInterface} from "../../types/patientsType";
import {deBounceWithConfirmation} from "../../utils/deBounce";
import {useAppDispatch} from "../../hooks/redux";
import {errorSlice} from "../../store/reducers/ErrorSlice";
import {messageType} from "../PopupMessage/PopupMessageItem";
import Loader from "../additionalComponents/loader";


const viewDataYupSchema = yup.object().shape({
    fullName: yup.string().required("Full Name is required").matches(
        /^[A-ZА-Я][a-zа-я]+\s[A-ZА-Я][a-zа-я]+$/,
        "Full Name must include both first and last name, each starting with a capital letter"
    ),
    email: yup.string().required("Email is required").email("email is not correct"),
    phone: yup.string().transform(value => value.replace(/\s+/g, '')).required("Phone number is  required").matches(/^380\d{9}$/, 'Phone number must start with 380 and contain 12 digits in total').notRequired(),
    birthday: yup.date().required("Date is required"),
    gender: yup.string().required("gender is required"),
    address: yup.string().notRequired(),
    insurance: yup.string().notRequired(),
    password: yup.string().min(6).notRequired(),
})




const PatientManagementSection = () => {



    const [patientState, setPatientState] = useState<PatientsInterface | null>()
    const [searchState, setSearchState] = useState<searchObjectsInterface>({
        limit: 10,
        page: 1,
        searchForward: searchForwardsEnum.UP,
        searchType: searchTypeEnum.id
    })


    const {data: Patients, refetch: PatientRefetch} = patientSAPI.useFetchALlQuery({
        limit: searchState.limit || 0,
        page: searchState.page || 1,
    })
    const {data: Amount, refetch: AmountRefetch} = patientSAPI.useFetchALlAmountQuery({})
    const [deletePatient, {error: deleteError, isLoading: deleteIsLoading} ] = patientSAPI.useDeletePatientMutation({})
    const [createPatient,{error: createError, isLoading: createIsLoading}] = patientSAPI.useCreatePatientMutation({})
    const [updatePatient,{error: updateError, isLoading: updateIsLoading}] = patientSAPI.useUpdatePatientMutation({})

    const dispatch = useAppDispatch()




    function checkSortIconActive(type:searchTypeEnum, forward: searchForwardsEnum){
        return type === searchState?.searchType && forward === searchState.searchForward;
    }

    function searchStateChange(props: searchTypeEnum){
        if(searchState?.searchType === props){
            if(searchState.searchForward === searchForwardsEnum.UP){
                setSearchState({...searchState, searchForward: searchForwardsEnum.DOWN})
            }else{
                setSearchState({...searchState, searchForward: searchForwardsEnum.UP})
            }
        }else{
            if(searchState){
                setSearchState({...searchState, searchType: props, searchForward: searchForwardsEnum.UP})
            }
        }
    }

    function setForViewPatient(patientId: number){
        if(Patients){
            const patient = Patients.find((value)=>value.id === patientId)
            setPatientState(patient)
        }
    }


    function clearViewPatient(){
        setPatientState(null)
    }

    async function deletePatientRequest(id:number){
        try {
           if(await deletePatient(id)){
               AmountRefetch()
               PatientRefetch()
               if(id === patientState?.id){
                   clearViewPatient()
               }
           }
        }catch (e){

        }
    }

    async function createOrUpdatePatientRequest(data: viewDataReturnOnSubmitInterface){
        try {
            let patient;
            if(data?.id){
                patient = await updatePatient(data)
            }else if(!data?.id && data?.password){
                patient = await createPatient(data)
            }else{
                throw new Error("Password is required")
            }

            if(patient?.error){
                throw new Error("Bad request")
            }else{
                dispatch(errorSlice.actions.setErrors({message: "Action have successful", type: messageType.successType}))
                AmountRefetch()
                PatientRefetch()
            }

        }catch (e){
            dispatch(errorSlice.actions.setErrors({message: `${e}` || "Unknown Error", type: messageType.errorType}))
        }
    }


    const dataOfAdminTable: AdminTableDataType = [
        {
            value: "#",
            searchType: searchTypeEnum.id,
            key: [searchTypeEnum.id]
        },
        {
            value: "Full name",
            searchType: searchTypeEnum.first_name,
            key: [searchTypeEnum.first_name, searchTypeEnum.last_name]
        },
        {
            value: "email",
            searchType: searchTypeEnum.email,
            key: [searchTypeEnum.email]
        },
        {
            value: "birthday",
            searchType: searchTypeEnum.date_of_birth,
            key: [searchTypeEnum.date_of_birth]
        },
        {
            value: "phone",
            searchType: searchTypeEnum.phone,
            key: [searchTypeEnum.phone]
        },
        {
            value: "insurance number",
            searchType: searchTypeEnum.insurance_number,
            key: [searchTypeEnum.insurance_number]
        },
    ]




    useEffect(()=>{
        setSearchState({...searchState, page: 1})
    }, [searchState.limit])

    useEffect(()=>{
       if(deleteError ||createError || updateError){
           dispatch(errorSlice.actions.setErrors({message: `${deleteError || createError || updateError}` || "Unknown Error", type: messageType.errorType}))
        }
    },[deleteError, createError, updateError])

    return (
        <div className={cl.container}>
            <div className={cl.content}>
                <div className={cl.patientSearchContainer}>
                    <div className={cl.headOfSearch}>
                        <h1 className={cl.textOfHead}>
                            <svg className={cl.PCandPhoneIcon}>
                                <use xlinkHref={"/sprite.svg#PCAndPhoneIcon"}></use>
                            </svg>
                            Patient Management
                        </h1>
                    </div>
                    <div className={cl.tableContainer}>
                        <AdminTable
                            viewBtnOnClick={setForViewPatient}
                            deleteBtnOnClick={deletePatientRequest}
                            checkSortIconActive={checkSortIconActive}
                            onClickSortIconChange={searchStateChange}
                            TableData={dataOfAdminTable}
                            searchState={searchState}
                            setSearchState={setSearchState}
                            massiveOfRenderData={Patients || []}
                            searchParamsException={[searchTypeEnum.gender]}
                            unitedKeyForSorting={[searchTypeEnum.first_name, searchTypeEnum.last_name]}
                        />
                        <div className={cl.paginationPanelContainer}>
                            <div className={cl.statusInfoContainer}>
                                <div
                                    className={cl.statusInfoText}>{`Showing ${searchState && (searchState.limit * (searchState.page - 1)) + 1} to ${searchState.limit * searchState.page} of ${Amount || 0} entries`}</div>
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
                        <Loader isLoading={deleteIsLoading} isChildElement={true}/>
                    </div>
                </div>
                <div className={cl.viewContentContainer}>
                    <div className={cl.viewContentContainer__leftSideContainer}>
                        <ViewManageDataComponent
                            dataStructure={dataViewContainer}
                            yupValidationConst={viewDataYupSchema}
                            sectionName={"Data Settings"}
                            clearCallBack={clearViewPatient}
                            onSubmitCallBack={(object: viewDataReturnOnSubmitInterface)=>createOrUpdatePatientRequest(object)}
                            deleteCallBack={()=>deBounceWithConfirmation(()=>deletePatientRequest(patientState?.id!))}
                            object={(patientState && patientState) || {id: null}}
                        />
                        <Loader isLoading={deleteIsLoading || createIsLoading || updateIsLoading} isChildElement={true}/>
                    </div>
                    <div className={cl.viewContentContainer__rightSideContainer}>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientManagementSection;