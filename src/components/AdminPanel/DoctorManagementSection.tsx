import React, {useEffect, useMemo, useRef, useState} from 'react';
import cl from '../../modules/AdminPanel/DoctorManagementSection.module.css'
import InputWithLabel from "../additionalComponents/inputWithLabel";
import {generateRandomColorWithCross} from "../../utils/Color";
import {cleanSpaces, containsSubstring} from "../../utils/Text";
import SortIcon from "./SortIcon";
import {dateConvert} from "../../utils/Date";
import {specialityAPI} from "../../services/SpecialityService";
import {rolesAPI} from "../../services/RolesService";
import {doctorAPI} from "../../services/DoctorService";
import {roleControllerEnumAction, rolesAdminPanelInterface} from "../../types/rolesType";
import {createDoctor, doctorAdminPanelDataInterface, DoctorsItemInerface} from "../../types/doctorsType";
import {searchForwardsEnum, searchObjectsInterface, searchTypeEnum} from "../../types/adminPanelType";
import * as yup from "yup";
import {errorSlice} from "../../store/reducers/ErrorSlice";
import {messageType} from "../PopupMessage/PopupMessageItem";
import {useAppDispatch} from "../../hooks/redux";
import {specialityInterface} from "../../types/specialityType";
import Loader from "../additionalComponents/loader";
import EntriesSelect from "./entriesSelect";
import PaginationBar from "./PaginationBar";
import CustomBtn, {CustomBtnTypes} from "../additionalComponents/CustomBtn";


const validationYupSchemaDoctorCreate = yup.object().shape({
    id: yup.number().notRequired(),
    fullName: yup.string().required("Full Name is required").matches(
        /^[A-ZА-Я][a-zа-я]+\s[A-ZА-Я][a-zа-я]+$/,
        "Full Name must include both first and last name, each starting with a capital letter"
    ),
    phone: yup.string().transform(value => value.replace(/\s+/g, '')).required("Phone number is  required").matches(/^380\d{9}$/, 'Phone number must start with 380 and contain 12 digits in total').notRequired(),
    date_of_birth: yup.date().required("Date is required"),
    email: yup.string().required("Email is required").email("email is not correct"),
    password: yup.string().when("id", (values, schema)=>
        values[0] === undefined ? schema.required("Password is required when id not exists").min(6) : schema.notRequired()
    ),
    gender: yup.string().required("gender is required"),
    speciality: yup.string().notRequired(),
    office_number: yup.number().notRequired(),
    image_link: yup.string().notRequired(),
    address: yup.string().notRequired(),
    roles: yup.array().of(yup.string()).notRequired(),
})




