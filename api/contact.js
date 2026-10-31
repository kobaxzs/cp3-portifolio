import { tratarContato } from '../server/contact.js';
export default {
  fetch(solicitacao) {
    return tratarContato(solicitacao);
  },
};
