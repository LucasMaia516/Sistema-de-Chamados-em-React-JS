import Header from '../pages/Header'
import Title from './Title'
import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/auth'
import "./Perfil.css"

import { FcSettings, FcUpload } from "react-icons/fc";
import avatar from '../assets/avatar.png'
import { toast } from 'react-toastify'
import { db, storage } from '../services/firebaseConnection'
import { updateDoc, doc } from 'firebase/firestore' // updateDoc é para alterar o documento no firebase
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage' // ref é para acessar e referência, uploadBytes é para enviar a foto, e o getDownloadURL é para pegar a URL da foto enviada.


export default function Perfil() {

    const { user, salvarNoLocalStrorage, setUser, deslogarUsuario } = useContext(AuthContext)

    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [nome, setNome] = useState(user && user.nome)
    const [email, setEmail] = useState(user && user.email)
    const [imageAvatar, setImageAvatar] = useState(null)

    function trocarImagem(e){ // Função de trocar a imagem de perfil

        if(e.target.files[0]){ // Pegando a imagem selecionada 

            const image = e.target.files[0] // Jogando a imagem selecionada na variável image

            if(image.type === 'image/jpeg' || 'image/png'){ // O tipo da imagem selecionada tem que ser do tipo JPEG ou PNG
                setImageAvatar(image) // Sendo dos tipos acima, amarzenamos a imagem nessa função
                setAvatarUrl(URL.createObjectURL(image)) // Criando uma URL da imagem selecionada, pois para mudar uma imagem, precisa enviar a URL dela, então essa função cria ou pega a URL da imagem
            }else {
                toast.error('Envie uma imagem do tipo PNG ou JPEG')
                setImageAvatar(null)
                return;
            }
        }

    }


    async function editarFoto(){ // Função para editar a foto

        const uidUsuario = user.uid // Jogando o uid do usuário na variável

        const uploadRef = ref(storage, `images/${uidUsuario}/${imageAvatar.name}`) // Acessando a referência no banco, criando uma pasta chamada images, aonde pegamos o uid do usuário com o nome da imagem que ele está selecionando

        const uploadTask = uploadBytes(uploadRef, imageAvatar) // Dando um upload da imagem na pasta criada (images)no banco 

        .then((snapshot)=> { // Se deu tudo certo, cai nesse then, aonde pegamos o valor gerado e criamos uma URL da imagem para mandar para o firebase

            getDownloadURL(snapshot.ref) // Criando a URL da foto na referência no banco firebase
            .then(async (downloadURL) => {
                let urlFoto = downloadURL; // Jogando a URL criada para a foto em uma variável

                const docRef = doc(db, 'usuarios', user.uid) // Acessando o documento, o banco, a coleção, mais o uid do usuário e jogando em uma variável

                await updateDoc(docRef, { // Dando o update no banco com a URL da foto, mais o nome.
                    avatarUrl: urlFoto,
                    nome: nome
                })
                .then(()=> { // Jogando tudo que tem dentro do user, com o novo nome, mas a nova foto e atualizando no setUser, e salvando os novos dados no localStrorage.
                    let data = {
                        ...user,
                        nome: nome, 
                        avatarUrl: urlFoto
                    }

                    setUser(data)
                    salvarNoLocalStrorage(data)
                    toast.success('Atualizado com sucesso!')
                })
            })
        })
    }

    async function alterarNomeFoto(e){
        e.preventDefault()
        
        if(imageAvatar === null && nome !== ''){ // Essa condição é sobre querer trocar somente o nome, ou seja, se a imagemAvatar não tiver nada, e o campo nome estiver preenchido, quer dizer que o usuário só deseja alterar o nome

            const docRef = doc(db, 'usuarios', user.uid) // Jogando o documento, a conexão, mais a coleção com o uid do usuário nas variável

            await updateDoc(docRef, { // função de alterar o documento no banco
                nome: nome, // alterando somente a propriedade nome.
            })
            .then(()=> {
                const data = { // Se deu tudo certo, cai nesse then, aonde pegar tudo que já tem dentro do user do usuário, mas atualiza o nome com a propriedade nome e salva os novos valores no setUser e no localStrorage.
                    ...user,
                    nome: nome
                }
                setUser(data)
                salvarNoLocalStrorage(data)
                toast.success('Nome editado com sucesso!')
            })
        }else if(nome !=='' && imageAvatar !== null){ // Condição se, o nome for diferente de vazio e a imagem for diferente de null, quer dizer que o usuário deseja trocar a foto também

            editarFoto()

        }



    }


    return (
        <div>
            <Header />

            <div className='content'>

                <Title name='Meu perfil'>
                    <FcSettings size={25} />
                </Title>

                <div className='container'>

                    <form className='form-profile' onSubmit={alterarNomeFoto}>

                        <label className='label-avatar'>
                            <span>
                                <FcUpload size={25} />
                            </span>

                            <input type="file" accept='image/*' onChange={trocarImagem}/><br />
                            {avatarUrl === null ? (
                                <img src={avatar} alt="Foto de perfil" width={250} height={250} />
                            ) : (
                                <img src={avatarUrl} alt="Foto de perfil" width={250} height={250} />
                            )}
                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e)=> setNome(e.target.value)} /><br />

                        <label>E-mail</label>
                        <input type="email" value={email} disabled={true}/><br />

                        <button type='submit'>Salvar</button><br />

                    </form>

                </div>

                <div className='container'>
                    <button onClick={deslogarUsuario} className='btn-sair'>Sair da conta</button>
                </div>

            </div>

        </div>
    )

}