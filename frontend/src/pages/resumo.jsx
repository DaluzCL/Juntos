import { useState, useEffect} from "react";
import BottomNav from "../components/BottomNav";
import api from "../services/api";


function Resumo() {
    const [resumo, setResumo] = useState(null);
    const [transacoes, setTransacoes] = useState([]);

    useEffect(() => {
        const buscarResumo = async () => {
            const token = localStorage.getItem("token");
            const response = await api.get('/api/resumo', {
                headers: { Authorization: `Bearer ${token}` }
        });
        setResumo(response.data);
    
        const resTransacoes = await api.get('/api/transacoes', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTransacoes(resTransacoes.data);  
        };
    buscarResumo();
}, []);


    return (
        <div className="min-h-screen bg-gray-900 p-8 pb-24">
            <h1 className="text-3xl font-bold text-white mb-6">Resumo do Mês</h1>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800 p-6 rounded-xl">
                    <p className="text-gray-400 text-sm">Saldo Total</p>
                    <p className="text-white text-2xl font-bold">R$ {resumo.saldo}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl">
                    <p className="text-gray-400 text-sm">Total de Entradas</p>
                    <p className="text-green-400 text-2xl font-bold">R$ {resumo.entradas}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl">
                    <p className="text-gray-400 text-sm">Total de Saídas</p>
                    <p className="text-red-400 text-2xl font-bold">R$ {resumo.saidas}</p>
                </div>
            </div>
        
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Transações Recentes</h2>
            {transacoes.slice().reverse().slice(0, 5).map((t) => (
                <div key={t.id} className="bg-gray-800 p-4 rounded-xl mb-2 flex justify-between">
                    <span className="text-white">{t.descricao}</span>
                    <span className={t.tipo === 'Entrada' ? 'text-green-400' : 'text-red-400'}>R$ {t.valor}</span>
                </div>
            ))}
        </div>


          <BottomNav />
        </div>


    );
}

export default Resumo;