import GeneralPage from "./components/GeneralPage/GeneralPage";
import {routesEnum} from "./types/routes.type";
import AuthPage from "./components/AuthPage/AuthPage";
import NewsPage from "./components/NewsPage/NewsPage";
import DoctorPage from "./components/DoctorPage/DoctorPage";
import AdminPanel from "./components/AdminPanel/AdminPanel";




export const loginRoutes = [
    {path: routesEnum.general, element: GeneralPage},
    {path: routesEnum.other, element: GeneralPage},
    {path: routesEnum.news, element: NewsPage},
    {path: routesEnum.doctors, element: DoctorPage},
    {path: routesEnum.admin, element: AdminPanel},
]


export const unLoginRoutes = [
    {path: routesEnum.general, element: GeneralPage},
    {path: routesEnum.other, element: GeneralPage},
    {path: routesEnum.login, element: AuthPage},
    {path: routesEnum.registration, element: AuthPage},
    {path: routesEnum.news, element: NewsPage},
    {path: routesEnum.doctors, element: DoctorPage},
]



export enum endpointsPath{
    speciality = "/speciality",
    roles = "/roles",
    services = "/services",
    news = "/news",
    doctors ="/doctors",
    doctorsAmount = "/doctors/get/amount",
    newsAmount = "/news/get/amount",
    appointments="/appointments",
}