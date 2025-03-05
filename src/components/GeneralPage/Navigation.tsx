import React, {ReactEventHandler, useEffect, useState} from 'react';
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


    const [burgerMenuActive, setBurgerMenuActive] = useState<boolean>(false);
    const {id: UserId, email, image_link} = useAppSelector(state => state.userReducer)
    const location = useLocation()
    const currentLocation = location.pathname.split("/")[1]
    const navigate = useNavigate()


    useEffect(()=>{
        const html = document.querySelector("html")

        const closeWindow = () =>{
            if(window.innerWidth > 997){
                setBurgerMenuActive(false)
                if(html){
                    html.style.overflow="visible"
                }
            }
        }

        window.addEventListener("resize", closeWindow);

        if(burgerMenuActive){
            if(html){
                html.style.overflow="hidden"
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }else{
            if(html){
                html.style.overflow="visible"
            }
        }

        return ()=>{
            window.removeEventListener("resize", closeWindow)
        }
    },[burgerMenuActive])

    useEffect(()=>{
        setBurgerMenuActive(false)
    }, [location.pathname])

    return (
        <div id="Navigation" style={currentLocation === "admin" ? {display:"none"} : {}} className={cl.container}>
            <div className={cl.container__content}>
                <div className={cl.LogoContainer}>
                    <Link to={routesEnum.general}>
                        <svg className={cl.Logo__icon}>
                            <use xlinkHref={"/sprite.svg#LogoIcon"}></use>
                        </svg>
                    </Link>
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
                            {image_link ?
                                <img className={cl.mobileProfileImg} src={image_link} alt={""}/>
                                :
                                <svg height={"32px"} width={"36px"} fill={"white"}>
                                    <use xlinkHref={"/sprite.svg#HumanIcon"}></use>
                                </svg>
                            }
                        </div>
                        <div className={cl.email}>
                            {email}
                        </div>
                    </div>
                }
                <div onClick={() => setBurgerMenuActive(!burgerMenuActive)} className={cl.burgerBtn}>
                    <button className={cl.burgerButton}>
                        <span className={`${cl.burgerButtonContainer} ${burgerMenuActive !== null && (burgerMenuActive ? cl.BurgerActive : cl.Burgerdefault)}`}>
                            <span className={`${cl.middleLine} ${burgerMenuActive !== null && (burgerMenuActive ? cl.middleLineActive : cl.middleLineDefault)}`}></span>
                        </span>
                    </button>
                </div>
            </div>
            <div style={burgerMenuActive ? {transform: "translateX(0)", opacity: 1} : {pointerEvents: "none"}} className={cl.mobileNavigationBarContainer}>
                <div className={cl.mobileLoginContainer}>
                    <div className={cl.mobileLogin} style={UserId !== 0 ? {flexDirection: "column"}: {}}>
                        <Link to={routesEnum.profilePersonalData}>
                            <div className={cl.mobileCircle}>
                                {image_link ?
                                    <img className={cl.mobileProfileImg} src={image_link} alt={""}/>
                                        :
                                    <svg height={"48px"} width={"52px"} fill={"white"}>
                                        <use xlinkHref={"/sprite.svg#HumanIcon"}></use>
                                    </svg>
                                }
                            </div>
                        </Link>
                        <Link style={{textDecoration: "none", color: "inherit"}} to={routesEnum.profilePersonalData}>
                        <p>{email ?? ""}</p>
                        </Link>
                        <div style={UserId !== 0 ? {display:"none"} : {}} className={cl.mobileAuthContainer}>
                            <Link style={{textDecoration: "none"}} to={routesEnum.login}>
                                <button className={cl.mobileLogin__btn}>Login</button>
                            </Link>
                            <Link style={{textDecoration: "none"}} to={routesEnum.registration}>
                                <button className={cl.mobileRegister__btn}>Sing Up</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={cl.mobileNavigationBar}>
                    <Link style={{textDecoration: "none"}} to={routesEnum.general}>
                        <button className={cl.mobileNavigation__btnHome}>
                            Home
                        </button>
                    </Link>
                    <Link style={{textDecoration: "none"}} to={routesEnum.general}>
                        <button onClick={() => {
                            scrollToSection("#News")
                            setBurgerMenuActive(false)
                        }} className={cl.mobileNavigation__btn}>
                            News
                        </button>
                    </Link>
                    <Link style={{textDecoration: "none"}} to={routesEnum.doctors}>
                        <button className={cl.mobileNavigation__btn}>
                            Doctor
                        </button>
                    </Link>
                    <Link  style={{textDecoration: "none"}} to={routesEnum.general}>
                        <button onClick={() => {
                            scrollToSection("#Location")
                            setBurgerMenuActive(false)
                        }} className={cl.mobileNavigation__btn}>
                            Location
                        </button>
                    </Link>
                </div>
                <div className={cl.socialMediaContainer}>
                    <svg className={cl.iconHover} width={"100%"} height={"100%"}>
                        <use xlinkHref={"/sprite.svg#FaceBookIcon"}></use>
                    </svg>
                    <svg className={cl.iconHover} width={"100%"} height={"100%"}>
                        <use xlinkHref={"/sprite.svg#InstagramIcon"}></use>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Navigation;