import React, {useCallback, useEffect, useMemo, useState} from 'react';
import cl from '../../modules/AdminPanel/AdminPanel.module.css'
import {
    chosenAttribute,
    mainSections,
    sectionActivities,
    sideBarAdminPanelElements,
    underSection
} from "../../types/adminPanelType";


const AdminPanel = () => {

    let lastAdminPanelPath = localStorage.getItem("lastAdminPanelPath");
    let lastMainSectionPath = (lastAdminPanelPath && mainSections[lastAdminPanelPath.split(" ")[0] as keyof typeof  mainSections]) || mainSections.doctor
    let lastChosenAttribute = (lastAdminPanelPath && chosenAttribute[lastAdminPanelPath.split(" ")[1] as keyof typeof  chosenAttribute]) || chosenAttribute.management


    const [menuIsActive, setMenuIsActive] = useState<boolean | null>(null);
    const [menuActivities, setMenuActivities] = useState<sectionActivities>({
        mainSection: lastMainSectionPath,
        underSection: underSection.actions,
        chosenAttribute: lastChosenAttribute,
        chosenUnderSection: underSection.actions,
        chosenMainSection: lastMainSectionPath,
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
            setMenuIsActive(true)
        }
    }, [])

    window.addEventListener("resize", disableState);

    useEffect(()=>{
        if(window.innerWidth > 992 && window.innerWidth < 1268){
            setMenuIsActive(true)
        }
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



    const element = useMemo(()=>{

        const element = sideBarAdminPanelElements.find((value)=>value.mainSection === menuActivities.chosenMainSection)
            ?.underSections
            .find((value)=>value.name === menuActivities.chosenUnderSection)
            ?.attributes.find((value)=>value.attribute === menuActivities.chosenAttribute)
            if(element?.element){
               // @ts-ignore
                return ()=><element.element/>
            }
        return () => <></>
    }, [menuActivities.chosenMainSection, menuActivities.chosenUnderSection, menuActivities.chosenAttribute])


    useEffect(() => {
        localStorage.setItem("lastAdminPanelPath", menuActivities.mainSection + " " + menuActivities.chosenAttribute)
    }, [menuActivities.chosenAttribute, menuActivities.chosenMainSection]);

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
                                                maxHeight: `${(sValue.attributes.length+2) * 38}px`
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
                                                        <use xlinkHref={`/sprite.svg#${mValue.svgIconPath}`}></use>
                                                    </svg>
                                                </i>
                                                <span className={cl.text}>{sValue.name}</span>
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
                                                            menuActivities.chosenAttribute === value.attribute.toLowerCase()
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
                                                            chosenAttribute: chosenAttribute[value.attribute.toLowerCase() as keyof typeof chosenAttribute] || null,
                                                            chosenUnderSection:  underSection[sValue.name.toLowerCase() as keyof  typeof  underSection],
                                                            chosenMainSection: mainSections[mValue.mainSection.toLowerCase() as keyof typeof mainSections],
                                                        }, true)
                                                        }
                                                        key={index}
                                                    >
                                                        <span>{value.attribute}</span>
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
                {
                    element()
                }
            </div>
        </div>
    );
};

export default AdminPanel;