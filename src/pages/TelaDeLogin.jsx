import './TelaDeLogin.css'
import logo from '../assets/logo.png'
import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/auth'


export default function TelaDeLogin() {

    const { logarUsuario, loadingAuth } = useContext(AuthContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    

    async function logarNoSistema(e){
        e.preventDefault()

        if (email !== '' && password !== '') {
           await logarUsuario(email, password)

            setEmail('')
            setPassword('')
        }
    }

    return (
        <div className='container-center'>
            <div className='login'>

                <div className='login-area'>
                    <img src={logo} alt="Logo do sistema de chamados" />
                </div>

                <form onSubmit={logarNoSistema}>

                    <h1>Entrar</h1>

                    <input type="text" placeholder='Digite o seu e-mail' value={email} onChange={(e) => setEmail(e.target.value)} />

                    <input type="password" placeholder='Digite a sua senha' value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button type='submit'>{loadingAuth ? 'Carregando...' : 'Acessar a sua conta'}</button>

                </form>

                <Link to="/teladecadastro">Criar uma nova conta</Link>

            </div>

        </div>
    )


}