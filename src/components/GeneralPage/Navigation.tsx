import React from 'react';
import cl from '../../modules/GeneralPage/Navigation.module.css'



const Navigation = () => {
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
                    <button className={cl.navigation_buttonActive}>Home</button>
                    <button className={cl.navigation_button}>News</button>
                    <button className={cl.navigation_button}>Doctors</button>
                    <button className={cl.navigation_button}>Location</button>
                </div>
                <div className={cl.AuthContainer}>
                    <button className={cl.navigation_buttonActive}>Login</button>
                    <div className={cl.slesher}></div>
                    <button className={cl.navigation__singUpBtn}>Sing Up</button>
                </div>
            </div>
        </div>
    );
};

export default Navigation;