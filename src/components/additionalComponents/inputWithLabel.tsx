import React, {CSSProperties, forwardRef, InputHTMLAttributes, ReactHTMLElement, Ref} from 'react';
import cl from './modules/InputWithLabel.module.css'






interface propsInterface extends InputHTMLAttributes<HTMLInputElement>{
    styles?: CSSProperties;
    labelName: string
}


const InputWithLabel = forwardRef((e:propsInterface, ref: Ref<HTMLInputElement>) => {
        return (
            <div className={cl.container}>
                <label>{e.labelName}</label>
                <input ref={ref} style={e.styles} {...e}/>
            </div>
        );
    }
)

export default InputWithLabel;