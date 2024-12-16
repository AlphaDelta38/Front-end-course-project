import React from 'react';
import cl from '../../modules/GeneralPage/Footer.module.css'
import {useLocation} from "react-router-dom";





const Footer = () => {

    const location = useLocation()
    const currentLocation = location.pathname.split("/")[1]


    return (
        <div style={currentLocation === "admin" ? {display:"none"} : {}} className={cl.container}>
            <div className={cl.content}>
                <div className={cl.mainInfo}>
                    <div className={cl.firstSection}>
                        <p>Phone: +380 12 345 6789</p>
                        <p>Email: @healthrebalance.com</p>
                        <div className={cl.WorkingHours}>
                            <p>Working Hours:</p>
                            <small>Mon–Fri: 9:00 AM – 6:00 PM</small>
                            <small>Sat–Sun: Closed</small>
                        </div>
                    </div>
                    <div className={cl.secondSection}>
                        <div className={cl.locationContainer}>
                            <svg style={{marginRight: "10px"}} width={"28px"} height={"34px"}>
                                <use xlinkHref={"/sprite.svg#LocationIconWhite"}></use>
                            </svg>
                            Kharkiv, Molochna Street 48, Building 2
                        </div>
                        <div className={cl.socialContainer}>
                            <div className={cl.FolowUs}>
                                <p>Follow us:</p>
                                <small>Facebook</small>
                                <small>Instagram</small>
                            </div>
                            <div className={cl.SocialIcon}>
                                <svg  className={cl.iconHover}  width={"36px"} height={"52px"}>
                                    <use xlinkHref={"/sprite.svg#facebookIcon"}></use>
                                </svg>
                                <svg  className={cl.iconHover}  width={"54px"} height={"56px"}>
                                    <use xlinkHref={"/sprite.svg#instagramIcon"}></use>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cl.underInfo}>
                    <h2>This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service
                        apply.</h2>
                    <small>© 2024 Health Rebalance. All rights reserved.</small>
                </div>
            </div>

        </div>
    );
};

export default Footer;