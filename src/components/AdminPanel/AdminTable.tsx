import React, {useEffect, useState} from 'react';
import cl from "../../modules/AdminPanel/AdminTable.module.css";
import SortIcon from "./SortIcon";
import {
    AdminTableDataType,
    searchForwardsEnum,
    searchObjectsInterface,
    searchTypeEnum
} from "../../types/adminPanelType";
import {dateConvert} from "../../utils/Date";
import CustomBtn, {CustomBtnTypes} from "../additionalComponents/CustomBtn";
import {cleanSpaces, containsSubstring} from "../../utils/Text";
import EntriesSelect from "./entriesSelect";
import {deBounceWithConfirmation} from "../../utils/deBounce";





interface AdminTableInterface{
    viewBtnOnClick: (id: number)=>void,
    deleteBtnOnClick: (id: number)=>void,
    checkSortIconActive: (type: searchTypeEnum, forward: searchForwardsEnum)=>boolean
    onClickSortIconChange: (searchType: searchTypeEnum, sortDirection: searchForwardsEnum) => void;
    TableData: AdminTableDataType
    searchState: searchObjectsInterface,
    setSearchState: (e : searchObjectsInterface)=>void
    massiveOfRenderData: any[]
    searchParamsException: string[]
    unitedKeyForSorting?: string[]
    firstBtnName?: string
}


