import React, {useState} from 'react';
import cl from './modules/SoloInputModalWindow.module.css'



interface SoloInputModalWindowInterface{
    closeCallBackFunc: (e:boolean)=>void
    acceptCallBackFunc: (e:string)=>void
}


const SoloInputModalWindow = ({acceptCallBackFunc,closeCallBackFunc}: SoloInputModalWindowInterface) => {

    const [inputState, setInputState] = useState<string>()


    function acceptFunction(){
        if(inputState && inputState !== ""){
            acceptCallBackFunc(inputState ||"")
            declineFunction()
        }
    }

    function declineFunction(){
        closeCallBackFunc(false)
    }


    return (
        <div className={cl.container}>
            <div className={cl.inputContainer}>
                <input  value={inputState} onChange={(e)=>setInputState(e.target.value)} placeholder={"Enter the url on image"}/>
                <div className={cl.btnContainer}>
                    <button onClick={()=>acceptFunction()}>
                        <span className={cl.acceptIcon}></span>
                    </button>
                    <button onClick={()=>declineFunction()}>
                        <span className={cl.closeBtn}>
                            <span></span>
                            <span></span>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SoloInputModalWindow;