import React from 'react';
import cl from '../../modules/GeneralPage/Navigation.module.css'
import {gsap} from "gsap";
import {ScrollToPlugin} from "gsap/ScrollToPlugin";
import {Link} from "react-router-dom";
import {routes} from "../../routes";
import {routesEnum} from "../../types/routes.type";



const Navigation = () => {


    gsap.registerPlugin(ScrollToPlugin);

    const scrollToSection = (target:any) => {
        gsap.to(window, {
            duration: 2,
            scrollTo: { y: target, autoKill: true },
            ease: "power2.out"
        });
    };


    return (
        <div className={cl.container}>
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
                    <button onClick={() => scrollToSection("#News")} className={cl.navigation_button}>News</button>
                    <button className={cl.navigation_button}>Doctors</button>
                    <button onClick={()=>scrollToSection("#Location")} className={cl.navigation_button}>Location</button>
                </div>
                <div className={cl.AuthContainer}>
                    <Link style={{textDecoration: "none"}} to={routesEnum.login}>
                        <button className={cl.navigation_buttonActive}>Login</button>
                    </Link>
                    <div className={cl.slesher}></div>
                    <Link style={{textDecoration: "none"}} to={routesEnum.registration}>
                        <button className={cl.navigation__singUpBtn}>Sing Up</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Navigation;