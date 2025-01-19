import React, {CSSProperties} from 'react';
import cl from "../../modules/AdminPanel/PaginationBar.module.css";


interface PaginationBarInterface{
    nextPageFunc: () => void;
    previousPageFunc: () => void;
    setPageFunc: (page: number) => void;
    currentPage: number
    amount: number,
    limit: number,
    style?: CSSProperties
}



const PaginationBar = ({nextPageFunc,previousPageFunc, setPageFunc, currentPage, limit, amount, style}:PaginationBarInterface) => {


    function changePage(page: number){
        setPageFunc(page)
    }


    return (
        <div className={cl.paginationButtonsContainer}>
            <ul style={style} className={cl.paginationPanel}>
                <li>
                    <a onClick={() => previousPageFunc()}
                       className={currentPage === 1 ? cl.disabled : cl.none}>Previous</a>
                </li>
                {Array.from({length: Math.ceil(amount / limit)}).map((value, index) =>
                    <li onClick={() =>changePage(index+1)} key={index}>
                        <a style={currentPage=== index + 1 ? {
                            backgroundColor: "#3f6ad8",
                            borderColor: "#007bff",
                            color: "white"
                        } : {}}>{index + 1}</a>
                    </li>
                )}
                <li>
                    <a
                        onClick={() => nextPageFunc()}
                        className={currentPage === Math.ceil(amount / limit) ? cl.disabled : cl.none}
                    >
                        Next
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default PaginationBar;