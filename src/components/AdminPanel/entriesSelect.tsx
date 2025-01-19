import React, {CSSProperties} from 'react';
import cl from '../../modules/AdminPanel/entriesSelect.module.css'

interface  EntriesSelectInterface{
    textBeforeSelect?: string,
    textAfterSelect?: string
    options: string[]
    setState: (e: string)=>void
    style?: CSSProperties
}





const EntriesSelect = ({textBeforeSelect,textAfterSelect, options, setState, style}: EntriesSelectInterface) => {
    return (
        <div style={style} className={cl.chooseAmountContainer}>
            {textBeforeSelect}
            <select onChange={(e) => setState(e.target.value)} className={cl.chooseAmountSelect}>
                {options.map((value,index)=><option key={index}>{value}</option>)}
            </select>
            {textAfterSelect}
        </div>
    );
};

export default EntriesSelect;