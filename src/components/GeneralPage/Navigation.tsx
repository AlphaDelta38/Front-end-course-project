import React from 'react';
import cl from '../../modules/GeneralPage/Navigation.module.css'
import {gsap} from "gsap";
import {ScrollToPlugin} from "gsap/ScrollToPlugin";
import {Link, useLocation, useNavigate, useNavigation} from "react-router-dom";
import {routesEnum} from "../../types/routes.type";
import {useAppSelector} from "../../hooks/redux";



const Navigation = () => {


    gsap.registerPlugin(ScrollToPlugin);

    const scrollToSection = (target:any) => {
        gsap.to(window, {
            duration: 1.5,
            scrollTo: { y: target, autoKill: true },
            ease: "power2.out"
        });
    };


    const {id: UserId, email} = useAppSelector(state => state.userReducer)
    const location = useLocation()
    const currentLocation = location.pathname.split("/")[1]
    const navigate = useNavigate()


    return (
        <div id="Navigation" style={currentLocation === "admin" ? {display:"none"} : {}} className={cl.container}>
            <div className={cl.container__content}>
                <div className={cl.LogoContainer}>
                    <svg className={cl.Logo__icon}>
                        <use xlinkHref={"/sprite.svg#LogoIcon"}></use>
                    </svg>
                    <h1 className={cl.Logo__text}>HEALTH REBALANCE</h1>
                </div>
                <div className={cl.navigationContainer}>
                    <Link style={{textDecoration: "none"}} to={routesEnum.general}>
                        <button className={cl.navigation_buttonActive}>Home</button>
                    </Link>
                    <Link style={{textDecoration: "none"}} to={routesEnum.general}>
                        <button onClick={() => scrollToSection("#News")} className={cl.navigation_button}>News</button>
                    </Link>
                    <Link style={{textDecoration: "none"}} to={routesEnum.doctors}>
                        <button className={cl.navigation_button}>Doctors</button>
                    </Link>
                    <Link style={{textDecoration: "none"}} to={routesEnum.general}>
                        <button onClick={() => scrollToSection("#Location")} className={cl.navigation_button}>Location
                        </button>
                    </Link>
                </div>
                {UserId === 0 &&
                    <div className={cl.AuthContainer}>
                        <Link style={{textDecoration: "none"}} to={routesEnum.login}>
                            <button className={cl.navigation_buttonActive}>Login</button>
                        </Link>
                        <div className={cl.slesher}></div>
                        <Link style={{textDecoration: "none"}} to={routesEnum.registration}>
                            <button className={cl.navigation__singUpBtn}>Sing Up</button>
                        </Link>
                    </div>
                }
                {UserId !== 0 &&
                    <div onClick={()=>navigate(routesEnum.profilePersonalData)} className={cl.profileContainer}>
                        <div className={cl.circle}>
                            <svg height={"32px"} width={"36px"} fill={"white"}>
                                <use xlinkHref={"/sprite.svg#HumanIcon"}></use>
                            </svg>
                        </div>
                        <div className={cl.email}>
                            {email}
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default Navigation;