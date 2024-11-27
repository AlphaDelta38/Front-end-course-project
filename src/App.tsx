import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import GeneralPage from "./components/GeneralPage/GeneralPage";
import {routes} from "./routes";
import Navigation from "./components/GeneralPage/Navigation";

function App() {
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
