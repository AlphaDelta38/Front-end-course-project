import React, {useCallback, useEffect, useState} from 'react';
import cl from '../../modules/AdminPanel/AdminPanel.module.css'
import {
    chosenAttribute,
    mainSections,
    sectionActivities,
    sideBarAdminPanelElements,
    underSection
} from "../../types/adminPanelType";


const AdminPanel = () => {

    const [menuIsActive, setMenuIsActive] = useState<boolean | null>(null);
    const [menuActivities, setMenuActivities] = useState<sectionActivities>({
        mainSection: mainSections.doctor,
        underSection: underSection.actions,
        chosenAttribute: chosenAttribute.create,
        chosenUnderSection: underSection.actions,
        chosenMainSection: mainSections.doctor,
    })





    function changeMenuActive(){
        if(menuIsActive){
            setMenuIsActive(false)
        }else{
            setMenuIsActive(true);
        }
    }


    const disableState = useCallback((e: Event)=>{
        if(window.innerWidth > 992 && window.innerWidth < 1268){
            setMenuIsActive(false)
        }
    }, [])

    window.addEventListener("resize", disableState);

    useEffect(()=>{
        return ()=>{
            window.removeEventListener("resize", disableState);
        }
    },[])




    function changeSectionActivities(e:sectionActivities, NoClose?: boolean){
        if(NoClose){
            setMenuActivities({...e})
        }else if(menuActivities.underSection === null || menuActivities.mainSection !== e.mainSection){
            setMenuActivities({...e, underSection: e.underSection  })
        } else{
            setMenuActivities({...e, underSection: null  })
        }
    }



    return (
        <div className={cl.container}>
            <div className={cl.navigation}>
                <div style={menuIsActive ? {justifyContent: "end", maxWidth: "80px", minWidth: "80px"} : {}}
                     className={cl.logoAndButtonContainer}>
                    <div style={menuIsActive ? {display: "none"} : {}} className={cl.logo}>
                        <svg className={cl.Logo__icon}>
                            <use xlinkHref={"/sprite.svg#LogoIcon"}></use>
                        </svg>
                        <h1>Admin panel</h1>
                    </div>
                    <button onClick={() => changeMenuActive()} className={cl.burgerButton}>
                        <span className={`${cl.burgerButtonContainer} ${menuIsActive !== null && (menuIsActive ? cl.BurgerActive : cl.Burgerdefault)}`}>
                            <span className={`${cl.middleLine} ${menuIsActive !== null && (menuIsActive ? cl.middleLineActive : cl.middleLineDefault)}`}></span>
                        </span>
                    </button>
                    <button className={cl.additionalContentButton}>
                        <span className={cl.additionalBtnContainer}>
                            <div className={cl.AdditionalBtnEllipsis}></div>
                            <div className={cl.AdditionalBtnEllipsis}></div>
                            <div className={cl.AdditionalBtnEllipsis}></div>
                        </span>
                    </button>
                </div>
                <div className={cl.additionalcontent}>

                </div>
            </div>
            <div style={menuIsActive ? {paddingLeft: "80px"} : {}} className={cl.content}>
                <div className={`${cl.sideBarContainer} ${menuIsActive && cl.sideBarContainerActive}`}>
                    <div className={cl.sideBarContent}>
                        <ul>
                            {sideBarAdminPanelElements.map((mValue, mIndex)=>
                                <>
                                    <li key={mIndex} className={cl.heading}>{mValue.mainSection}</li>
                                    {mValue.underSections.map((sValue, sIndex) =>
                                        <li key={sIndex} style={
                                            menuActivities.mainSection === mainSections[mValue.mainSection.toLowerCase() as keyof typeof mainSections]
                                            && menuActivities.underSection === underSection[sValue.name.toLowerCase() as keyof  typeof  underSection] ? {
                                                fontWeight: "700",
                                                maxHeight: "200px"
                                            } : {}
                                        } className={cl.listItem}
                                        >
                                            <a onClick={() => changeSectionActivities({
                                                mainSection: mainSections[mValue.mainSection.toLowerCase() as keyof typeof mainSections],
                                                underSection: underSection[sValue.name.toLowerCase() as keyof typeof underSection],
                                                chosenAttribute: menuActivities.chosenAttribute,
                                                chosenUnderSection: menuActivities.chosenUnderSection,
                                                chosenMainSection: menuActivities.chosenMainSection,
                                            })}>
                                                <i className={cl.listItem__sectionIconContainer}>
                                                    <svg className={cl.sectionIcon}>
                                                        <use xlinkHref={"/sprite.svg#DoctorIcon"}></use>
                                                    </svg>
                                                </i>
                                                {sValue.name}
                                                <i className={cl.listItem__chevronIconContainer}>
                                                    <svg style={
                                                        menuActivities.mainSection === mainSections[mValue.mainSection.toLowerCase() as keyof typeof mainSections]
                                                        && menuActivities.underSection === underSection[sValue.name.toLowerCase() as keyof  typeof  underSection] ? {transform: "rotate(-90deg)"} : {}}
                                                         className={cl.chevronIcon}>
                                                        <use xlinkHref={"/sprite.svg#ChevronIcon"}></use>
                                                    </svg>
                                                </i>
                                            </a>
                                            <ul className={cl.underList}>
                                                {sValue.attributes.map((value, index) =>
                                                    <li
                                                        style={
                                                            menuActivities.chosenAttribute === value.toLowerCase()
                                                            && menuActivities.chosenMainSection === mainSections[mValue.mainSection.toLowerCase() as keyof typeof mainSections]
                                                            && menuActivities.chosenUnderSection === underSection[sValue.name.toLowerCase() as keyof  typeof  underSection]
                                                                ? {
                                                                    background: "#e0f3ff",
                                                                    color: "#3f6ad8",
                                                                    fontWeight: "700"
                                                                } : {}
                                                        }
                                                        onClick={() => changeSectionActivities({
                                                            mainSection: mainSections[mValue.mainSection.toLowerCase() as keyof typeof mainSections],
                                                            underSection: underSection[sValue.name.toLowerCase() as keyof  typeof  underSection],
                                                            chosenAttribute: chosenAttribute[value.toLowerCase() as keyof typeof chosenAttribute] || null,
                                                            chosenUnderSection:  underSection[sValue.name.toLowerCase() as keyof  typeof  underSection],
                                                            chosenMainSection: mainSections[mValue.mainSection.toLowerCase() as keyof typeof mainSections],
                                                        }, true)
                                                        }
                                                        key={index}
                                                    >
                                                        {value}
                                                    </li>
                                                )}
                                            </ul>
                                        </li>
                                    )}
                                </>
                            )}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminPanel;