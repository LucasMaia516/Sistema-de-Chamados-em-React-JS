import "./Header.css"
import avatarImg from '../assets/avatar.png'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../contexts/auth'
import { FcSettings, FcManager, FcCustomerSupport, FcPlus, FcHome } from "react-icons/fc";



export default function Header() {

    const { user } = useContext(AuthContext)

    return (
        <div className="sidebar">
            <div>
                <img src={user.avatarUrl === null ? avatarImg : user.avatarUrl} alt="Foto do usuário" />
            </div>
            <Link to="/dashboard">
                <FcHome size={25} /> Chamados
            </Link>


            <Link to="/clientes">
                <FcManager size={25} /> Clientes
            </Link>

            <Link to="/perfil">
                <FcSettings size={25} />Configurações do perfil
            </Link>
        </div>
    )

}