const AdminTable = ({deleteBtnOnClick,viewBtnOnClick, checkSortIconActive, onClickSortIconChange,TableData,setSearchState,searchState,massiveOfRenderData,searchParamsException,unitedKeyForSorting,firstBtnName}:AdminTableInterface) => {

    const [itemsRenderMassive, setItemsRenderMassive] = useState<any[]>([]);
    const [searchInputValue, setSearchInputValue] = useState("");

    function stringHandler(massive: string[], objectValues: any){
        let str = ""

        massive.forEach(item => {
                if(!isNaN(objectValues[item])){
                    str += objectValues[item].toString()
                }else if(!isNaN(new Date(objectValues[item]).getTime())){
                    str = dateConvert(objectValues[item].toString())
                }else if(typeof objectValues[item] === "string"){
                    str += objectValues[item]
                }else if(typeof objectValues[item] === "object"){
                    str = Object.entries(objectValues[item])[1][1]!.toString()
                }
                str += " "
        })
        return cleanSpaces(str)
    }


    function limitChange(limit: string){
        setSearchState({...searchState, limit: Number(limit)})
    }


    useEffect(()=>{
        if(massiveOfRenderData){
            let massive = [...massiveOfRenderData]
            if(cleanSpaces(searchInputValue).length >= 1){
                massive = massive.filter((value)=>Object.entries(value).some(value=>{
                    if(typeof value[1] === "object" && value[1] && Object.entries(value[1]) && Object.entries(value[1])[1]){
                        return containsSubstring(Object.entries(value[1])[1][1].toString(), cleanSpaces(searchInputValue))
                    }else if(value[1] && value[1].toString() !== undefined && !searchParamsException.some((value)=>value === value[0])){
                        if(isNaN(new Date(value[1].toString()).getTime())){
                            return containsSubstring(value[1].toString(), cleanSpaces(searchInputValue))
                        }else{
                            return containsSubstring(dateConvert(value[1].toString()), cleanSpaces(searchInputValue))
                        }
                    }
                }))
            }

            if(searchState.searchForward === searchForwardsEnum.UP){
                massive.sort((a,b)=>{
                    if(unitedKeyForSorting && unitedKeyForSorting.some((value)=>value === a[searchState.searchType])){
                          return stringHandler(unitedKeyForSorting,a).localeCompare(stringHandler(unitedKeyForSorting,b))
                    }else if(!isNaN(a[searchState.searchType])){
                        return Number(a[searchState.searchType] - b[searchState.searchType])
                    }else if(!isNaN(new Date(a[searchState.searchType]).getTime())){
                          return new Date(a[searchState.searchType]).getTime() - new Date(b[searchState.searchType]).getTime()
                    }else if(isNaN(a[searchState.searchType]) && typeof a[searchState.searchType] !== "object"){
                          return a[searchState.searchType].toLowerCase().localeCompare(b[searchState.searchType].toLowerCase())
                    }else if(typeof a[searchState.searchType] === "object"){
                          if(typeof Object.entries(a[searchState.searchType])[1][1] === "string"){
                              return  Object.entries(a[searchState.searchType])[1][1]!.toString().localeCompare(Object.entries(b[searchState.searchType])[1][1]!.toString())
                          }
                    }
                })
            }else{
                massive.sort((a,b)=>{
                    if(unitedKeyForSorting && unitedKeyForSorting.some((value)=>value === a[searchState.searchType])){
                        return stringHandler(unitedKeyForSorting,b).localeCompare(stringHandler(unitedKeyForSorting,a))
                    }else if(!isNaN(a[searchState.searchType])){
                        return Number(b[searchState.searchType] - a[searchState.searchType])
                    }else if(!isNaN(new Date(a[searchState.searchType]).getTime())){
                        return new Date(b[searchState.searchType]).getTime() - new Date(a[searchState.searchType]).getTime()
                    }else if(isNaN(a[searchState.searchType]) && typeof a[searchState.searchType] !== "object"){
                        return b[searchState.searchType].toLowerCase().localeCompare(a[searchState.searchType].toLowerCase())
                    }else if(typeof a[searchState.searchType] === "object"){
                        if(typeof Object.entries(a[searchState.searchType])[1][1] === "string"){
                            return  Object.entries(b[searchState.searchType])[1][1]!.toString().localeCompare(Object.entries(a[searchState.searchType])[1][1]!.toString())
                        }
                    }
                })
            }


            setItemsRenderMassive(massive)
        }
    },[searchState.searchType, searchState.searchForward, massiveOfRenderData, searchInputValue])





    return (
        <>
            <div className={cl.chooseAdditionalActionsContainer}>
                <EntriesSelect textBeforeSelect={"Show"} textAfterSelect={"entries"} options={["10", "25", "50", "100"]}
                               setState={limitChange}/>
                <div className={cl.searchContainer}>
                    Search:
                    <input value={searchInputValue} onChange={(e) => setSearchInputValue(e.target.value)}
                           className={cl.searchInput}/>
                </div>
            </div>
            <table className={cl.doctorTable}>
                <thead>
                <tr className={cl.rowOfTHead}>
                    {TableData.map((value, index) =>
                        <th style={value?.styles?.headers ? value.styles.headers  : {}} key={index}>
                            <span>{value.value}</span>
                            <div className={cl.sortSvgIconContainer}>
                                <SortIcon
                                    searchType={value.searchType}
                                    sortDirection={searchForwardsEnum.UP}
                                    isActive={checkSortIconActive(value.searchType, searchForwardsEnum.UP)}
                                    onClick={onClickSortIconChange}
                                />
                                <SortIcon
                                    searchType={value.searchType}
                                    sortDirection={searchForwardsEnum.DOWN}
                                    isActive={checkSortIconActive(value.searchType, searchForwardsEnum.DOWN)}
                                    onClick={onClickSortIconChange}
                                />
                            </div>
                        </th>
                    )}
                    <th>
                        <span>Action</span>
                    </th>
                </tr>
                </thead>
                <tbody>
                {itemsRenderMassive && itemsRenderMassive?.length !== 0 ? itemsRenderMassive.map((value, index) =>
                        <tr key={value["id"] || index} className={cl.rowOfTBody}>
                            {TableData.map((valueUn, indexUn) =>
                                <td style={valueUn?.styles?.data ? valueUn.styles.data : {}} key={indexUn}>{stringHandler(valueUn.key, value) || "none"}</td>
                            )}
                            <td>
                                <div className={cl.actionsButton}>
                                    <CustomBtn styles={{maxWidth: "100px", height: "42px"}}
                                               onClick={()=>viewBtnOnClick(value["id"])}
                                               type={CustomBtnTypes.update}>{firstBtnName || "View"}</CustomBtn>
                                    <CustomBtn styles={{maxWidth: "100px", height: "42px"}}
                                               onClick={()=>deBounceWithConfirmation(()=>deleteBtnOnClick(value["id"]))}
                                               type={CustomBtnTypes.delete}/>
                                </div>
                            </td>
                        </tr>
                    )
                    :
                    <tr style={{display: "flex", justifyContent: "center", margin: "20px", fontSize: "26px"}}>
                        <td>not found</td>
                    </tr>
                }
                </tbody>
                <thead>
                <tr className={cl.rowOfTHead}>
                    {TableData.map((value, index) =>
                        <th style={value?.styles?.headers ? value.styles.headers  : {}} key={`underHead-${index}`}>
                            <span>{value.value}</span>
                        </th>
                    )}
                    <th>
                        <span>Action</span>
                    </th>
                </tr>
                </thead>
            </table>
        </>
    );
};

export default AdminTable;