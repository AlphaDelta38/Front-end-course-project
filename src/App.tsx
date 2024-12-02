import React, {useEffect} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import GeneralPage from "./components/GeneralPage/GeneralPage";
import {routes} from "./routes";
import Navigation from "./components/GeneralPage/Navigation";
import {useAppDispatch, useAppSelector} from "./hooks/redux";
import {checkLogin} from "./store/reducers/ActionCreator";

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
                {routes.map((value, index)=><Route key={index} path={value.path} element={<value.element/>} />)}
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
