import { Link as LinkInterno } from 'react-router';
import Icone from '../components/Icon.jsx';
export default function PaginaNaoEncontrada() {
  return (
    <section className="container error-page">
      <span className="error-number">
        404<span>↗</span>
      </span>
      <p className="eyebrow">ESSA ROTA AINDA NÃO VIROU CÓDIGO</p>
      <h1>Parece que saímos do caminho.</h1>
      <p>A página que você procura não existe ou mudou de endereço.</p>
      <LinkInterno to="/" className="button">
        Voltar ao início <Icone nome="direita" tamanho={18} />
      </LinkInterno>
    </section>
  );
}
