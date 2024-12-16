import React, {useState} from 'react';
import cl from './modules/functionalButton.module.css'
import {useLocation, useNavigate} from "react-router-dom";
import {useAppSelector} from "../../hooks/redux";
import {gsap} from "gsap";






const FunctionalButton = () => {

    const {id: UserId, email, roles} = useAppSelector(state => state.userReducer)
    const location = useLocation();
    const navigate = useNavigate()


    const scrollToSection = (target:any) => {
        gsap.to(window, {
            duration: 1.0,
            scrollTo: { y: target, autoKill: true },
            ease: "power2.out"
        });
    };


    function checkRole(){
        if(roles && roles.some((value)=>value.role === "admin")){
            return true
        }else{
            return  false
        }
    }


    function actionFunctions(){
        if(!checkRole()){
            return () => scrollToSection("#Navigation")
        }else if(location.pathname.split("/")[1] === "admin" && checkRole()){
            navigate("/general")
        }else if(location.pathname.split("/")[1] !== "admin" && checkRole()){
            navigate("/admin/doctors/create")
        }
        return () => {}
    }





    return (
        <div onClick={()=>actionFunctions()()}  className={cl.container}>
            {location.pathname.split("/")[1] !== "admin"
                &&
                checkRole()
                &&
                <svg className={cl.settingsIcon}>
                    <use xlinkHref={"/sprite.svg#SettingsIcon"}></use>
                </svg>
            }
            {location.pathname.split("/")[1] === "admin"
                &&
                checkRole()
                &&
                <svg  className={cl.settingsIcon}>
                    <use xlinkHref={"/sprite.svg#HomeIcon"}></use>
                </svg>
            }
            {!checkRole() &&
                <svg className={cl.settingsIcon}>
                    <use xlinkHref={"/sprite.svg#ChevronIcon"}></use>
                </svg>
            }
        </div>
    );
};

export default FunctionalButton;