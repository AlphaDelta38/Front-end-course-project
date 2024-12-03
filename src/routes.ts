import GeneralPage from "./components/GeneralPage/GeneralPage";
import {routesEnum} from "./types/routes.type";
import AuthPage from "./components/AuthPage/AuthPage";
import NewsPage from "./components/NewsPage/NewsPage";


export const routes = [
    {path: routesEnum.general, element: GeneralPage},
    {path: routesEnum.other, element: GeneralPage},
    {path: routesEnum.login, element: AuthPage},
    {path: routesEnum.registration, element: AuthPage},
    {path: routesEnum.news, element: NewsPage},
]