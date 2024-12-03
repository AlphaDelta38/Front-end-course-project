import React, {useEffect, useRef, useState} from 'react';
import cl from '../../modules/AuthPage/AuthPage.module.css'
import {Link, useLocation} from "react-router-dom";
import {routesEnum} from "../../types/routes.type";
import * as yup from "yup";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {registerForm, typeOfState} from "../../types/forms.type";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {UserLogin, UserRegister} from "../../store/reducers/ActionCreator";






const validationYupSchemaRegister = yup.object().shape({
    fullName: yup.string().required("Full Name is required").matches(/^[a-zA-Zа-яА-Я]+\s[a-zA-Zа-яА-Я]+$/),
    phone: yup.string().transform(value => value.replace(/\s+/g, '')).required("Phone number is  required").matches(/^380\d{9}$/, 'Phone number must start with 380 and contain 12 digits in total'),
    address: yup.string().required("Address is required"),
    date: yup.string().required("Date is required"),
    email: yup.string().required("Email is required").email("email is not correct"),
    password: yup.string().required("Password is required").min(6),
    checkPassword: yup.string().oneOf([yup.ref("password")], "Password must be match").required("need to match passwords"),
})

const validationYupSchemaLogin = yup.object().shape({
    email: yup.string().required("Email is required").email("email is not correct"),
    password: yup.string().required("Password is required").min(6),
})





