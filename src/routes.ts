import GeneralPage from "./components/GeneralPage/GeneralPage";
import {routesEnum} from "./types/routes.type";
import AuthPage from "./components/AuthPage/AuthPage";


export const routes = [
    {path: routesEnum.general, element: GeneralPage},
    {path: routesEnum.other, element: GeneralPage},
    {path: routesEnum.login, element: AuthPage},
    {path: routesEnum.registration, element: AuthPage},
]