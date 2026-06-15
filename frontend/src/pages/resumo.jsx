import { useState, useEffect} from "react";
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
        <div>
            <h1>Resumo</h1>
            <p>Entradas: {resumo.entradas}</p>
            <p>Saidas: {resumo.saidas}</p>
            <p>Saldo: {resumo.saldo}</p>
        </div>
    );
}

export default Resumo;