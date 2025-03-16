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
    additionalFunctionForSorting?: (a:any, b: any, )=>number | null
}


const AdminTable = ({
                        deleteBtnOnClick,
                        viewBtnOnClick,
                        checkSortIconActive,
                        onClickSortIconChange,
                        TableData,
                        setSearchState,
                        searchState,
                        massiveOfRenderData,
                        searchParamsException,
                        unitedKeyForSorting,
                        firstBtnName,
                        additionalFunctionForSorting,
}:AdminTableInterface) => {

    const [itemsRenderMassive, setItemsRenderMassive] = useState<any[]>([]);
    const [searchInputValue, setSearchInputValue] = useState("");

    function isValidDateString(value:any) {
        if (typeof value !== "string") return false;

        const date = new Date(value);

        if (isNaN(date.getTime())) return false;

        return value === date.toISOString().slice(0, 10) ||
            value === date.toISOString();
    }


    function stringHandler(massive: string[], objectValues: any, searchTypeEnum?: string) {
        let str = ""
        massive.forEach(item => {
                if(typeof objectValues[item] === "boolean"){
                    str += `${objectValues[item]}`
                }else if(searchTypeEnum && massive.every(itemTwo=>searchTypeEnum !== itemTwo)){
                    str += objectValues[searchTypeEnum][item]
                }else if(!isNaN(objectValues[item])){
                    if(objectValues[item]){
                        str += objectValues[item].toString()
                    }
                }else if(!isNaN(new Date(objectValues[item]).getTime()) && isValidDateString(objectValues[item])){
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
            const optimizationSearchWithKey: string[] = [];

            let massive = [...massiveOfRenderData]
            if(cleanSpaces(searchInputValue).length >= 1){
                massive = massive.filter((value1)=>Object.entries(value1).some(value=>{
                    if(typeof value[1] === "boolean"){
                        return containsSubstring(`${value[1]}`, cleanSpaces(searchInputValue))
                    }else if(typeof value[1] === "object" && value[1] && Object.keys(value[1]).length > 0 ){
                        const massiveOfObjects = Object.entries(value[1])
                        let str = ""
                        for (let i = 0; i < Object.entries(value[1]).length; i++) {
                                    str += massiveOfObjects[i][1].toString()
                                    str += " "
                        }
                        return containsSubstring(cleanSpaces(str), cleanSpaces(searchInputValue))
                    }else if(value[1] && value[1].toString() !== undefined && !searchParamsException.some((value)=>value === value[0])){
                        if(isNaN(new Date(value[1].toString()).getTime())){
                            const checkKey = TableData.find(item=>item.searchType === `${value[0]}`)?.key
                            if((checkKey ? checkKey.length >= 1 : false) && !optimizationSearchWithKey.includes(value[0])){
                                if(checkKey){
                                    let str = ""
                                    for (let i = 0; i < checkKey.length; i++) {
                                        str += value1[checkKey[i]]
                                        str += " "
                                    }

                                    return containsSubstring(str, cleanSpaces(searchInputValue))
                                }
                            }
                            return containsSubstring(value[1].toString(), cleanSpaces(searchInputValue))
                        }else{
                            return containsSubstring(dateConvert(value[1].toString()), cleanSpaces(searchInputValue))
                        }
                    }
                }))
            }

            if(searchState.searchForward === searchForwardsEnum.UP){
                massive.sort((a,b)=>{

                    if(additionalFunctionForSorting){
                        const firstCheck = additionalFunctionForSorting(a[searchState.searchType],b[searchState.searchType])
                        if(firstCheck !== null){
                            return firstCheck
                        }

                    }

                    if(unitedKeyForSorting && unitedKeyForSorting.some((value)=>value === a[searchState.searchType])){
                        return stringHandler(unitedKeyForSorting,a).localeCompare(stringHandler(unitedKeyForSorting,b))
                    }else if(!isNaN(a[searchState.searchType])){
                        return Number(a[searchState.searchType] - b[searchState.searchType])
                    }else if(!isNaN(new Date(a[searchState.searchType]).getTime())){
                        return new Date(a[searchState.searchType]).getTime() - new Date(b[searchState.searchType]).getTime()
                    }else if(isNaN(a[searchState.searchType]) && typeof a[searchState.searchType] !== "object"){
                        return a[searchState.searchType].toLowerCase().localeCompare(b[searchState.searchType].toLowerCase())
                    }else if(typeof a[searchState.searchType] === "object"){
                        let strFirst = ""
                        let strSecond = ""

                        for (let i = 0; i < Object.entries(a[searchState.searchType]).length; i++) {
                            const currentItemFirst = Object.entries(a[searchState.searchType])[i][1]
                            const currentItemSecond = Object.entries(b[searchState.searchType])[i][1]
                            if(typeof currentItemFirst === "string" && typeof currentItemSecond === "string"){
                                strFirst += currentItemFirst
                                strFirst += " "
                                strSecond += currentItemSecond
                                strSecond += " "
                            }
                        }
                        return strFirst.localeCompare(strSecond)
                    }
                })
            }else{
                massive.sort((a,b)=>{

                    if(additionalFunctionForSorting){
                        const firstCheck = additionalFunctionForSorting(b[searchState.searchType],a[searchState.searchType])
                        if(firstCheck !== null) {
                            return firstCheck
                        }
                    }


                    if(unitedKeyForSorting && unitedKeyForSorting.some((value)=>value === a[searchState.searchType])){
                        return stringHandler(unitedKeyForSorting,b).localeCompare(stringHandler(unitedKeyForSorting,a))
                    }else if(!isNaN(a[searchState.searchType])){
                        return Number(b[searchState.searchType] - a[searchState.searchType])
                    }else if(!isNaN(new Date(a[searchState.searchType]).getTime())){
                        return new Date(b[searchState.searchType]).getTime() - new Date(a[searchState.searchType]).getTime()
                    }else if(isNaN(a[searchState.searchType]) && typeof a[searchState.searchType] !== "object"){
                        return b[searchState.searchType].toLowerCase().localeCompare(a[searchState.searchType].toLowerCase())
                    }else if(typeof a[searchState.searchType] === "object"){
                        let strFirst = ""
                        let strSecond = ""

                        for (let i = 0; i < Object.entries(a[searchState.searchType]).length; i++) {
                            const currentItemFirst = Object.entries(a[searchState.searchType])[i][1]
                            const currentItemSecond = Object.entries(b[searchState.searchType])[i][1]
                            if(typeof currentItemFirst === "string" && typeof currentItemSecond === "string"){
                                strFirst += currentItemFirst
                                strFirst += " "
                                strSecond += currentItemSecond
                                strSecond += " "
                            }

                        }
                        return strSecond.localeCompare(strFirst)

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
                                <td style={valueUn?.styles?.data ? valueUn.styles.data : {}} key={indexUn}>{stringHandler(valueUn.key, value, valueUn.searchType) || "none"}</td>
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