import React from 'react';
import cl from "../../modules/AdminPanel/DoctorManagementSection.module.css";
import {searchForwardsEnum, searchTypeEnum} from "../../types/adminPanelType";





interface SortIconProps {
    searchType: searchTypeEnum;
    sortDirection: searchForwardsEnum;
    isActive: boolean;
    onClick: (searchType: searchTypeEnum, sortDirection: searchForwardsEnum) => void;
    arrowDirection: searchForwardsEnum
}


const SortIcon: React.FC<SortIconProps> = ({sortDirection,searchType,onClick,isActive, arrowDirection}) => {
    return (
        <div>
            <svg style={arrowDirection === searchForwardsEnum.UP ? {} : {transform:"rotate(90deg)"}} onClick={()=>onClick(searchType, sortDirection)} className={`${cl.sortIcon} ${isActive && cl.sortIconActive}`}>
                <use xlinkHref={"/sprite.svg#LongRightArrowIcon"}></use>
            </svg>
        </div>
    );
};

export default SortIcon;