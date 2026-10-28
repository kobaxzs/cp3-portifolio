import { handleContact } from '../server/contact.js';

export default {
  fetch(request) {
    return handleContact(request);
  },
};
