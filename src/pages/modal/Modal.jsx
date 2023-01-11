import "./Modal.css"
import { FiX } from 'react-icons/fi'


export default function Modal({ conteudo, close }) {

    return (
        <div className="modal">
            <div className="container">
                <button className="close" onClick={close}>
                    <FiX size={25} color="#FFF" />
                    Voltar
                </button>

                <main>
                    <h2>Detalhes do chamado</h2>

                    <div className="linha">
                        <span>
                            Cliente: <i>{conteudo.cliente}</i>
                        </span>
                    </div>

                    <div className="linha">
                        <span>
                            Assunto: <i>{conteudo.assunto}</i>
                        </span>

                        <span>
                            Cadastrado em: <i>{conteudo.criadoFormat}</i>
                        </span>
                    </div>

                    <div className="linha">
                        <span>
                            Staus: <i className="statusModal" style={{color: '#FFF', backgroundColor: conteudo.status === 'Aberto' ? '#5cb85c' : 'gray'}}>{conteudo.status}</i>
                        </span>
                    </div>

                    <>
                        
                            <h3>Complemento:</h3>
                            <p>{conteudo.complemento}</p>
                        
                    </>
                </main>
            </div>
        </div>
    )

}