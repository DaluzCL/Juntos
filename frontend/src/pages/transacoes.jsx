import { useState, useEffect} from "react";
import BottomNav from "../components/BottomNav";
import {Plus} from "lucide-react"
import api from "../services/api";

function Transacoes() {
    const [modalAberto, setModalAberto] = useState(false);
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState('Entrada');
    const [data, setData] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [transacoes, setTransacoes] = useState([]);
    const [filtro, setFiltro] = useState('Todas');
    const [categorias, setCategorias] = useState([]);

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

     const transacoesFiltradas = transacoes.filter(t => {
            if (filtro === 'Todas') return true;
            return t.tipo === filtro;
        });
    
    const handleAddTransacao = async () => {
        const token = localStorage.getItem('token')
        try {
            await api.post('/api/transacoes', {descricao, valor, tipo, data, categoria_id: categoriaId}, {
                headers: {Authorization: `Bearer ${token}` }
            });
            setModalAberto(false);
            const response = await api.get('/api/transacoes', {
                headers: {Authorization: `Bearer ${token}` }
            });
        }catch (error) {
            alert('Erro ao adicionar transação!');
        }
    };



    return (
        
        <div className="min-h-screen bg-gray-900 p-8 pb-24">
            <h1 className="text-3xl font-bold text-white mb-6">Transações Recentes</h1>
                        <div className="mt-6">
                <label className="text-gray-400 mr-4">Filtrar por tipo:</label>
                <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="bg-gray-700 text-white px-4 py-2 rounded">
                    <option value="Todas">Todas</option>
                    <option value="Entrada">Entradas</option>
                    <option value="Saída">Saídas</option>
                </select>
            </div>

            {transacoesFiltradas.map((t) => (
                <div key={t.id} className="bg-gray-800 p-4 rounded-xl mb-2 flex justify-between">
                    <span className="text-white">{t.descricao}</span>
                    <span className={t.tipo === 'Entrada' ? 'text-green-400' : 'text-red-400'}>R$ {t.valor}</span>
                </div>
            ))}

         <button onClick={() => setModalAberto(true)} className="fixed bottom-20 right-6 bg-purple-600 text-white rounded-full w-14 h-14 text-2xl shadow-lg flex items-center justify-center">
          <Plus size={24} />
        </button>

        {modalAberto && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4'>
                <div className='bg-gray-800 p-8 rounded-xl w-full max-w-md'>
                    <h2 className='text-white text-xl font-bold mb-4'>Adicionar transação</h2>

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

                    <button onClick={handleAddTransacao} className='bg-purple-600 text-white px-4 py-2 rounded'>Criar</button>
                    <button onClick={() => setModalAberto(null)} className='bg-gray-600 text-white px-4 py-2 rounded ml-2'>Cancelar</button>
                </div>
                </div>
        )}

            <BottomNav />

        </div>
    );

}

export default Transacoes;