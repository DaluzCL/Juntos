import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login'
import Cadastro from './pages/cadastro';
import Grupos from './pages/grupos';
import Resumo from './pages/resumo';
import Transacoes from './pages/transacoes';
import Metas from './pages/metas';
import Membros from './pages/membros';
import RotaProtegida from './components/RotaProtegida';


function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/resumo" element={<RotaProtegida><Resumo /></RotaProtegida>} /> 
        <Route path="/transacoes" element={<RotaProtegida><Transacoes /></RotaProtegida>} />
        <Route path="/grupos" element={<RotaProtegida><Grupos /></RotaProtegida>} /> 
        <Route path="/metas" element={<RotaProtegida><Metas /></RotaProtegida>} />
        <Route path="/membros" element={<RotaProtegida><Membros /></RotaProtegida>} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;