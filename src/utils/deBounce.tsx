import React from 'react';
import ReactDOM from 'react-dom/client';
import ConfirmWindow from "../components/additionalComponents/confirmWindow";





type functionsType = ()=>void





export function deBounceWithConfirmation(deBounceFunc: functionsType){
    const rootElement = document.getElementById("root")
    if(!rootElement){
        return deBounceFunc
    }

    const container = document.createElement('div');
    rootElement.appendChild(container)

    const root = ReactDOM.createRoot(container)

    const unmountAndRemove = () => {
        root.unmount();
        container.remove()
    };

    root.render(<ConfirmWindow func={deBounceFunc} selfDestroyFunction={unmountAndRemove}/>);


}