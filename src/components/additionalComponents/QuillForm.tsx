import React, {CSSProperties, useState} from 'react';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import './modules/QuillFormCustomStyle.css'

interface QuillFormInterface{
    style?: CSSProperties
    toolbarActive: boolean
    readonly: boolean
    value: string
    setValue?: (val: string) => void;
}


const QuillForm = ({style, readonly, toolbarActive, value, setValue}:QuillFormInterface) => {


    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            [{ align: [] }],
            [{ color: [] }, { background: [] }],
            ['clean'],
        ],
    };



    if(!toolbarActive){
        const element = document.getElementsByClassName("ql-toolbar ql-snow");
        if(element[0] instanceof HTMLElement){
            element[0].style.display = "none";
        }
    }


    return (
        <div style={{width:"100%", ...style}}>
            <ReactQuill placeholder={"Enter the description"} readOnly={readonly}  modules={toolbarActive ? modules : {toolbar:[]}}  value={value} onChange={setValue}/>
        </div>
    );
};


export default QuillForm;