const DoctorManagementSection = () => {


    const [searchState, setSearchState] = useState<searchObjectsInterface>()
    const [searchInputValue, setSearchInputValue] = useState<string>("")
    const [itemsRenderMassive, setItemsRenderMassive] = useState<DoctorsItemInerface[]>()
    const [roleMenuActive, setRoleMenuActive] = useState<boolean>(false);
    const [passwordActive, setPasswordActive] = useState<boolean>(false);
    const [doctorDataState, setDoctorDataState] = useState<doctorAdminPanelDataInterface>({
        first_name: "",
        last_name:"",
        email: "",
        phone:"",
        gender:"",
        speciality:"none",
        roles: [],
        date_of_birth: null,
    })

    const {data: Doctors, error: doctorsError, refetch: DoctorRefetch} = doctorAPI.useFetchAllDoctorsQuery({
        limit: searchState ? searchState.limit : 10,
        page: searchState?.page ? searchState.page : 1,
        role:"doctor"
    })

    const {data: Amount, refetch: AmountRefetch} = doctorAPI.useGetAmountDoctorsQuery({})
    const {data: Speciality} = specialityAPI.useGetAllSpecialityQuery({})
    const {data: Roles} = rolesAPI.useGetAllRolesQuery({})
    const [createDoctor, {  isLoading: createIsLoading, isSuccess, error: doctorErrors }] = doctorAPI.useCreateDoctorMutation()
    const [updateDoctor, { isLoading:updateIsLoading, isSuccess:updateIsSuccess, error: updatedDoctorErrors }] = doctorAPI.useUpdateDoctorMutation()
    const [deleteDoctor, { isLoading:deleteIsLoading, isSuccess: deleteIsSuccess, error: deleteDoctorErrors }] = doctorAPI.useDeleteDoctorMutation()

    const dispatch = useAppDispatch()
    const fullNameInputRef = useRef<HTMLInputElement | null>(null)
    const passwordInputRef = useRef<HTMLInputElement | null>(null)
    const dateInputRef = useRef<HTMLInputElement | null>(null)

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


    function changeHowManyDoctors(value: string){
        if(searchState){
            setSearchState({...searchState, limit: Number(value)})
        }
    }

    function checkSortIconActive(type:searchTypeEnum, forward: searchForwardsEnum){
        return type === searchState?.searchType && forward === searchState.searchForward;
    }


    function fullNameEnterController(str: string){
        const first_name = cleanSpaces(str).split(" ")[0]
        const last_name = cleanSpaces(str).split(" ")[1]

        if(str.split(" ")[0] !== undefined && str.split(" ")[1] !== undefined){
            setDoctorDataState({...doctorDataState, first_name, last_name})
        }else{
            setDoctorDataState({...doctorDataState, first_name: "", last_name: ""})
        }

    }

    function roleController(role: string, action: roleControllerEnumAction){
        if(roleControllerEnumAction.add === action && doctorDataState.roles){
            const roles = [...doctorDataState.roles]
            if(roles.includes(role)){
                return;
            }else{
                roles.push(role)
                setDoctorDataState({...doctorDataState, roles})
            }
        }else if(roleControllerEnumAction.delete === action && doctorDataState.roles){
            let roles = [...doctorDataState.roles]
            roles = roles.filter((value)=>value !== role)
            setDoctorDataState({...doctorDataState, roles})
        }
    }


    function doctorController(){
        try {
            if(validationYupSchemaDoctorCreate.validateSync({...doctorDataState, fullName: doctorDataState.first_name + " " + doctorDataState.last_name})){
                createOrUpdateFunction()
            }
        }catch (e){
            if (e instanceof yup.ValidationError) {
                dispatch(errorSlice.actions.setErrors({message: e.errors[0], type:messageType.errorType}))
            } else {
                console.error("Unexpected Error:", e);
            }
        }
    }


    function clearDoctorData(){
        setDoctorDataState({
            first_name: "",
            last_name:"",
            email: "",
            phone:"",
            gender:"",
            speciality:"none",
            roles: [],
            date_of_birth: null,
        })
        if(fullNameInputRef.current && dateInputRef.current && passwordInputRef.current){
            fullNameInputRef.current.value = "";
            dateInputRef.current.value = "";
            passwordInputRef.current.value = "";
        }


    }

    function setViewDoctorData(id: number){
        if(Doctors){
            const doctorData: DoctorsItemInerface =  Doctors.filter((value)=>value.id === id)[0]
            const roles: string[] = [];

            doctorData.roles.forEach((value)=>{
                roles.push(value.role)
            })

            setDoctorDataState({
                id: doctorData.id,
                first_name: doctorData.first_name,
                last_name: doctorData.last_name,
                email: doctorData.email,
                phone: doctorData.phone,
                gender: doctorData.gender,
                speciality: doctorData.speciality !== null ? doctorData.speciality.name : "none",
                roles: roles,
                date_of_birth: doctorData.date_of_birth ? doctorData.date_of_birth : null ,
                image_link: doctorData.image_link ? doctorData.image_link : "",
                address: doctorData.address ? doctorData.address : "",
                office_number: doctorData.office_number ? Number(doctorData.office_number) : 0,
            })
            if(fullNameInputRef.current){
                fullNameInputRef.current.value = doctorData.first_name + " " + doctorData.last_name;
            }
        }
    }


    async function createOrUpdateFunction(){
        try {
            const {speciality,
                id,...filterData} = doctorDataState

            let specialityArray: specialityInterface[] = [];
            let doctorResponse;

            if(Speciality){
                specialityArray = Speciality.filter((value)=>value.name === speciality)
            }


            let dataForUse: createDoctor = {
                first_name: filterData.first_name,
                last_name: filterData.last_name,
                email: filterData.email,
                gender: filterData.gender,
                date_of_birth: filterData.date_of_birth || new Date(),
                roles: filterData.roles && filterData.roles?.length > 0 ? filterData.roles : [],
            }


            if(specialityArray.length > 0){
                dataForUse.speciality_id = specialityArray[0].id;
            }

            if(filterData.password){
                dataForUse.password = filterData.password;
            }

            if(filterData.phone && filterData.phone.length > 7){
                dataForUse.phone = filterData.phone;
            }
            if(filterData.image_link && filterData.image_link !== "" ){
                dataForUse.image_link = filterData.image_link;
            }

            if(filterData.office_number && filterData.office_number !== 0){
                dataForUse.office_number = filterData.office_number.toString();
            }

            if(filterData.address && filterData.address.length > 2){
                dataForUse.address = filterData.address;
            }


            if(!doctorDataState.id){
                doctorResponse = await createDoctor(dataForUse)
            }else{
                doctorResponse = await updateDoctor({id: doctorDataState.id, newDoctor: dataForUse})
            }



            if(!doctorResponse?.error){
                dispatch(errorSlice.actions.setErrors({message: "action have got success", type:messageType.successType}))
            }else{
                throw new Error("failed to do action");
            }

            DoctorRefetch()
            AmountRefetch()
        }catch (e: any){
            const errorMessage = e?.message || "An unexpected error occurred";
            dispatch(errorSlice.actions.setErrors({message: errorMessage, type:messageType.errorType}))
        }
    }


    async function deleteDoctorRequest(id?: number){
        try {
            const askId = id || doctorDataState.id || 0

            const deletedDoctor = await deleteDoctor(askId)

            if(deletedDoctor){
                dispatch(errorSlice.actions.setErrors({message: "delete has been successfully", type:messageType.successType}))
            }else{
                throw new Error("failed to delete doctor");
            }
            DoctorRefetch()
            AmountRefetch()
        }catch (e:any){
            const errorMessage = e?.message || "An unexpected error occurred";
            dispatch(errorSlice.actions.setErrors({message:e, type:messageType.errorType}))
        }
    }


    useEffect(()=>{
        if(Doctors && !itemsRenderMassive){
            setSearchState({
                limit: 10,
                page: 1,
                searchForward: searchForwardsEnum.UP,
                searchType:searchTypeEnum.id
            })
        }

    },[Doctors])




    useEffect(()=>{
        if(Doctors){
            let doctorsMassive: DoctorsItemInerface[] = [...Doctors];
            if(cleanSpaces(searchInputValue).length >= 1){
                doctorsMassive = doctorsMassive.filter((value)=>Object.entries(value).some(value=>{
                    if(typeof value[1] === "object" && value[1] && value[1]?.name){
                        return containsSubstring(value[1].name.toString(), cleanSpaces(searchInputValue))
                    }else if(value[1] && value[1].toString() !== undefined && value[0] !== "gender" && value[0] !== "image_link"){
                        if(value[0] !== "date_of_birth"){
                            return containsSubstring(value[1].toString(), cleanSpaces(searchInputValue))
                        }else{
                            return containsSubstring(dateConvert(value[1].toString()), cleanSpaces(searchInputValue))
                        }
                    }
                }))
            }

            if(searchState?.searchForward === searchForwardsEnum.UP){
                if(searchState?.searchType === searchTypeEnum.id){
                    doctorsMassive.sort((a,b)=> a.id - b.id)
                }else if(searchState?.searchType === searchTypeEnum.birthday){
                    doctorsMassive.sort((a,b)=> new Date(a.date_of_birth).getTime() - new Date(b.date_of_birth).getTime())
                }else if(searchState?.searchType === searchTypeEnum.phone){
                    doctorsMassive.sort((a,b)=> a.phone.toLowerCase().localeCompare(b.phone.toLowerCase()))
                }else if(searchState?.searchType === searchTypeEnum.office_number) {
                    doctorsMassive.sort((a, b) => Number(a.office_number) - Number(b.office_number))
                }else if(searchState?.searchType === searchTypeEnum.email) {
                    doctorsMassive.sort((a, b) => a.email.toLowerCase().localeCompare(b.email.toLowerCase()))
                }else if(searchState?.searchType === searchTypeEnum.speciality) {
                    doctorsMassive.sort((a, b) =>{
                        if(a.speciality && b.speciality){
                            a.speciality.name.toLowerCase().localeCompare(b.speciality.name.toLowerCase())
                        }
                        return 0;
                    })
                }else if(searchState?.searchType === searchTypeEnum.fullname) {
                    doctorsMassive.sort((a, b) => (a.first_name + " " + a.last_name).toLowerCase().localeCompare((b.first_name + " " + b.last_name).toLowerCase()))
                }
            }else{
                if(searchState?.searchType === searchTypeEnum.id){
                    doctorsMassive.sort((a,b)=> b.id - a.id)
                }else if(searchState?.searchType === searchTypeEnum.birthday){
                    doctorsMassive.sort((a,b)=> new Date(b.date_of_birth).getTime() - new Date(a.date_of_birth).getTime())
                }else if(searchState?.searchType === searchTypeEnum.phone){
                    doctorsMassive.sort((a,b)=> b.phone.toLowerCase().localeCompare(a.phone.toLowerCase()))
                }else if(searchState?.searchType === searchTypeEnum.office_number) {
                    doctorsMassive.sort((a, b) => Number(b.office_number) - Number(a.office_number))
                }else if(searchState?.searchType === searchTypeEnum.email) {
                    doctorsMassive.sort((a, b) => b.email.toLowerCase().localeCompare(a.email.toLowerCase()))
                }else if(searchState?.searchType === searchTypeEnum.speciality) {
                    doctorsMassive.sort((a, b) =>{
                        if(a.speciality && b.speciality){
                           return b.speciality.name.toLowerCase().localeCompare(a.speciality.name.toLowerCase())
                        }
                        return 0
                    })
                }else if(searchState?.searchType === searchTypeEnum.fullname) {
                    doctorsMassive.sort((a, b) => (b.first_name + " " + b.last_name).toLowerCase().localeCompare((a.first_name + " " + a.last_name).toLowerCase()))
                }
            }
            setItemsRenderMassive(doctorsMassive)
        }

    }, [searchInputValue, searchState?.searchType, searchState?.searchForward, searchState?.limit, Doctors])


    const memoizedObject = useMemo(() => {
        const roles: rolesAdminPanelInterface[]  =  []
        if(Roles){
            Roles.forEach((value)=>{
                roles.push({role: value.role, color: generateRandomColorWithCross()})
            })
        }
        return roles
    }, [Roles]);



    return (
        <div className={cl.container}>
            <div className={cl.doctorSearchContainer}>
                <div className={cl.headOfSearch}>
                    <h1 className={cl.textOfHead}>
                        <svg className={cl.PCandPhoneIcon}>
                            <use xlinkHref={"/sprite.svg#PCAndPhoneIcon"}></use>
                        </svg>
                        Doctors Management
                    </h1>
                </div>
                <div className={cl.tableContainer}>
                    <div className={cl.chooseAdditionalActionsContainer}>
                        <EntriesSelect textBeforeSelect={"Show"} textAfterSelect={"entries"} options={["10","25", "50", "100"]} setState={changeHowManyDoctors}/>
                        <div className={cl.searchContainer}>
                            Search:
                            <input value={searchInputValue} onChange={(e)=>setSearchInputValue(e.target.value)}  className={cl.searchInput}/>
                        </div>
                    </div>
                    <table className={cl.doctorTable}>
                        <thead>
                        <tr className={cl.rowOfTHead}>
                            <th>
                                <span>#</span>
                                <div className={cl.sortSvgIconContainer}>
                                    <SortIcon
                                        arrowDirection={searchForwardsEnum.UP}
                                        searchType={searchTypeEnum.id}
                                        sortDirection={searchForwardsEnum.UP}
                                        isActive={checkSortIconActive(searchTypeEnum.id,searchForwardsEnum.UP)}
                                        onClick={searchStateChange}
                                    />
                                    <SortIcon
                                        arrowDirection={searchForwardsEnum.DOWN}
                                        searchType={searchTypeEnum.id}
                                        sortDirection={searchForwardsEnum.DOWN}
                                        isActive={checkSortIconActive(searchTypeEnum.id,searchForwardsEnum.DOWN)}
                                        onClick={searchStateChange}
                                    />
                                </div>
                            </th>
                            <th>
                                <span>Full name</span>
                                <div className={cl.sortSvgIconContainer}>
                                    <SortIcon
                                        arrowDirection={searchForwardsEnum.UP}
                                        searchType={searchTypeEnum.fullname}
                                        sortDirection={searchForwardsEnum.UP}
                                        isActive={checkSortIconActive(searchTypeEnum.fullname,searchForwardsEnum.UP)}
                                        onClick={searchStateChange}
                                    />
                                    <SortIcon
                                        arrowDirection={searchForwardsEnum.DOWN}
                                        searchType={searchTypeEnum.fullname}
                                        sortDirection={searchForwardsEnum.DOWN}
                                        isActive={checkSortIconActive(searchTypeEnum.fullname,searchForwardsEnum.DOWN)}
                                        onClick={searchStateChange}
                                    />
                                </div>
                            </th>
                            <th>
                                <span>email</span>
                                <div className={cl.sortSvgIconContainer}>
                                    <SortIcon
                                        arrowDirection={searchForwardsEnum.UP}
                                        searchType={searchTypeEnum.email}
                                        sortDirection={searchForwardsEnum.UP}
                                        isActive={checkSortIconActive(searchTypeEnum.email,searchForwardsEnum.UP)}
                                        onClick={searchStateChange}
                                    />
                                    <SortIcon
                                        arrowDirection={searchForwardsEnum.DOWN}
                                        searchType={searchTypeEnum.email}
                                        sortDirection={searchForwardsEnum.DOWN}
                                        isActive={checkSortIconActive(searchTypeEnum.email,searchForwardsEnum.DOWN)}
                                        onClick={searchStateChange}
                                    />
                                </div>
                            </th>
                            <th>
                                <span>birthday</span>
                                <div className={cl.sortSvgIconContainer}>
                                    <SortIcon
                                        arrowDirection={searchForwardsEnum.UP}
                                        searchType={searchTypeEnum.birthday}
                                        sortDirection={searchForwardsEnum.UP}
                                        isActive={checkSortIconActive(searchTypeEnum.birthday,searchForwardsEnum.UP)}
                                        onClick={searchStateChange}
                                    />
                                    <SortIcon
                                        arrowDirection={searchForwardsEnum.DOWN}
                                        searchType={searchTypeEnum.birthday}
                                        sortDirection={searchForwardsEnum.DOWN}
                                        isActive={checkSortIconActive(searchTypeEnum.birthday,searchForwardsEnum.DOWN)}
                                        onClick={searchStateChange}
                                    />
                                </div>
                            </th>
                            <th>
                                <span>speciality</span>
                                <div className={cl.sortSvgIconContainer}>
                                    <SortIcon
                                        arrowDirection={searchForwardsEnum.UP}
                                        searchType={searchTypeEnum.speciality}
                                        sortDirection={searchForwardsEnum.UP}
                                        isActive={checkSortIconActive(searchTypeEnum.speciality,searchForwardsEnum.UP)}
                                        onClick={searchStateChange}
                                    />
                                    <SortIcon
                                        arrowDirection={searchForwardsEnum.DOWN}
                                        searchType={searchTypeEnum.speciality}
                                        sortDirection={searchForwardsEnum.DOWN}
                                        isActive={checkSortIconActive(searchTypeEnum.speciality,searchForwardsEnum.DOWN)}
                                        onClick={searchStateChange}
                                    />
                                </div>
                            </th>
                            <th>
                                <span>phone</span>
                                <div className={cl.sortSvgIconContainer}>
                                    <SortIcon
                                        arrowDirection={searchForwardsEnum.UP}
                                        searchType={searchTypeEnum.phone}
                                        sortDirection={searchForwardsEnum.UP}
                                        isActive={checkSortIconActive(searchTypeEnum.phone,searchForwardsEnum.UP)}
                                        onClick={searchStateChange}
                                    />
                                    <SortIcon
                                        arrowDirection={searchForwardsEnum.DOWN}
                                        searchType={searchTypeEnum.phone}
                                        sortDirection={searchForwardsEnum.DOWN}
                                        isActive={checkSortIconActive(searchTypeEnum.phone,searchForwardsEnum.DOWN)}
                                        onClick={searchStateChange}
                                    />
                                </div>
                            </th>
                            <th>
                                <span>office number</span>
                                <div className={cl.sortSvgIconContainer}>
                                    <SortIcon
                                        arrowDirection={searchForwardsEnum.UP}
                                        searchType={searchTypeEnum.office_number}
                                        sortDirection={searchForwardsEnum.UP}
                                        isActive={checkSortIconActive(searchTypeEnum.office_number,searchForwardsEnum.UP)}
                                        onClick={searchStateChange}
                                    />
                                    <SortIcon
                                        arrowDirection={searchForwardsEnum.DOWN}
                                        searchType={searchTypeEnum.office_number}
                                        sortDirection={searchForwardsEnum.DOWN}
                                        isActive={checkSortIconActive(searchTypeEnum.office_number,searchForwardsEnum.DOWN)}
                                        onClick={searchStateChange}
                                    />
                                </div>
                            </th>
                            <th>
                                <span>actions</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {itemsRenderMassive && itemsRenderMassive?.length !== 0 ? itemsRenderMassive.map((value, index) =>
                            <tr key={value.id} className={cl.rowOfTBody}>
                                <td>{value.id}</td>
                                <td>{value.first_name + " " + value.last_name}</td>
                                <td>{value.email}</td>
                                <td>{dateConvert(value.date_of_birth.toString())}</td>
                                <td>{value.speciality ? value.speciality.name : "none"}</td>
                                <td>{value.phone}</td>
                                <td>{value.office_number}</td>
                                <td>
                                    <div className={cl.actionsButton}>
                                        <CustomBtn  styles={{maxWidth:"100px", height: "42px"}} onClick={()=>setViewDoctorData(value.id)} type={CustomBtnTypes.update}>View</CustomBtn>
                                        <CustomBtn  styles={{maxWidth:"100px", height: "42px"}} onClick={()=>deleteDoctorRequest(value.id)} type={CustomBtnTypes.delete}/>
                                    </div>
                                </td>
                            </tr>
                        )
                        :
                            <tr style={{display:"flex", justifyContent:"center", margin:"20px", fontSize:"26px"}}>not found</tr>
                        }
                        </tbody>
                        <thead>
                        <tr className={cl.rowOfTHead}>
                            <th>
                                <span>#</span>
                            </th>
                            <th>
                                <span>Full name</span>
                            </th>
                            <th>
                                <span>email</span>
                            </th>
                            <th>
                                <span>birthday</span>
                            </th>
                            <th>
                                <span>speciality</span>
                            </th>
                            <th>
                            <span>phone</span>
                            </th>
                            <th>
                                <span>office number</span>
                            </th>
                            <th>
                                <span>actions</span>
                            </th>
                        </tr>
                        </thead>
                    </table>
                    <Loader isLoading={deleteIsLoading} isChildElement={true}/>
                    <div className={cl.paginationPanelContainer}>
                        <div className={cl.statusInfoContainer}>
                            <div className={cl.statusInfoText}>{`Showing ${searchState && (searchState.limit * (searchState.page-1)) + 1} to ${searchState?.limit} of ${Amount || 0} entries`}</div>
                        </div>
                        <PaginationBar
                            previousPageFunc={()=>{
                                setSearchState({...searchState!, page: searchState!.page - 1})
                                console.log("1231")
                            }}
                            setPageFunc={(page: number)=>{
                                if(searchState){
                                    setSearchState({...searchState, page: page})
                                }
                            }}
                            nextPageFunc={()=>{
                                setSearchState({...searchState!, page: searchState!.page + 1})
                            }}
                            currentPage={ searchState && searchState.page || 1}
                            amount={Amount && Amount || 1}
                            limit={searchState && searchState.limit || 1}
                            style={{justifyContent:"end"}}
                        />
                    </div>
                </div>
            </div>

            <div className={cl.manageDataContainer}>
                <div className={cl.dataChangeContainer}>
                    <div className={cl.headerOfDataSettings}>
                        <h2 className={cl.headerOfDataChangeContainer}>Data Settings</h2>
                        <button onClick={()=>clearDoctorData()} className={cl.clearDataBtn}>Clear</button>
                    </div>
                    <form className={cl.dataForm}>
                        <div className={cl.inputContainer}>
                            <InputWithLabel ref={fullNameInputRef} onChange={(e) => fullNameEnterController(e.target.value)} labelName={"full name"}/>
                        </div>
                        <div className={cl.inputContainer}>
                            <InputWithLabel
                                value={doctorDataState.date_of_birth ? new Date(doctorDataState.date_of_birth).toISOString().split("T")[0] : ""} ref={dateInputRef}
                                onChange={(e)=>setDoctorDataState({...doctorDataState, date_of_birth: new Date(e.target.value)})}
                                type={"date"}
                                labelName={"birthday"}/>
                        </div>
                        <div className={cl.inputContainer}>
                            <InputWithLabel
                                value={doctorDataState.gender}
                                onChange={(e)=>setDoctorDataState({...doctorDataState, gender: e.target.value})}
                                labelName={"gender"}/>
                        </div>
                        <div className={cl.inputContainer}>
                            <InputWithLabel
                                value={Number(doctorDataState.phone ? doctorDataState.phone : `` )}
                                type={"number"}
                                onChange={(e)=>setDoctorDataState({...doctorDataState, phone: e.target.value})}
                                labelName={"phone"}/>
                        </div>
                        <div className={cl.inputContainer}>
                            <InputWithLabel
                                value={doctorDataState.email}
                                onChange={(e)=>setDoctorDataState({...doctorDataState, email: e.target.value})}
                                labelName={"email"}/>
                        </div>
                        <div className={cl.inputContainer}>
                            <InputWithLabel
                                value={doctorDataState.address ? doctorDataState.address : ""}
                                onChange={(e)=>setDoctorDataState({...doctorDataState, address: e.target.value})}
                                labelName={"address"}/>
                        </div>
                        <div className={cl.inputContainer}>
                            <InputWithLabel
                                value={doctorDataState.office_number ? Number(doctorDataState.office_number) : 0}
                                type={"number"}
                                onChange={(e)=>setDoctorDataState({...doctorDataState, office_number: Number(e.target.value) !== undefined ? Number(e.target.value) : 0})}
                                labelName={"office number"}
                            />
                        </div>
                        <div className={cl.inputContainer}>
                           <label>speciality</label>
                            <select onChange={(e) => setDoctorDataState({...doctorDataState, speciality: e.target.value})}>
                                <option disabled={true} selected={doctorDataState.speciality === "none"} >none</option>
                                {Speciality && Speciality.map((value, index) =>
                                    <option selected={value.name === doctorDataState.speciality} key={index}>{value.name}</option>
                                )}
                            </select>
                        </div>
                        <div className={cl.inputContainer}>
                            <InputWithLabel
                                value={doctorDataState.image_link ? doctorDataState.image_link : "" }
                                onChange={(e)=>setDoctorDataState({...doctorDataState, image_link: e.target.value})}
                                labelName={"image_link"}
                            />
                        </div>
                        <div style={{gap:"10px"}} className={cl.inputContainer}>
                            <InputWithLabel
                                ref={passwordInputRef}
                                disabled={!passwordActive}
                                onChange={(e)=>setDoctorDataState({...doctorDataState, password: e.target.value})} styles={{maxWidth: "calc(60% - 12px)"}}
                                labelName={"password"}
                            />
                            <input checked={passwordActive} onChange={(e)=>setPasswordActive(e.target.checked)}  className={cl.checkboxFOrPassword} type={"checkbox"}/>
                        </div>
                    </form>
                    <div className={cl.RolesContainer}>
                        <h2>Active Roles: </h2>
                        <div className={cl.roleSection}>
                            {memoizedObject.map((value, index) =>{
                                    if(doctorDataState.roles?.includes(value.role)) {
                                        return (
                                            <div key={value.role} className={cl.roleItem}>
                                                <div style={{backgroundColor: value.color}} className={cl.roleItemCircle}>
                                                    <span onClick={()=>roleController(value.role, roleControllerEnumAction.delete)} className={cl.closeBtn}>

                                                    </span>
                                                </div>
                                                {value.role}
                                            </div>
                                        )
                                    }
                                }
                            )}
                            <div onClick={() => setRoleMenuActive(!roleMenuActive)} className={cl.addRoleSquare}>
                                <div style={roleMenuActive ? {} : {display: "none"}} className={cl.addRoleMenu}>
                                    <div className={cl.menuContent}>
                                        {memoizedObject.map((value, index) =>
                                            <div onClick={()=>roleController(value.role, roleControllerEnumAction.add)}  key={index} className={cl.roleMenuItem}>
                                                <div style={{backgroundColor: value.color}} className={cl.roleItemCircle}>
                                                </div>
                                                {value.role}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cl.dataPreviewContainer}>
                    <div className={cl.photoAndRolesContainer}>
                        <div className={cl.photo}>
                            <img src={`${doctorDataState ? doctorDataState?.image_link : "/"}`} alt={"not found"}/>
                        </div>
                        <div className={cl.dataPreviewRoles}>
                            {doctorDataState.roles && doctorDataState.roles.map((value) =>
                                <div key={value} className={cl.roleItem}>
                                    {value}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={cl.dataPreviewContentContainer}>
                        <table>
                            <thead>
                            <tr className={cl.headText}>
                                <th>Information {doctorDataState && doctorDataState.id ? `#${doctorDataState.id}` : ""}</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th>full name</th>
                                <td>{doctorDataState && doctorDataState.first_name && doctorDataState.last_name && doctorDataState.first_name.length > 0 && doctorDataState.last_name.length >0 ? (doctorDataState.first_name + " " + doctorDataState.last_name) : "none"}</td>
                            </tr>
                            <tr>
                                <th>birthday</th>
                                <td>{doctorDataState && doctorDataState.date_of_birth !== null ? dateConvert( doctorDataState.date_of_birth.toString() ) : "none"}</td>
                            </tr>
                            <tr>
                                <th>gender</th>
                                <td>{doctorDataState && doctorDataState.gender.length > 0 ? doctorDataState.gender : "none"}</td>
                            </tr>
                            <tr>
                                <th>phone</th>
                                <td>{doctorDataState && doctorDataState.phone.length > 0 ? doctorDataState.phone : "none"}</td>
                            </tr>
                            <tr>
                                <th>email</th>
                                <td>{doctorDataState && doctorDataState.email.length > 0 ? doctorDataState.email : "none"}</td>
                            </tr>
                            <tr>
                                <th>address</th>
                                <td>{doctorDataState && doctorDataState.address && doctorDataState.address.length > 0 ? doctorDataState.address : "none"}</td>
                            </tr>
                            <tr>
                                <th>office number</th>
                                <td>{doctorDataState && doctorDataState.office_number ? doctorDataState.office_number : "none"}</td>
                            </tr>
                            <tr>
                                <th>speciality</th>
                                <td>{doctorDataState && doctorDataState.speciality !== "none" ? doctorDataState.speciality : "none"}</td>
                            </tr>
                            <tr style={passwordActive ? {} : {display:"none"}}>
                                <th>password</th>
                                <td>{doctorDataState && doctorDataState.password && doctorDataState.password.length > 0  ? doctorDataState.password : "none"}</td>
                            </tr>
                            </tbody>
                        </table>
                        <div className={cl.btnActionsContaner}>
                            <CustomBtn onClick={()=>doctorController()} styles={{maxWidth:"76px"}} type={doctorDataState && doctorDataState.id ? CustomBtnTypes.update : CustomBtnTypes.create}/>
                            <CustomBtn type={CustomBtnTypes.delete} styles={doctorDataState && doctorDataState.id ? {maxWidth:"110px"} : {pointerEvents: "none", maxWidth:"110px"}} onClick={()=>deleteDoctorRequest()}/>
                        </div>
                    </div>
                    <Loader isLoading={createIsLoading || updateIsLoading || deleteIsLoading} isChildElement={true}/>
                </div>
            </div>
        </div>
    );
};

export default DoctorManagementSection;