import { useNavigate } from "react-router-dom";
import { Home, ArrowLeftRight, Target, Users } from "lucide-react";

function BottomNav() {
    const navigate = useNavigate();

    return ( 

    <div className="fixed bottom-0 left-0 w-full bg-gray-800 p-4 flex justify-around">
        <div onClick={  () => navigate('/resumo') } className="text-white cursor-pointer flex flex-col items-center">
            <Home  size={24}/>
            <span className="text-xs mt-1">Resumo</span>
        </div>
        <div onClick={ () => navigate('/transacoes') } className="text-white cursor-pointer flex flex-col items-center">
            <ArrowLeftRight  size={24}/>
            <span className="text-xs mt-1">Transações</span>
        </div>
        <div onClick={ () => navigate('/metas') } className="text-white cursor-pointer flex flex-col items-center">
            <Target  size={24}/>
            <span className="text-xs mt-1">Metas</span>
        </div>
        <div onClick={ () => navigate('/membros') } className="text-white cursor-pointer flex flex-col items-center">
            <Users  size={24}/>
            <span className="text-xs mt-1">Membros</span>
        </div>
    </div>

    )};

    export default BottomNav;