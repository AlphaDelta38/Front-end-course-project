import React, {useEffect, useState} from 'react';
import cl from '../../modules/AuthPage/AuthPage.module.css'
import {Link, useLocation} from "react-router-dom";
import {routesEnum} from "../../types/routes.type";









const AuthPage = () => {


    const location = useLocation();
    const currentLocation = location.pathname.split("/")[2] === "login";
    const [finalStageOfRegistration, setFinalStageOfRegistration] = useState(false);

    useEffect(() => {
        setFinalStageOfRegistration(false)
    }, [location.pathname]);

    return (
        <div className={cl.container}>
            <div className={cl.content}>
                <div className={cl.loginFormContainer}>
                    <h1 className={cl.aboutForm}>{currentLocation ? "LOGIN" : "SIGN UP"}</h1>
                    {currentLocation ?
                        <div className={cl.fieldsContainer}>
                            <div className={cl.containerForSvgWithField}>
                                <svg style={{marginLeft:"28px", marginTop:"28px"}} width={"26px"} height={"16px"} className={cl.formIcons}>
                                    <use xlinkHref={"/sprite.svg#EmailFormIcon"}></use>
                                </svg>
                                <input type={"text"} className={cl.field} placeholder={"Email"}/>
                            </div>
                            <div className={cl.containerForSvgWithField}>
                                <svg style={{marginLeft:"30px", marginTop:"20px"}} width={"24px"} height={"28px"} className={cl.formIcons}>
                                    <use xlinkHref={"/sprite.svg#LockFormIcon"}></use>
                                </svg>
                                <input type={"text"} className={cl.field} placeholder={"Password"}/>
                            </div>
                        </div>
                        :
                        !finalStageOfRegistration ?
                            <div className={cl.fieldsContainer}>
                                <div className={cl.containerForSvgWithField}>
                                    <svg style={{marginLeft: "32px", marginTop: "24px"}} width={"24px"} height={"20px"}
                                         className={cl.formIcons}>
                                        <use xlinkHref={"/sprite.svg#HumanFormIcon"}></use>
                                    </svg>
                                    <input type={"text"} className={cl.field} placeholder={"Full name"}/>
                                </div>
                                <div className={cl.containerForSvgWithField}>
                                    <svg style={{marginLeft: "34px", marginTop: "20px"}} width={"24px"} height={"24px"}
                                         className={cl.formIcons}>
                                        <use xlinkHref={"/sprite.svg#PhoneFormIcon"}></use>
                                    </svg>
                                    <input type={"text"} className={cl.field} placeholder={"Phone"}/>
                                </div>
                                <div className={cl.containerForSvgWithField}>
                                    <svg style={{marginLeft: "32px", marginTop: "20px"}} width={"26px"} height={"26px"}
                                         className={cl.formIcons}>
                                        <use xlinkHref={"/sprite.svg#AddressFormIcon"}></use>
                                    </svg>
                                    <input type={"text"} className={cl.field} placeholder={"Address"}/>
                                </div>
                                <div className={cl.containerForSvgWithField}>
                                    <svg style={{marginLeft: "32px", marginTop: "20px"}} width={"26px"} height={"26px"}
                                         className={cl.formIcons}>
                                        <use xlinkHref={"/sprite.svg#DateFormIcon"}></use>
                                    </svg>
                                    <input type={"text"} className={cl.field} placeholder={"Date of birth"}/>
                                </div>
                            </div>
                            :
                            <div className={cl.fieldsContainer}>
                                <div className={cl.containerForSvgWithField}>
                                    <svg style={{marginLeft: "28px", marginTop: "28px"}} width={"26px"} height={"16px"}
                                         className={cl.formIcons}>
                                        <use xlinkHref={"/sprite.svg#EmailFormIcon"}></use>
                                    </svg>
                                    <input type={"text"} className={cl.field} placeholder={"Email"}/>
                                </div>
                                <div className={cl.containerForSvgWithField}>
                                    <svg style={{marginLeft: "30px", marginTop: "18px"}} width={"24px"} height={"28px"}
                                         className={cl.formIcons}>
                                        <use xlinkHref={"/sprite.svg#LockFormIcon"}></use>
                                    </svg>
                                    <input type={"text"} className={cl.field} placeholder={"Password"}/>
                                </div>
                                <div className={cl.containerForSvgWithField}>
                                    <svg style={{marginLeft: "30px", marginTop: "18px", opacity: "0.7"}} width={"24px"} height={"28px"}
                                         className={cl.formIcons}>
                                        <use xlinkHref={"/sprite.svg#LockFormIcon"}></use>
                                    </svg>
                                    <input type={"text"} className={cl.field} placeholder={"Check password"}/>
                                </div>
                            </div>
                    }
                    <div style={currentLocation ? {} : {justifyContent: "end"}} className={cl.additionalFunction}>
                        <label style={currentLocation ? {} : {display: "none"}} className={cl.labelForCheckbox}>
                            <input type="checkbox" className={cl.checkBox}/>
                            I'm a doctor
                        </label>
                        <div>
                            <Link
                                style={{textDecoration: "1px underline solid #0D329096", color: "#0D329096"}}
                                to={currentLocation ? routesEnum.registration : routesEnum.login}
                            >
                                {currentLocation ? "Registration" : "Login"}
                            </Link>
                        </div>
                    </div>
                    <button style={!finalStageOfRegistration ? {display: "none"} : {}} onClick={() => {
                        if (finalStageOfRegistration) {
                            setFinalStageOfRegistration(false)
                        }
                    }} className={cl.form__button}>
                        Back
                    </button>
                    <button onClick={() => {
                        if (!finalStageOfRegistration) {
                            setFinalStageOfRegistration(true)
                        }
                    }} className={cl.form__button}>
                        {currentLocation ? "Login" : !finalStageOfRegistration ? "Next" : "Sign up"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;