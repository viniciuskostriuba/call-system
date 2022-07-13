import { Route, Routes } from "react-router-dom";
import RouteWrapper from "./Route"; //Aqui se encontra o código acima.
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import Settings from '../pages/Settings';
import Customizer from '../pages/Customizer';
import New from '../pages/New';

export default function AllRoutes() {
    return (

        <Routes>
            <Route path='/' element={<RouteWrapper loggedComponent={<Dashboard />} defaultComponent={<SignIn />} />} />
            <Route path='/dashboard' element={<RouteWrapper loggedComponent={<Dashboard />} defaultComponent={<SignIn />} isPrivate />} />
            <Route path='/signin' element={<RouteWrapper loggedComponent={<Dashboard />} defaultComponent={<SignIn />} />} />
            <Route path='/signup' element={<RouteWrapper loggedComponent={<Dashboard />} defaultComponent={<SignUp />} />} />
            <Route path='/settings' element={<RouteWrapper loggedComponent={<Settings />} defaultComponent={<SignUp />} isPrivate  />} />
            <Route path='/customizer' element={<RouteWrapper loggedComponent={<Customizer />} defaultComponent={<SignUp />} isPrivate  />} />
            <Route path='/new' element={<RouteWrapper loggedComponent={<New />} defaultComponent={<SignUp />} isPrivate  />} />
            <Route path='/new/:id' element={<RouteWrapper loggedComponent={<New />} defaultComponent={<SignUp />} isPrivate  />} />
        </Routes>


    )
}

