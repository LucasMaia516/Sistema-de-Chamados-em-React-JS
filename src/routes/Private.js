import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../contexts/auth'

export default function Private({ children }) {

    const { login, loading } = useContext(AuthContext) // Usando o 'login' da página auth para verificar se a pessoa está logada ou não

    if (loading) {
        return (
            <div></div>
        )
    }

    if (!login) {
        return <Navigate to="/" /> // Essa condição não deixa a pessoa entrar em uma página que esteja privada se não estiver logado no sistema. O !login quer dizer, se não está logado, então joga para a página '/' de login. 
    }

    return children

}