import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../services/api';


function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

const handleCadastro = async () => {
    try {
        const response = await api.post('/api/auth/register', { nome, email, senha});
        localStorage.setItem('token', response.data.token);
        navigate('/grupos');
    }catch (error) {
        alert('Erro ao criar conta. Tente novamente.');
    }
}

    return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
            <h1 className="text-white text-2xl font-bold mb-6">Criar conta</h1>
    
    
    <input 
    type="text"
    placeholder="Seu Nome"
    value={nome}
    onChange={(e) => setNome(e.target.value)}
    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4"
    />

    <input
    type="email"
    placeholder="Seu email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4"
    />
 
    <input 
    type="password"
    placeholder="Sua senha"
    value={senha}
    onChange={(e) => setSenha(e.target.value)}
    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4"
    />

    <button onClick={handleCadastro} className="bg-purple-600 text-white px-4 py-2 rounded">
    Cadastrar
    </button>

    <p className="text-gray-400 text-sm mt-4 text-center">
        Voltar para tela de <span onClick={() => navigate('/login')} className="text-purple-400 cursor-pointer">Login</span>
    </p>
       </div>
    </div>
    );
}




export default Cadastro;

