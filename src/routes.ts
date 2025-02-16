import GeneralPage from "./components/GeneralPage/GeneralPage";
import {routesEnum} from "./types/routes.type";
import AuthPage from "./components/AuthPage/AuthPage";
import NewsPage from "./components/NewsPage/NewsPage";
import DoctorPage from "./components/DoctorPage/DoctorPage";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import AppointmentPage from "./components/AppointmentPage/AppointmentPage";




export const loginRoutes = [
    {path: routesEnum.general, element: GeneralPage},
    {path: routesEnum.other, element: GeneralPage},
    {path: routesEnum.news, element: NewsPage},
    {path: routesEnum.doctors, element: DoctorPage},
    {path: routesEnum.profilePersonalData, element: ProfilePage},
    {path: routesEnum.profileAppointmentsHistory, element: ProfilePage},
    {path: routesEnum.profileAChangePassword, element: ProfilePage},
    {path: routesEnum.appointment, element: AppointmentPage},
]


export const unLoginRoutes = [
    {path: routesEnum.general, element: GeneralPage},
    {path: routesEnum.other, element: GeneralPage},
    {path: routesEnum.login, element: AuthPage},
    {path: routesEnum.registration, element: AuthPage},
    {path: routesEnum.news, element: NewsPage},
    {path: routesEnum.doctors, element: DoctorPage},
]


export const onlyForDoctors = [
    {path: routesEnum.admin, element: AdminPanel},
]


export enum endpointsPath{
    speciality = "/speciality",
    roles = "/roles",
    services = "/services",
    news = "/news",
    doctors ="/doctors",
    appointments="/appointments",
    patients="/patients",
    diagnoses="/diagnoses",
    rating="/ratings",
    routes="/routes",
    doctorUpdateSelf="/doctors/updateSelf",
    patientUpdateSelf="/patients/updateSelf",
    ratingAmount="/ratings/get/amount",
    serviceAmount="/services/get/amount",
    patientsAmount="/patients/get/amount",
    diagnosesAmount="/diagnoses/get/amount",
    rolesAmount="/roles/get/amount",
    doctorsAmount = "/doctors/get/amount",
    newsAmount = "/news/get/amount",
    specialityAmount = "/speciality/get/amount",
    appointmentsAmount= "/appointments/get/amount",
    appointmentsBookedTime= "/appointments/get/bookedTime",
    doctorPasswordUpdate = "/doctors/updateSelf/password",
    patientPasswordUpdate = "/patients/updateSelf/password"
}