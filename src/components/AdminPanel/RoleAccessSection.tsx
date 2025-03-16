import React, {useEffect, useState} from 'react';
import cl from '../../modules/AdminPanel/RoleAccessSection.module.css'
import {routeAccessAPI} from "../../services/RouteAccessService";
import {rolesAPI} from "../../services/RolesService";
import CustomBtn, {CustomBtnTypes} from "../additionalComponents/CustomBtn";
import CustomSelect from "../additionalComponents/CustomSelect";
import {useAppDispatch} from "../../hooks/redux";
import {errorSlice} from "../../store/reducers/ErrorSlice";
import {messageType} from "../PopupMessage/PopupMessageItem";
import Loader from "../additionalComponents/loader";


interface objectInterface{
    [key: string]: {
        method: string,
        path: string,
        serverRealPath: string,
    }[];
}

interface currentRoleSettingsInterface{
    id: number | null,
    accessPath: string[]
}

interface colorInterface{
    [key: string]: string
}



const RoleAccessSection = () => {


    const [keysState, setKeysState] = useState<string[]>([]);
    const [currentRoleSettings, setCurrentRoleSettings] = useState<currentRoleSettingsInterface>({
        id: null,
        accessPath: []
    })
    const [allPathDataState, setAllPathDataState] = useState<objectInterface>();
    const [customSelectState, setCustomSelectState] = useState<string>("Choose the role")
    const [itemActive, setItemActive] = useState<string>("none")
    const [addAccessBtnActive, setAddAccessBtnActive] = useState<boolean>(false)

    const {data: AllEndpoints, isLoading: isLoadingEndpoints} = routeAccessAPI.useGetAllRoutesQuery({})
    const {data: Roles, refetch: RolesRefetch, isLoading: isLoadingRoles} = rolesAPI.useGetAllRolesQuery({
        all: "true"
    })
    const [createAccess, {isLoading: isLoadingAccessUpdate}] = routeAccessAPI.useCreateAccessToRoleMutation()

    const dispatch = useAppDispatch()

    function changeCurrentSettings(value:string, state:boolean){
        const newAccessPath = [...currentRoleSettings.accessPath]
        if(state){
            newAccessPath.push(value)
            setCurrentRoleSettings({...currentRoleSettings, accessPath: newAccessPath})
        }else {
            setCurrentRoleSettings({...currentRoleSettings, accessPath: newAccessPath.filter((path)=>path !== value)})
        }
    }

    function setPath(key: string){
        if(allPathDataState){
            const currentPath = [...currentRoleSettings.accessPath]
            allPathDataState[key].forEach((value)=>{
                currentPath.push(value.serverRealPath)
            })
            setCurrentRoleSettings({...currentRoleSettings, accessPath: currentPath})
        }
    }




    async function createAndUpdateAccess(){
        try {
           let response;
           if(currentRoleSettings.id){
                response = await createAccess({
                    role_id: currentRoleSettings.id,
                    routes: currentRoleSettings.accessPath || [],
                })
           }

           if(response?.error){
               //@ts-ignore
               throw new Error(response?.error.data.message)

           }

            RolesRefetch()
        }catch (e){
            //@ts-ignore
            const error = e.message || "Error with update access"
            dispatch(errorSlice.actions.setErrors({message: error, type: messageType.errorType}))
        }
    }


    useEffect(()=>{
        if(AllEndpoints){
            let filteredEndpoints: objectInterface = {}
            const keys:string[] = []


            AllEndpoints.routes.forEach((value)=>{
                const method = value.split(" ")[0]
                const path = value.split(" ")[1]
                const generalEndPointName = value.split(" ")[1].split("/")[1]

                if(!keys.includes(generalEndPointName)){
                    keys.push(generalEndPointName)
                }

                filteredEndpoints[generalEndPointName] = filteredEndpoints[generalEndPointName] ?? []
                filteredEndpoints[generalEndPointName].push({
                    method: method,
                    path: path,
                    serverRealPath: value,
                })
            })

            setKeysState(keys)
            setAllPathDataState(filteredEndpoints)
        }
    }, [AllEndpoints])


    useEffect(()=>{
        if(Roles && Roles.map(item=>item.role).includes(customSelectState)){
            const role = Roles.find(item => item.role === customSelectState)
            if(role){
                setCurrentRoleSettings({
                    id: role.id,
                    accessPath: role.routeAccess?.routes || [],
                })
            }
        }
    }, [customSelectState])


    const colorsForMethods: colorInterface = {
        GET: "#81C784",
        POST: "#FFF176",
        PUT: "#64B5F6",
        DELETE: "#E57373",
    }


    return (
        <div className={cl.container}>
            <Loader isLoading={isLoadingEndpoints || isLoadingRoles || isLoadingAccessUpdate} isChildElement={true}/>
            <div className={cl.content}>
                <div className={cl.createBtnContainer}>
                    <div className={cl.headOfSearch}>
                        <h1 className={cl.textOfHead}>
                            <svg className={cl.PCandPhoneIcon}>
                                <use xlinkHref={"/sprite.svg#PCAndPhoneIcon"}></use>
                            </svg>
                            Roles Access Settings
                        </h1>
                    </div>
                   <div className={cl.btnContainer}>
                       <CustomSelect style={{fontSize:"1rem"}} data={Roles ? Roles.map(item=>item.role) : []} currentValue={customSelectState} callback={(value)=>setCustomSelectState(value)}/>
                       <CustomBtn styles={{maxWidth: "200px", height:"100%"}} onClick={() =>createAndUpdateAccess()} type={CustomBtnTypes.update}/>
                   </div>
                </div>
                <div style={currentRoleSettings.id ? {} : {display:"none"}} className={cl.accessContentContainer}>
                    {currentRoleSettings.accessPath &&
                        keysState.map((value)=>{
                            if(currentRoleSettings.accessPath.some((path)=>path.includes(value))) {
                                return <div style={itemActive === value ? {maxHeight:"246px"} : {maxHeight:"46px"}} className={cl.item}>
                                            <div onClick={()=>setItemActive(itemActive === value ? "none" : value)}  className={cl.item__header}>
                                                <h2>{value}</h2>
                                                <div className={cl.svgChevronContainer}>
                                                    <svg style={itemActive === value ? {transform: "rotate(-180deg)"} : {}}>
                                                        <use xlinkHref={"/sprite.svg#ChevronIcon"}></use>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className={cl.item__contentContainer}>
                                                {allPathDataState && allPathDataState[value].map((value,index) =>
                                                    <div  key={value.serverRealPath} className={cl.pathItem}>
                                                        <div className={cl.pathItem__header}>
                                                            <h3 style={{color: colorsForMethods[value.method.toUpperCase()]}}>{value.method}</h3>
                                                            <span>{value.path}</span>
                                                        </div>
                                                        <input onChange={(e)=>changeCurrentSettings(value.serverRealPath, e.target.checked)} checked={currentRoleSettings.accessPath.includes(value.serverRealPath)} className={cl.pathItem__checkBox} type={"checkbox"}/>
                                                    </div>
                                                )}
                                            </div>
                                </div>
                            }
                        })
                    }
                    <div onClick={() => setAddAccessBtnActive(!addAccessBtnActive)}
                         style={addAccessBtnActive ? {maxHeight: "100%"} : {maxHeight: "34px"}}
                         className={cl.addNewAccess}>
                        <div className={cl.svgAddContainer}>
                            <svg>
                                <use xlinkHref={"/sprite.svg#AddCloudIcon"}></use>
                            </svg>
                        </div>
                        <div className={cl.chooseContainer}>
                            {keysState.filter((value) => !currentRoleSettings.accessPath.some((value2) => value2.includes(value))).map((value) =>
                                <h3 onClick={() => setPath(value)} key={value}>{value}</h3>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleAccessSection;