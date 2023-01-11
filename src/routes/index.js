import { Route, Routes } from 'react-router-dom'

import TelaDeLogin from '../pages/TelaDeLogin'
import TelaDeCadastro from "../pages/TelaDeCadastro"
import Dashboard from '../pages/Dashboard'
import Perfil from '../pages/Perfil'
import Clientes from '../pages/Clientes'
import NovoChamado from '../pages/NovoChamado'


import Private from './Private'

export default function RoutesApp() {

    return (
        <Routes>
            <Route path='/' element={<TelaDeLogin />} />
            <Route path='/teladecadastro' element={<TelaDeCadastro />} />
            <Route path='/dashboard' element={<Private><Dashboard /></Private>} />
            <Route path='/perfil' element={<Private><Perfil /></Private>} />
            <Route path='/clientes' element={ <Private> <Clientes/> </Private> }/>
            <Route path='/novochamado' element={<Private><NovoChamado/></Private>}/>
            <Route path='/novochamado/:id' element={<Private><NovoChamado/></Private>}/>

            
        </Routes>
    )

}