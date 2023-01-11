import { useState, useEffect, createContext } from 'react'
import { auth, db } from '../services/firebaseConnection' // auth e db são das confg do firebase da minha aplicação que eu fiz
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth' // diretamente do firebase para criar um email e senha
import { doc, getDoc, setDoc } from 'firebase/firestore' // diretametne do firebase. doc para acessar algum documento, getDoc para buscar os documentos, e o setDoc para criar os documentos ou passar dados para algum documento.

import { useNavigate } from 'react-router-dom' // hook que controla a navegação, se ela é privada ou não
import { toast } from 'react-toastify'



export const AuthContext = createContext({})

function AuthProvider({ children }) {

    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()


    useEffect(()=> { // Usando o useEffect para verificar e renderizar a tela se tiver usuário logado. Abaixo a função para verificar isto!

        async function loadUser(){ // Função para verificar se tem usuário logado

            const usuarioSalvo = localStorage.getItem('@chamados') // buscando os dados do usuário logado e jogando na variável 

            if(usuarioSalvo){
                setUser(JSON.parse(usuarioSalvo)) // Convertendo para obejto e repassando para o setUser. Jogando para o setUser, quer dizer que tem usuário logado, ou seja, o usuário consegue acessar o dashboard. O setUser que guarda os dados se tiver usuário logado ou não. Se tiver, entra e fica no dashboard, se não, fica na tela de login.
                setLoading(false)
            }
            setLoading(false)
        }
        loadUser()
    }, [])


    async function logarUsuario(email, password) { // Função para logar o usuário
        setLoadingAuth(true)

        await signInWithEmailAndPassword(auth, email, password )
        .then(async (value)=> {

            let uid = value.user.uid //Jogando o valor com o uid do usuario na variável

            const docRef = doc(db, 'usuarios', uid) // Jogando os dados do banco, mais os dados do usuário para a variável
            const docSnap = await getDoc(docRef) // Jogando todos os dados salvos nas variáveis acima nesta variável

            let data = {
                uid: uid, 
                nome: docSnap.data().nome,
                email: value.user.email,
                avatarUrl: docSnap.data().avatarUrl
            }

            setUser(data)
            salvarNoLocalStrorage(data)
            setLoadingAuth(false)
            toast.success(`Bem vindo(a) de volta, ${docSnap.data().nome}!`)
            navigate('/dashboard')
        })
        .catch((error)=> {
            console.log(error)
            setLoadingAuth(false)
            toast.error('Ops, algo deu errado!')
        })
    }   



    async function cadastrarUsuario(email, password, name) {

        setLoadingAuth(true)

        await createUserWithEmailAndPassword(auth, email, password) // craindo no banco um email e senha do usuario
        .then(async (value)=> { // se deu tudo certo, cai nesse then, aonde vc pega o valor dele e abaixo no 'let uid' joga os dados do usuário nessa variável.
            let uid = value.user.uid

            // cria um documento no banco com o nome de usuário, e cria o caminho no qual chamei de uid
            await setDoc(doc(db, 'usuarios', uid), {
                nome: name, // criando o documento com os dados do usuário, agora passamos as propriedades que queros criar para este usuário, que é o nome e o avatar (foto de perfil)
                avatarUrl: null,
            }) 
            .then(()=> {
                
                let data = { // Jogando todos os dados do usuário dentro da variável 'data' para jogar os dados dentro do setUser
                    uid: uid,
                    nome: name,
                    email: email,
                    avatarUrl: null
                }

                
                setUser(data) // quando o usuário for cadastrado, os dados dele que encontram-se em 'data', será repassado para o setUser
                toast.success(`Seja bem vindo(a) ao nosso sistema, ${name}!`)
                navigate('/dashboard') // quando o usuário logar, ele será reredicionado para o dashboard.
                setLoadingAuth(false)
                salvarNoLocalStrorage(data) // Após cadastro do usuário, os dados dele será salvo no localStorage
            })
            .catch((error)=> {
                console.log(error)
                setLoadingAuth(false)
            })
        })
    }

    function salvarNoLocalStrorage(data){ // Função para salvar os dados no localStorage

        localStorage.setItem('@chamados', JSON.stringify(data)) // criei uma chave com o nome de chamados, aonde jogo todos os dados do usuario que encontra-se em 'data' para salvar no localStorage do navegador.

    }

    async function deslogarUsuario(){ // Função para deslogar o usuário

        await signOut(auth) // o método singOut é para deslogar o usuário. Esse método é do próprio firebase.
        localStorage.removeItem('@chamados') // Removendo os dados do usuário no localStorage quando ele desloga do sistema
        setUser(null) // Deixa o setUser sem nenhum dados de usuários
        toast.success('Saindo da conta...')
    }

    // usuários: maialucas@gmail.com = senha: mangadoce, nubiaferreira@gmail.com, senha: melancia, tuliomonteiro@gmail.com, senha: leticiaeamanda, mateusmaia@gmail.com =  senha: cruzeiro

    return (
        <AuthContext.Provider value={{ login: !!user, user, logarUsuario, cadastrarUsuario, loadingAuth, loading, deslogarUsuario, salvarNoLocalStrorage, setUser, deslogarUsuario }}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;