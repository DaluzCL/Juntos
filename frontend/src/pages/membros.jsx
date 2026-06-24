import BottomNav from "../components/BottomNav";
import api from "../services/api";
import {useState, useEffect} from "react";


function Membros() {
    const [membros, setMembros] = useState ([]);
    const [grupo, setGrupo] = useState (null);
 
    //Chamadas para pegar a lista de membros e código do grupo
    useEffect(() => {
        const buscarMembros = async () => {
            const token = localStorage.getItem('token');
            const response = await api.get('/api/grupos/membros', {
                headers: {Authorization: `Bearer ${token}`}
            });
            setMembros(response.data);

            const resGrupo = await api.get('/api/grupos', {
                headers: {Authorization: `Bearer ${token}`}
            });
            setGrupo(resGrupo.data);
        };

        buscarMembros();
    }, []);

    //Visual
    return (
        <div className="min-h-screen bg-gray-900 p-8 pb-24">
            <h1 className="text-3xl font-bold text-white mb-6">MEMBROS</h1>

    {membros.map((m) => (
        <div key={m.id} className="bg-gray-800 p-4 rounded-xl mb-2 flex justify-between items-center relative">
            <p className="text-white">{m.nome}</p>
            <p className="text-gray-400 text-sm">{m.email}</p>
        </div>
    ))};

    <div className="bg-gray-800 p-4 rounded-xl mb-6 text-center">
        <p className="text-white text-sm font-bold">Código do grupo</p>
        <p className="text-green-400 text-xl font-bold">{grupo?.codigo_convite}</p>
    </div>


     <BottomNav />
        </div>
    );
}



export default Membros;