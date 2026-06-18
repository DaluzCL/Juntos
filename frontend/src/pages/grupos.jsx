import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../services/api';

function Grupos() {
        const [modal, setModal] = useState(null);
        const [nomeGrupo, setNomeGrupo] = useState('');
        const [codigoGrupo, setCodigoGrupo] = useState('');
        const navigate = useNavigate();

        const handleCriarGrupo = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.post('/api/grupos/criar', { nome: nomeGrupo }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                alert('Grupo criado com sucesso!');
                setModal(null);
                navigate('/resumo');
            }catch (error) {
                alert('Erro ao criar grupo!');
            }
        };
    
            const handleEntrarGrupo = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await api.post('/api/grupos/entrar', { codigo: codigoGrupo }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }   
                    });
                    alert('Entrou no grupo com sucesso!');
                    setModal(null);
                    navigate('/resumo');
                }catch (error) {
                    alert('Erro ao entrar no grupo!');
                }
            };


        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
                <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
                    <h1 className="text-white text-2xl font-bold mb-6">Grupos</h1>
                    <p className='text-gray-400 text-sm mb-6'>Para continuar, crie um grupo ou entre em um existente usando o código de convite.</p>

    <div className='flex flex-col gap-4'>
        <button onClick={() => setModal('criar')} className='bg-purple-600 text-white px-4 py-2 rounded w-full'>Criar Grupo</button>
        <button onClick={() => setModal('entrar')} className='bg-purple-600 text-white px-4 py-2 rounded w-full'>Entrar com código</button>
    </div>

        {modal === 'criar' && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                <div className='bg-gray-800 p-8 rounded-xl w-full max-w-md'>
                    <h2 className='text-white text-xl font-bold mb-4'>Criar Grupo</h2>

                    <input
                        type='text'
                        placeholder='Nome do grupo'
                        value={nomeGrupo}
                        onChange={(e) => setNomeGrupo(e.target.value)}
                        className='w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4'
                        
                    />  
                    <button onClick={handleCriarGrupo} className='bg-purple-600 text-white px-4 py-2 rounded'>Criar</button>
                    <button onClick={() => setModal(null)} className='bg-gray-600 text-white px-4 py-2 rounded ml-2'>Cancelar</button>
                </div>
                </div>
        )}

        {modal === 'entrar' && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                <div className='bg-gray-800 p-8 rounded-xl w-full max-w-md'>
                    <h2 className='text-white text-xl font-bold mb-4'>Entrar com código</h2>
                    <input
                        type='text'
                        placeholder='Código do grupo'
                        value={codigoGrupo}
                        onChange={(e) => setCodigoGrupo(e.target.value)}
                        className='w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4'
                    />
                    <button onClick={handleEntrarGrupo} className='bg-purple-600 text-white px-4 py-2 rounded'>Entrar</button>
                    <button onClick={() => setModal(null)} className='bg-gray-600 text-white px-4 py-2 rounded ml-2'>Cancelar</button>

                </div>
             </div>
        )}
        </div>
        </div>
        );
    }


export default Grupos;