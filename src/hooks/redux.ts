import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppDispatch, rootType} from "../store/store";
import {RootState} from "@reduxjs/toolkit/query";


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector:TypedUseSelectorHook<rootType> = useSelector;