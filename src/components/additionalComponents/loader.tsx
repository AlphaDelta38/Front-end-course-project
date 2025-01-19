import React from 'react';
import cl from './modules/Loader.module.css'




interface LoaderInterface{
    isLoading: boolean
    isChildElement: boolean
}


const Loader = ({isLoading, isChildElement}: LoaderInterface ) => {
    return (
        <div style={isLoading ? {display:"flex", position: isChildElement ? "absolute" : "fixed" } : {}} className={cl.container}>
            <div className={cl.loaderContainer}>
                <div className={cl.loaderItem}></div>
                <div className={cl.loaderItem}></div>
                <div className={cl.loaderItem}></div>
                <div className={cl.loaderItem}></div>
                <div className={cl.loaderItem}></div>
                <div className={cl.loaderItem}></div>
                <div className={cl.loaderItem}></div>
                <div className={cl.loaderItem}></div>
                <div className={cl.loaderItem}></div>
            </div>
        </div>
    );
};

export default Loader;