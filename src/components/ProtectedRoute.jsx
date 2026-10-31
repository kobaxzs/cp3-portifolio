import { Navigate as Redirecionar } from 'react-router';
import { useAutenticacao } from '../hooks/AuthContext.js';
import { EstadoErro, EstadoCarregamento } from './Feedback.jsx';
export default function RotaProtegida({ children: conteudo }) {
  const { carregando, dono, erro, tentarNovamente } = useAutenticacao();
  if (carregando) return <EstadoCarregamento texto="Verificando acesso…" />;
  if (erro) return <EstadoErro mensagem={erro} aoTentarNovamente={tentarNovamente} />;
  if (!dono) return <Redirecionar to="/login" replace />;
  return conteudo;
}
