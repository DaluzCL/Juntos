import { useState, useEffect} from "react";
import BottomNav from "../components/BottomNav";
import {Plus, MoreVertical} from "lucide-react"
import api from "../services/api";

function Transacoes() {
    const [modalAberto, setModalAberto] = useState(false);
    const [descricao, setDescricao] = useState('');
    const [vistaModal, setVistaModal] = useState('transacao');
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState('Entrada');
    const [data, setData] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [transacoes, setTransacoes] = useState([]);
    const [filtro, setFiltro] = useState('Todas');
    const [categorias, setCategorias] = useState([]);
    const [nomeCategoria, setNomeCategoria] = useState('');
    const [iconeCategoria, setIconeCategoria] = useState('');
    const [corCategoria, setCorCategoria] = useState('');
    const [menuAbertoId, setMenuAbertoId] = useState(null);
    const [transacaoEditando, setTransacaoEditando] = useState(null);


    // Busca as transações já feitas
    useEffect(() => {
        const buscarTransacoes = async () => {
            const token = localStorage.getItem("token");
            const response = await api.get('/api/transacoes', {
                headers: { Authorization: `Bearer ${token}` }
        });
        setTransacoes(response.data);

           const resCategorias = await api.get('/api/categorias', {
        headers: {Authorization: `Bearer ${token}` }
    });
    setCategorias(resCategorias.data);        
        };


    buscarTransacoes();
}, []);

    // Filtro das transações
    const transacoesFiltradas = transacoes.filter(t => {
            if (filtro === 'Todas') return true;
            return t.tipo === filtro;
        });
    
    // Função para salvar/criar transações    
    const handleSalvarTransacao = async () => {
        const token = localStorage.getItem('token')
        try {
            if (transacaoEditando) {
                await api.put(`/api/transacoes/${transacaoEditando.id}`, {descricao, valor, tipo, data, categoria_id: categoriaId}, {
                    headers: {Authorization: `Bearer ${token}`}                 
                });
            } else {
                await api.post('/api/transacoes', {descricao, valor, tipo, data, categoria_id: categoriaId}, {
                    headers: {Authorization: `Bearer ${token}`}
                });
            }
            setModalAberto(false);
            setTransacaoEditando(null);
            setDescricao(''); setValor(''); setTipo('Entrada'); setData(''); setCategoriaId('');
            const response = await api.get('/api/transacoes', {
                headers: {Authorization: `Bearer ${token}`}
            });
            setTransacoes(response.data);
        }catch (error) {
            alert('Erro ao salvar transação!')
        }
    };

    // Função para deletar Transações
    const handleDeletarTransacao = async (id) => {
        const token = localStorage.getItem('token')
        try {
            await api.delete(`/api/transacoes/${id}`, {
                headers: {Authorization: `Bearer ${token}`}
        });
        setMenuAbertoId(null);
        const response = await api.get('/api/transacoes', {
            headers: {Authorization: `Bearer ${token}` } 
        });
        setTransacoes(response.data);
        } catch (error) {
        alert('Erro ao deletar transação!')
        }
    };

    // Função para criar as categorias
    const handleCriarCategoria = async () => {
        const token = localStorage.getItem('token')
        try {
            await api.post('/api/categorias', {nome: nomeCategoria, icone: iconeCategoria, cor: corCategoria}, {
                headers: {Authorization: `Bearer ${token}`}
            });
            setVistaModal('transacao');
            const response =await api.get('/api/categorias', {
                headers: {Authorization: `Bearer ${token}`}
            });
            setCategorias(response.data);
        }catch (error) {
            alert('Erro ao criar categoria!');
        }
    };


    // Parte visual
    return (
        
        <div className="min-h-screen bg-gray-900 p-8 pb-24">
            <h1 className="text-3xl font-bold text-white mb-6">Transações Recentes</h1>
                        <div className="mt-3 mb-4">
                <label className="text-gray-400 mr-4">Filtrar por tipo:</label>
                <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="bg-gray-700 text-white px-4 py-2 rounded">
                    <option value="Todas">Todas</option>
                    <option value="Entrada">Entradas</option>
                    <option value="Saida">Saídas</option>
                </select>
            </div>

            {transacoesFiltradas.map((t) => (
                <div key={t.id} className="bg-gray-800 p-4 rounded-xl mb-2 flex justify-between items-center relative">
                    <span className="text-white">{t.descricao}</span>
                    <span className={t.tipo === 'Entrada' ? 'text-green-400' : 'text-red-400'}>R$ {t.valor}</span>

                    <MoreVertical 
                    className="text-gray-400 cursor-pointer ml-2"
                    onClick={() => setMenuAbertoId(menuAbertoId === t.id ? null : t.id)}
                    />

                    {menuAbertoId === t.id && (
                        <div className="absolute right-0 top-12 bg-gray-700 rounded-lg shadow-lg z-10">
                        <p 
                         
                            onClick={() => {
                                setTransacaoEditando(t);
                                setDescricao(t.descricao);
                                setValor(t.valor);
                                setTipo(t.tipo);
                                setData(t.data);
                                setCategoriaId(t.categoria_id);
                                setModalAberto(true);
                                setMenuAbertoId(null);
                            }}
                            className="px-4 py-2 text-white cursor-pointer hover:bg-gray-600"
                         
                        >
                            Editar
                        </p>
                        <p 

                            onClick={() => handleDeletarTransacao(t.id)}
                            className="px-4 py-2 text-red-400 cursor-pointer hover:bg-gray-600"
                            >
                            Deletar
                        </p>
                    </div>
                )}

            </div>
        ))}

         <button onClick={() => setModalAberto(true)} className="fixed bottom-20 right-6 bg-purple-600 text-white rounded-full w-14 h-14 text-2xl shadow-lg flex items-center justify-center">
          <Plus size={24} />
        </button>

        {modalAberto && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4'>
                <div className='bg-gray-800 p-8 rounded-xl w-full max-w-md'>
                    <h2 className='text-white text-xl font-bold mb-4'>Adicionar transação</h2>
  
                {vistaModal === 'transacao' && (
                    <div>
                    <input
                        type='text'
                        placeholder='Descrição'
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className='w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4'                                              
                    />  

                    <input
                        type='number'
                        placeholder='Valor'
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        className='w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4'                                              
                    />  

                        <select value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        className='w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4'>  
                        <option value="Entrada">Entrada</option>    
                        <option value="Saida">Saída</option>     
                        </select>                                   
                      
                    <input
                        type='date'
                        placeholder='Data'
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        className='w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4'                                              
                    />  
                    <select
                        value={categoriaId}
                        onChange={(e) => setCategoriaId(e.target.value)}
                        className='w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4'>
                        <option value="">Selecione uma categoria</option>
                        {categorias.map((c) => (
                            <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                        </select>                 

                    <button onClick={handleSalvarTransacao} className='bg-purple-600 text-white px-4 py-2 rounded'>
                        {transacaoEditando ? 'Salvar' : 'Criar'}
                    </button>
                    <button 
                    
                    onClick={() => {
                                setTransacaoEditando(null);
                                setDescricao('');
                                setValor('');
                                setTipo('Entrada');
                                setData('');
                                setCategoriaId('');
                                setModalAberto(null);
                                setMenuAbertoId(null);
                            }} 
                          
                    className='bg-gray-600 text-white px-4 py-2 rounded ml-2'
                    >
                        Cancelar
                    </button>
                    <p onClick={() => setVistaModal('categoria')} className="text-purple-400 text-sm cursor-pointer mb-4">
                        + Nova Categoria
                    </p>
                    </div>
                    )}

                    {vistaModal === 'categoria' && (
                        <div>
                            <input
                            type='text'
                            placeholder="Nome da categoria"
                            value={nomeCategoria}
                            onChange={(e) => setNomeCategoria(e.target.value)}
                            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4"/>

                            <input 
                            type='text'
                            placeholder="Escolha um emoji"
                            value={iconeCategoria}
                            onChange={(e) => setIconeCategoria(e.target.value)}
                            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4"
                            />

                            <input 
                            type="color"
                            value={corCategoria}
                            onChange={(e) => setCorCategoria(e.target.value)}
                            className="w-full h-12 rounded-lg mb-4"
                            />

                    <button onClick={handleCriarCategoria} className='bg-purple-600 text-white px-4 py-2 rounded'>Criar</button>
                    <button onClick={() => setVistaModal('transacao')} className='bg-gray-600 text-white px-4 py-2 rounded ml-2'>Cancelar</button>

                        </div>
                    )}
                </div>
            </div>
        )}

            <BottomNav />

        </div>
    );

}

export default Transacoes;