const caminhos = {
  seta: 'M7 17 17 7M7 7h10v10',
  direita: 'M5 12h14m-6-6 6 6-6 6',
  sol: 'M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  lua: 'M20.9 13a9 9 0 0 1-9.9-9.9A9 9 0 1 0 20.9 13Z',
  codigo: 'm8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18',
  github:
    'M9 19c-4.3 1.3-4.3-2-6-2m12 5v-3.5a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6A4.7 4.7 0 0 0 18.4 7a4.3 4.3 0 0 0-.1-3.2S17.3 3.5 15 5a11 11 0 0 0-6 0C6.7 3.5 5.7 3.8 5.7 3.8A4.3 4.3 0 0 0 5.6 7a4.7 4.7 0 0 0-1.3 3.2c0 4.7 2.8 5.7 5.5 6A3 3 0 0 0 9 18.5V22',
  email: 'M3 5h18v14H3V5Zm0 1 9 7 9-7',
  confirmar: 'm5 12 4 4L19 6',
  asterisco: 'M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4 18.4 5.6',
  menu: 'M4 6h16M4 12h16M4 18h16',
  fechar: 'm6 6 12 12M6 18 18 6',
  estrela: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z',
  ramificacao:
    'M6 6v12m0-7c0 3 12 2 12-5M8 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm0 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM20 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
};
export default function Icone({ nome, tamanho = 20, ...propriedades }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...propriedades}
    >
      <path d={caminhos[nome] || caminhos.seta} />
    </svg>
  );
}
