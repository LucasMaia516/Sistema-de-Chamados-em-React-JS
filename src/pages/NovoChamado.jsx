import './NovoChamado.css'

import Header from './Header'
import Title from './Title'
import { FcPlus } from "react-icons/fc";
import { useState, useEffect, useContext } from 'react';
import { db } from '../services/firebaseConnection'
import { getDocs, collection, getDoc, doc, addDoc, limit, orderBy, updateDoc } from 'firebase/firestore'
import { useParams, useNavigate } from 'react-router-dom'

import { AuthContext } from '../contexts/auth'
import { toast } from 'react-toastify'

const listRef = collection(db, "clientes")


export default function NovoChamado() {

    const { user } = useContext(AuthContext)
    const { id } = useParams()
    const navigate = useNavigate() // Para negar o usuário para alguma página após realizar algum procedimento


    useEffect(() => {

        async function loadingClientes() {


            const dadosBanco = await getDocs(listRef)

                .then((snapshot) => {


                    let listaClientes = []

                    snapshot.forEach((doc) => {
                        listaClientes.push({
                            id: doc.id,
                            nomeFantasia: doc.data().nomeFantasia
                        })
                        console.log(listaClientes)
                    })

                    if (listaClientes === null) {
                        console.log('Nenhuma empresa encontrada')
                        setClientes([{ id: '1', nomeFantasia: 'Freela' }])
                        setLoadClientes(false)
                        return;
                    }
                    setClientes(listaClientes)
                    setLoadClientes(false)

                    if (id) {
                        loadID(listaClientes) // Se for para editar algum chamado, ele chama esse loadID
                    }


                })
                .catch((error) => {
                    console.log(error)
                    setLoadClientes(false)
                    setClientes([{ id: '1', nomeFantasia: 'Freela' }])
                })

        }
        loadingClientes()

    }, [id])

    async function loadID(listaClientes) { // Função para carregar e trazer os chamados na lista de editar

        const docRef = doc(db, 'chamados', id)
        await getDoc(docRef)
            .then((snapshot) => {
                setAssunto(snapshot.data().assunto)
                setStatus(snapshot.data().status)
                setComplemento(snapshot.data().complemento)

                let index = listaClientes.findIndex(item => item.id === snapshot.data().clienteId) // Filtrando todos os clientes na listaClientes (aonde recebe todos os clientes). Comparando se, o item que vc recebeu, se estiver, seleciona ele.
                setClienteSelecionado(index)
                setIdCliente(true) // Depois de passar por toda verificação de, listar os chamados, ai verifica se tem algum cliente selecionado na aba de editar chamados. Se tiver, ele vai para true, ou seja, vc está na tela para editar algum chamado
            })
            .catch((error) => {
                console.log(error)
                setIdCliente(false) // Não buscou nada para editar
            })

    }

    const [clientes, setClientes] = useState([])
    const [loadClientes, setLoadClientes] = useState(true)
    const [clienteSelecionado, setClienteSelecionado] = useState(0)

    const [complemento, setComplemento] = useState('')
    const [assunto, setAssunto] = useState('Suporte')
    const [status, setStatus] = useState('Aberto')
    const [idCliente, setIdCliente] = useState(false)


    function trocarStatus(e) {
        setStatus(e.target.value)
        console.log(e.target.value)
    }

    function trocarAssunto(e) {
        setAssunto(e.target.value)
        console.log(e.target.value)
    }

    function trocarClienteSelecionado(e) {
        setClienteSelecionado(e.target.value)
        console.log(clientes[e.target.value].nomeFantasia)
    }

    async function CadastrarChamado(e) {
        e.preventDefault()

        if(idCliente){ // Se tiver algum cliente com id marcado, essa condição vai editar o chamado. Aproveitando a função de registrar o chamado, para atualizar (editar) o chamado.
            
            const docRef = doc(db, 'chamados', id)

            await updateDoc(docRef, {

                cliente: clientes[clienteSelecionado].nomeFantasia,
                clienteId: clientes[clienteSelecionado].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                idUsuario: user.uid
            })
            .then(()=> {
                toast.success('Chamado editado com sucesso!')
                navigate('/dashboard')
            })
            .catch((error)=> {
                toast.error('Erro ao editar o chamado!')
                console.log(error)
            })
            return;
        }

        await addDoc(collection(db, "chamados"), { // Registrando um chamado. addDoc é para adicionar um documento na coleção "chamados" no banco firestore. Abaixo as propriedades que queremos adicionar
            criadoEm: new Date(),
            cliente: clientes[clienteSelecionado].nomeFantasia,
            clienteId: clientes[clienteSelecionado].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            idUsuario: user.uid
        })
            .then(() => {
                toast.success('Chamado registrado com sucesso!')
                setComplemento('')
                setClienteSelecionado(0)
            })
            .catch((error) => {
                console.log(error)
                toast.error('Erro ao registrar o chamado!')
            })
    }


    return (
        <div>
            <Header />

            <div className='content'>
                <Title name={id ? 'Editar chamado' : 'Novo chamado'}>
                    <FcPlus size={25} />
                </Title>

                <div className='container'>

                    <form className='form-profile' onSubmit={CadastrarChamado}>

                        <label>Clietes</label>
                        {
                            loadClientes ? (
                                <input type='text' disabled={true} value='Carregando...' />
                            ) : (
                                <select value={clienteSelecionado} onChange={trocarClienteSelecionado}>
                                    {clientes.map((item, index) => {
                                        return (
                                            <option key={index} value={index}>
                                                {item.nomeFantasia}
                                            </option>
                                        )
                                    })}
                                </select>
                            )
                        } <br />


                        <label>Assunto</label>
                        <select value={assunto} onChange={trocarAssunto}>
                            <option key={1} value='Suporte'>Suporte</option>
                            <option key={2} value='Visita Técninca'>Visita Técninca</option>
                            <option key={3} value='Financeiro'>Financeiro</option>
                        </select><br />


                        <label>Status</label>
                        <div className='situacao'>

                            <input
                                type="radio"
                                name="radio"
                                value='Aberto'
                                onChange={trocarStatus}
                                checked={status === 'Aberto'} />
                            <span>Em aberto</span>

                            <input
                                type="radio"
                                name="radio"
                                value='Progresso'
                                onChange={trocarStatus}
                                checked={status === 'Progresso'} />
                            <span>Progresso</span>

                            <input
                                type="radio"
                                name="radio"
                                value='Fechado'
                                onChange={trocarStatus}
                                checked={status === 'Fechado'} />
                            <span>Fechado</span>

                        </div>

                        <label>Complemento</label>
                        <textarea type='text' placeholder='Descreva seu problema...(Obrigatório!)' value={complemento} onChange={(e) => setComplemento(e.target.value)} /><br />

                        <button type='submit'>{id ? 'Editar chamado' : 'Registrar chamado'}</button>

                    </form>

                </div>

            </div>

        </div>
    )

}