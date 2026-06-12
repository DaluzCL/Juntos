import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../services/api';


function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

const handleLogin = async () => {
    try {
        const response = await api.post('/api/auth/login', { email, senha});
        localStorage.setItem('token', response.data.token);
        navigate('/resumo');
    }catch (error) {
        alert('Email ou senha incorretos!');
    }
}

    return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
            <h1 className="text-white text-2xl font-bold mb-6">Entrar no Juntos</h1>
    
    
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

    <button onClick={handleLogin} className="bg-purple-600 text-white px-4 py-2 rounded">
    Entrar
    </button>

    <p className="text-gray-400 text-sm mt-4 text-center">
        Não tem conta? <span onClick={() => navigate('/cadastro')} className="text-purple-400 cursor-pointer">Cadastrar</span>
    </p>
       </div>
    </div>
    );
}




export default Login;

