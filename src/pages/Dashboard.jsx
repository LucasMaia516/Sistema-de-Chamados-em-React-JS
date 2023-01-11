/* eslint-disable no-undef */
import './Dashboard.css'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/auth'
import { FcPlus, FcHome, FcSearch, FcEditImage } from "react-icons/fc";
import { Link } from 'react-router-dom'
import { collection, getDocs, orderBy, limit, startAfter, query } from 'firebase/firestore'
import { db } from '../services/firebaseConnection'
import { format } from 'date-fns'
import Modal from '../pages/modal/Modal';


import Header from './Header'
import Title from './Title'
import { async } from '@firebase/util';


const listRef = collection(db, "chamados") // Passando a conexão do banco, mais a coleção quer queremos acessar


export default function Dashboard() {

    const { user } = useContext(AuthContext)

    const [listaChamados, setListaChamados] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEmpty, setIsEmpty] = useState(false)

    const [buscarChamados, setBuscarChamados] = useState()
    const [loadBuscaChamados, setLoadBuscaChamados] = useState('')
    const [aparecerModal, setAparecerModal] = useState(false)
    const [detalhesItem, setDetalhesItem] = useState()


    useEffect(() => { // Esse useEffect está renderizando todos os chamados na tela, através das funções que foram passadas para ele.

        async function loadChamados() { // Função criada para renderizer os chamados

            const q = query(listRef, limit(5))

            const querySnapshot = await getDocs(q)
            setListaChamados([]) // Zerando o array para não duplicar os chamados
            await updateState(querySnapshot)
            setLoading(false)
        }
        loadChamados()

    }, [])



    async function updateState(querySnapshot) {

        const isCollectionEmpty = querySnapshot.size === 0 // Se não tiver nenhum chamdo dentro da array (variável), logo ela vira true

        if (!isCollectionEmpty) { // Condição se, não tiver nada na lista, abaixo abrimos um array vazio, e logo em seguida, alimentamos essa array com os dados adicionados abaixo.
            let lista = []

            querySnapshot.forEach((doc) => { // Percorrendo a array e alimentado ela
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    status: doc.data().status,
                    criadoEm: doc.data().criadoEm,
                    criadoFormat: format(doc.data().criadoEm.toDate(), 'dd/MM/yyy'),
                    complemento: doc.data().complemento
                })
            })


            const ultimoChamado = querySnapshot.docs[querySnapshot.docs.length - 1]
            // console.log(ultimoChamado)


            setListaChamados(listaChamados => [...listaChamados, ...lista])
            setBuscarChamados(ultimoChamado)
            // console.log(lista)



        } else {
            setIsEmpty(true)
        }
        setLoadBuscaChamados(false)
    }



    if (loading) {
        return (
            <div>
                <Header />

                <div className='content'>

                    <Title name='Chamados'>
                        <FcHome size={25} />
                    </Title>
                </div>

                <div className='container dashboard'>
                    <h1>Buscando chamados...</h1>
                </div>

            </div>

        )
    }

    async function buscarMaisChamados() {
        setLoadBuscaChamados(true)

        const q = query(listRef, startAfter(buscarChamados), limit(5)) // Acessamos o documento, fazemos uma requisição e essa função startAfter, busca o último item da lista de array do banco de dados, através da constante 'ultimoChamado'
        const querySnapshot = await getDocs(q) // jogamos os dados tragos para listar novamente nessa constante 'ultimoChamado'

        await updateState(querySnapshot) // Passamos os novos dados, para a função 'updateState' que renderiza na tela os chamados
    }


    async function mostrarModal(item) { // Função para mostrar o modal do chamado clicado

        setAparecerModal(!aparecerModal) // se o aparecerModal estiver false ele vai para true, ou virse e versa
        setDetalhesItem(item)

    }

    return (

        <div>

            <Header />

            <div className='content'>

                <Title name='Chamados'>
                    <FcHome size={25} />
                </Title>

                <>

                    {listaChamados.length === 0 ? (
                        <div className='container dashboard'>
                            <span>Nenhum chamado encontrado...</span> <br />
                            <Link className='new' to="/novochamado">
                                <FcPlus size={25} />Novo chamado
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link className='new' to="/novochamado">
                                <FcPlus size={25} />Novo chamado
                            </Link>

                            <table>
                                <thead>
                                    <tr>
                                        <th scope='col'>Cliente</th>
                                        <th scope='col'>Assunto</th>
                                        <th scope='col'>Status</th>
                                        <th scope='col'>Cadastrado em</th>
                                        <th scope='col'>#</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {listaChamados.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td data-label='Cliente'>{item.cliente}</td>
                                                <td data-label='Assunto'>{item.assunto}</td>
                                                <td data-label='Status'>
                                                    <span className='status' style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : 'gray' }}>{item.status}</span>
                                                </td>
                                                <td data-label='Cadastrado'>{item.criadoFormat}</td>
                                                <td data-label='#'>
                                                    <button className='action' style={{ backgroundColor: '#F9D423' }}>
                                                        <FcSearch size={18} onClick={() => mostrarModal(item)} />
                                                    </button>
                                                    <Link to={`/novochamado/${item.id}`} className='action' style={{ backgroundColor: '#b31217' }}>
                                                        <FcEditImage size={18} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}

                                </tbody>
                            </table>

                            {loadBuscaChamados && <h3 className='carregandoChamados'>Carregando mais chamados...</h3>}

                            {!loadBuscaChamados && !isEmpty && <button className='btn-buscaChamados' onClick={buscarMaisChamados}>Buscar mais chamados</button>}
                        </>
                    )}

                </>

            </div>

            {aparecerModal &&
                <Modal
                    conteudo={detalhesItem}
                    close={() => setAparecerModal(!aparecerModal)}
                />
            }
        </div>
    )


}