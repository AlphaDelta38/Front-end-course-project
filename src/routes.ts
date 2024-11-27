import GeneralPage from "./components/GeneralPage/GeneralPage";
import {routesEnum} from "./types/routes.type";


export const routes = [
    {path: routesEnum.general, element: GeneralPage},
    {path: routesEnum.other, element: GeneralPage}
]