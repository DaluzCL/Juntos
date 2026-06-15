import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login'
import Cadastro from './pages/cadastro';
import Grupos from './pages/Grupos';
import RotaProtegida from './components/RotaProtegida';


function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/resumo" element={<RotaProtegida><div>Resumo</div></RotaProtegida>} />
        <Route path="/grupos" element={<RotaProtegida><Grupos /></RotaProtegida>} /> 
      </Routes>
    </BrowserRouter>
  );
}


export default App;