import { useState, useEffect} from "react";
import BottomNav from "../components/BottomNav";
import api from "../services/api";


function Resumo() {
    const [resumo, setResumo] = useState(null);

    useEffect(() => {
        const buscarResumo = async () => {
            const token = localStorage.getItem("token");
            const response = await api.get('/api/resumo', {
                headers: { Authorization: `Bearer ${token}` }
        });
        setResumo(response.data);
    };
    buscarResumo();
}, []);

    if (!resumo) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8">
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
          <BottomNav />
        </div>


    );
}

export default Resumo;