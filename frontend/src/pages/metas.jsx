import {useState, useEffect} from "react";
import BottomNav from "../components/BottomNav";
import {Plus, MoreVertical} from "lucide-react";
import api from "../services/api";

function Metas() {
    const [metas, setMetas] = useState ([]);
    const [modalAberto, setModalAberto] = useState (false);
    const [nome, setNome] = useState ('');
    const [valorAlvo, setValorAlvo] = useState ('');
    const [valorAtual, setValorAtual] = useState ('');
    const [metaEditando, setMetaEditando] = useState (null);
    const [menuAbertoId, setMenuAbertoId] = useState (null);
    const [vistaModal, setVistaModal] = useState ('meta');
    const [adicionarValor, setAdicionarValor] = useState ('');

    useEffect(() => {
        const buscarMetas = async () => {
            const token = localStorage.getItem("token");
            const response = await api.get('/api/metas', {
                headers: {Authorization: `Bearer ${token}`}
            });
        setMetas(response.data); 
        };
        buscarMetas();
    }, []);

    const handleSalvarMetas = async () => {
        const token = localStorage.getItem('token')
        try {
            if (metaEditando) {
                await api.put(`/api/metas/${metaEditando.id}`, {nome, valor_alvo: valorAlvo, valor_atual: valorAtual}, {
                    headers: {Authorization: `Bearer ${token}`}
                });
            } else {
                await api.post('/api/metas', {nome, valor_alvo: valorAlvo, valor_atual: valorAtual}, {
                    headers: {Authorization: `Bearer ${token}`}
                });
            }
            setModalAberto(false);
            setMetaEditando(null);
            setNome(''); setValorAlvo(''); setValorAtual('');
            const response = await api.get('/api/metas', {
                headers: {Authorization: `Bearer ${token}`}
            });
            setMetas(response.data);
        } catch (error) {
            alert('Erro ao salvar meta')
        }
    };

    const handleDeletarMeta = async (id) => {
        const token = localStorage.getItem('token')
        try {
            await api.delete(`/api/metas/${id}`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            setMenuAbertoId(null);
            const response = await api.get('/api/metas', {
                headers: {Authorization: `Bearer ${token}`}
            });
            setMetas(response.data);
        } catch (error) {
            alert('Erro ao deletar meta!')
        }
    };

     const handleAdicionarValor = async () => {
        const token = localStorage.getItem('token')
        try {
            const novoValorAtual = Number(metaEditando.valor_atual) + Number(adicionarValor);
                await api.put(`/api/metas/${metaEditando.id}`, {
                    nome: metaEditando.nome, 
                    valor_alvo: metaEditando.valor_alvo, 
                    valor_atual: novoValorAtual
                }, {
                    headers: {Authorization: `Bearer ${token}`}
            });
            setModalAberto(false);
            setMetaEditando(null);
            setAdicionarValor('');
            const response = await api.get('/api/metas', {
                headers: {Authorization: `Bearer ${token}`}
            });
            setMetas(response.data);
        } catch (error) {
            alert('Erro ao salvar meta')
        }
    };

     return (
        
        <div className="min-h-screen bg-gray-900 p-8 pb-24">
            <h1 className="text-3xl font-bold text-white mb-6">Metas</h1>

            {metas.map((m) => (
                <div key={m.id} className="bg-gray-800 p-4 rounded-xl mb-2 flex justify-between items-center relative">
                    <span className="text-white">{m.nome}</span>
                    <span className="text-gray-400">R$ {m.valor_atual} / R$ {m.valor_alvo}</span>

                    <MoreVertical 
                    className="text-gray-400 cursor-pointer ml-2"
                    onClick={() => setMenuAbertoId(menuAbertoId === m.id ? null : m.id)}
                    />

                    {menuAbertoId === m.id && (
                        <div className="absolute right-0 top-12 bg-gray-700 rounded-lg shadow-lg z-10">
                        <p 
                         
                            onClick={() => {
                                setMetaEditando(m);
                                setNome(m.nome);
                                setValorAlvo(m.valor_alvo);
                                setValorAtual(m.valor_atual);
                                setVistaModal('meta');
                                setModalAberto(true);
                                setMenuAbertoId(null);
                            }}
                            className="px-4 py-2 text-white cursor-pointer hover:bg-gray-600"
                         
                        >
                            Editar
                        </p>
                        <p 

                            onClick={() => handleDeletarMeta(m.id)}
                            className="px-4 py-2 text-red-400 cursor-pointer hover:bg-gray-600"
                            >
                            Deletar
                        </p>
                        <p 

                            onClick={() => {
                                setMetaEditando(m);
                                setVistaModal('adicionar');
                                setModalAberto(true);
                                setMenuAbertoId(null);
                            }}
                            className="px-4 py-2 text-green-400 cursor-pointer hover:bg-gray-600"
                            >
                            Adicionar Valor
                        </p>
                    </div>
                )}

            </div>
        ))}

         <button onClick={() => {
            setVistaModal('meta');
            setModalAberto(true)
        }}             
            className="fixed bottom-20 right-6 bg-purple-600 text-white rounded-full w-14 h-14 text-2xl shadow-lg flex items-center justify-center">
          <Plus size={24} />
        </button>

        {modalAberto && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4'>
                <div className='bg-gray-800 p-8 rounded-xl w-full max-w-md'>
                    <h2 className='text-white text-xl font-bold mb-4'>Adicionar Meta</h2>
  
                {vistaModal === 'meta' && (
                    <div>
                    <input
                        type='text'
                        placeholder='Nome'
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className='w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4'                                              
                    />  

                    <input
                        type='number'
                        placeholder='Valor Alvo'
                        value={valorAlvo}
                        onChange={(e) => setValorAlvo(e.target.value)}
                        className='w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4'                                              
                    />  

                    <input
                    type='number'
                    placeholder='Valor Atual'
                    value={valorAtual}
                    onChange={(e) => setValorAtual(e.target.value)}
                    className='w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4'                                              
                    />  
                       

                    <button onClick={handleSalvarMetas} className='bg-purple-600 text-white px-4 py-2 rounded'>
                        {metaEditando ? 'Salvar' : 'Criar'}
                    </button>
                    <button 
                    
                    onClick={() => {
                        setNome('');
                        setValorAlvo('');
                        setValorAtual('');
                        setModalAberto(false);
                        setMetaEditando(null);
                    }} 
                          
                    className='bg-gray-600 text-white px-4 py-2 rounded ml-2'
                    >
                        Cancelar
                    </button>

                    </div>
                    )}

                    {vistaModal === 'adicionar' && (
                        <div>

                            <p className="text-white text-lg mb-4">Adicionar valor em: {metaEditando?.nome}</p>

                            <input 
                            type='number'
                            placeholder="Adicionar valor"
                            value={adicionarValor}
                            onChange={(e) => setAdicionarValor(e.target.value)}
                            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4"
                            />

                    <button onClick={handleAdicionarValor} className='bg-purple-600 text-white px-4 py-2 rounded'>Salvar</button>
                    <button onClick={() => setVistaModal('meta')} className='bg-gray-600 text-white px-4 py-2 rounded ml-2'>Cancelar</button>

                        </div>
                    )}
                </div>
            </div>
        )}

            <BottomNav />

        </div>
    );

}


export default Metas;