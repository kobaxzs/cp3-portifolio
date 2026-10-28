import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';

export default function NotFoundPage() {
  return (
    <section className="container error-page">
      <span className="error-number">
        404<span>↗</span>
      </span>
      <p className="eyebrow">ESSA ROTA AINDA NÃO VIROU CÓDIGO</p>
      <h1>Parece que saímos do caminho.</h1>
      <p>A página que você procura não existe ou mudou de endereço.</p>
      <Link to="/" className="button">
        Voltar ao início <Icon name="right" size={18} />
      </Link>
    </section>
  );
}
