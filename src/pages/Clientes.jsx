import Header from './Header'
import Title from './Title'

import "./Clientes.css"

import { FcCustomerSupport } from "react-icons/fc";
import { useState } from 'react';
import { db } from '../services/firebaseConnection'
import { addDoc, collection} from 'firebase/firestore' // O addDoc sempre gera um uid único. Ele serve para criar um novo documento no banco
import { toast } from 'react-toastify'

export default function Clientes() {

    const [nomeEmpresa, setNomeEmpresa] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [endereco, setEndereco] = useState('')


    async function salvarNovaEmpresa(e) {
        e.preventDefault()
        
     if(nomeEmpresa !=='' && cnpj !== '' && endereco !== ''){
        await addDoc(collection(db, 'clientes'), { // Criando um documento na conexão db do nosso banco, com o nome de clientes.
            nomeFantasia: nomeEmpresa, // Criando e passando as propriedades para cadastrar a empresa
            cnpj: cnpj,
            endereco: endereco
        })
        .then(()=> {
            setCnpj('')
            setNomeEmpresa('')
            setEndereco('')
            toast.success('Empresa cadastrada com sucesso!')    
        })
        .catch((error)=> {
            console.log(error)
            toast.error('Erro ao cadastrar a empresa!')
        })
     } else {
        toast.error('Preecha todos os campos!')
     }
    }

    return (
        <div>
            <Header />


            <div className='content'>
                <Title name='Cadastrar novo cliente'>
                    <FcCustomerSupport size={25} />
                </Title>


                <div className='container'>

                    <form className='form-profile' onSubmit={salvarNovaEmpresa}>

                        <label>Nome Fantasia</label>
                        <input type="text" placeholder='Digite o nome da empresa' value={nomeEmpresa} onChange={(e) => setNomeEmpresa(e.target.value)} /> <br />

                        <label>CNPJ</label>
                        <input type="text" placeholder='Digite o CNPJ da empresa' value={cnpj} onChange={(e) => setCnpj(e.target.value)} /> <br />

                        <label>Nome do Endereço</label>
                        <input type="text" placeholder='Digite o endereço da empresa' value={endereco} onChange={(e) => setEndereco(e.target.value)} /> <br />

                        <button type='submit'>Cadastrar</button>

                    </form>
                </div>
            </div>



        </div>

    )

}