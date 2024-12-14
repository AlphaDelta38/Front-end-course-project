import React, {useEffect} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {loginRoutes, unLoginRoutes} from "./routes";
import Navigation from "./components/GeneralPage/Navigation";
import {useAppDispatch, useAppSelector} from "./hooks/redux";
import {checkLogin} from "./store/reducers/ActionCreator";
import PopupContainer from "./components/PopupMessage/PopupContainer";
import Footer from "./components/GeneralPage/Footer";
import FunctionalButton from "./components/additionalComponents/functionalButton";

function App() {

    const data = useAppSelector(state => state.userReducer)
    const dispatch = useAppDispatch()


    useEffect(() => {
        console.log(data);

    }, [data]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token){
            dispatch(checkLogin())
        }
    }, []);

  return (
    <div className="App">
        <BrowserRouter>
            <Navigation/>
            <Routes>
                {data.id !== 0
                    ?
                    loginRoutes.map((value, index)=><Route key={index} path={value.path} element={<value.element/>} />)
                    :
                    unLoginRoutes.map((value, index)=><Route key={index} path={value.path} element={<value.element/>} />)
                }
            </Routes>
            <FunctionalButton/>
            <PopupContainer/>
            <Footer/>
        </BrowserRouter>
    </div>
  );
}

export default App;