const AuthPage = () => {

    const location = useLocation();
    const currentLocation = location.pathname.split("/")[2] === "login";
    const [finalStageOfRegistration, setFinalStageOfRegistration] = useState(false);
    const [dataState, setDataState] = useState<registerForm>({})
    const [errorsState, setErrorsState] = useState<Array<any>>([])

    const dispatch = useAppDispatch()

    const [isChecked, setIsChecked] = useState(false);

    const {
        register,
        formState: {errors},
        watch,
        getValues,
        trigger,
        setValue,
        reset
    } = useForm({
        resolver: yupResolver(validationYupSchemaRegister),
        mode: "onSubmit",
    })

    const {
        register: loginRegister,
        formState: {errors: loginErrors},
        watch: loginWatch,
        getValues: loginGetValues,
        trigger: loginTrigger,
        setValue: loginSetValue,
        reset: loginReset
    } = useForm({
        resolver: yupResolver(validationYupSchemaLogin),
        mode: "onSubmit",
    })




    const onSubmit  = async (type: typeOfState):Promise<void> =>{
        if(type === "register"){
            setDataState({...dataState, email: getValues().email, password: getValues().password, checkPassword: getValues().checkPassword})
            if(await setsValues({...dataState, email: getValues().email, password: getValues().password, checkPassword: getValues().checkPassword})){
                const date = new Date(getValues().date);
                const formattedDate = date.toISOString().split('T')[0]
                dispatch(UserRegister({...getValues(), date: formattedDate}))
            }
        }else if(type === "login"){
            const isValid = await loginTrigger();
            if(isValid){
                const email = loginGetValues().email
                const password = loginGetValues().password
                dispatch(UserLogin({email,password, isPatient: !isChecked}))
            }
        }
    }

    async function setsValues(data: registerForm){
        setValue('email', data.email || "");
        setValue('password', data.password || "");
        setValue('checkPassword', data.checkPassword || "");
        setValue('fullName', data.fullName || "");
        setValue('phone', data.phone || "");
        setValue('address', dataState.address || "");
        setValue('date', data.date || "");

        const isValid = await trigger();
        return isValid;

    }


    useEffect(() => {
        if(!currentLocation){
            if(finalStageOfRegistration){
                setDataState({ ...dataState, fullName: getValues().fullName, phone: getValues().phone, address: getValues().address, date: getValues().date });
                setValue('email', dataState.email || "");
                setValue('password', dataState.password || "");
                setValue('checkPassword', dataState.checkPassword || "");

            }
            if(!finalStageOfRegistration){
                setDataState({...dataState, email: getValues().email, password: getValues().password, checkPassword: getValues().checkPassword})
                setValue('fullName', dataState.fullName || "");
                setValue('phone', dataState.phone || "");
                setValue('address', dataState.address || "");
                setValue('date', dataState.date || "");

            }
            reset()
        }
    }, [finalStageOfRegistration]);


    useEffect(() => {
        setFinalStageOfRegistration(false)
        setDataState({})
        setErrorsState([])
        setsValues({})
    }, [location.pathname]);


    useEffect(()=>{
        if(Object.entries(dataState).length > 0){
            setErrorsState(Object.entries(errors))
        }

    }, [errors])







    return (
        <div  className={cl.container}>
            <div className={cl.content}>
                <div className={cl.loginFormContainer}>
                    <h1 className={cl.aboutForm}>{currentLocation ? "LOGIN" : "SIGN UP"}</h1>
                    {currentLocation ?
                        <div className={cl.fieldsContainer}>
                            <div className={cl.containerForSvgWithField}>
                                <svg style={{marginLeft:"28px", marginTop:"28px"}}  width={"26px"} height={"16px"} className={cl.formIcons}>
                                    <use xlinkHref={"/sprite.svg#EmailFormIcon"}></use>
                                </svg>
                                <input {...loginRegister('email')} type={"text"} className={cl.field} placeholder={"Email"}/>
                            </div>
                            <div className={cl.containerForSvgWithField}>
                                <svg style={{marginLeft:"30px", marginTop:"20px"}} width={"24px"} height={"28px"} className={cl.formIcons}>
                                    <use xlinkHref={"/sprite.svg#LockFormIcon"}></use>
                                </svg>
                                <input {...loginRegister('password')}  type={"text"} className={cl.field} placeholder={"Password"}/>
                            </div>
                            <div className={cl.loginErrContainer}>
                                {loginErrors && Object.entries(loginErrors).map((value,index)=>
                                    <small key={index}>{`${value[0]}:`}<span>{value[1]?.message}</span></small>
                                )}
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
                                    <input {...register('fullName')}  type={"text"} className={cl.field} placeholder={"Full name"}/>
                                </div>
                                <div className={cl.containerForSvgWithField}>
                                    <svg style={{marginLeft: "34px", marginTop: "20px"}} width={"24px"} height={"24px"}
                                         className={cl.formIcons}>
                                        <use xlinkHref={"/sprite.svg#PhoneFormIcon"}></use>
                                    </svg>
                                    <input {...register('phone')}  type={"number"} className={cl.field} placeholder={"Phone"}/>
                                </div>
                                <div className={cl.containerForSvgWithField}>
                                    <svg style={{marginLeft: "32px", marginTop: "20px"}} width={"26px"} height={"26px"}
                                         className={cl.formIcons}>
                                        <use xlinkHref={"/sprite.svg#AddressFormIcon"}></use>
                                    </svg>
                                    <input {...register('address')} type={"text"} className={cl.field} placeholder={"Address"}/>
                                </div>
                                <div className={cl.containerForSvgWithField}>
                                    <svg style={{marginLeft: "32px", marginTop: "20px"}} width={"26px"} height={"26px"}
                                         className={cl.formIcons}>
                                        <use xlinkHref={"/sprite.svg#DateFormIcon"}></use>
                                    </svg>
                                    <input {...register('date')} style={{paddingRight:"24px"}} type={"date"} className={cl.field} placeholder={"Date of birth"}/>
                                </div>
                            </div>
                            :
                            <div className={cl.fieldsContainer}>
                                <div className={cl.containerForSvgWithField}>
                                    <svg style={{marginLeft: "28px", marginTop: "28px"}} width={"26px"} height={"16px"}
                                         className={cl.formIcons}>
                                        <use xlinkHref={"/sprite.svg#EmailFormIcon"}></use>
                                    </svg>
                                    <input {...register('email')} type={"text"} className={cl.field} placeholder={"Email"}/>
                                </div>
                                <div className={cl.containerForSvgWithField}>
                                    <svg style={{marginLeft: "30px", marginTop: "18px"}} width={"24px"} height={"28px"}
                                         className={cl.formIcons}>
                                        <use xlinkHref={"/sprite.svg#LockFormIcon"}></use>
                                    </svg>
                                    <input {...register('password')} type={"text"} className={cl.field} placeholder={"Password"}/>
                                </div>
                                <div className={cl.containerForSvgWithField}>
                                    <svg style={{marginLeft: "30px", marginTop: "18px", opacity: "0.7"}} width={"24px"} height={"28px"}
                                         className={cl.formIcons}>
                                        <use xlinkHref={"/sprite.svg#LockFormIcon"}></use>
                                    </svg>
                                    <input {...register('checkPassword')} type={"text"} className={cl.field} placeholder={"Check password"}/>
                                </div>
                            </div>
                    }
                    <div style={currentLocation ? {} : {justifyContent: "end"}} className={cl.additionalFunction}>
                        <label style={currentLocation ? {} : {display: "none"}} className={cl.labelForCheckbox}>
                            <input type="checkbox" checked={isChecked} onChange={(e)=>setIsChecked(e.target.checked)} className={cl.checkBox}/>
                            I'm a doctor
                        </label>
                        <div  style={!currentLocation ? {} : {display:"none"}} className={cl.errorsContainer}>
                            {errorsState.map((value,index)=> <small key={index}>{`${value[0]}:`}<span>{value[1]?.message}</span></small>)}
                        </div>
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
                    <button type={"button"} onClick={() => {
                        if (!finalStageOfRegistration && !currentLocation) {
                            setFinalStageOfRegistration(true)
                        }
                        if(finalStageOfRegistration && !currentLocation ){
                            onSubmit(typeOfState.register)
                        }
                        if(currentLocation){
                            onSubmit(typeOfState.login)
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