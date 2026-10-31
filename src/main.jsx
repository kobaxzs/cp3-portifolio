import { StrictMode as ModoEstrito } from 'react';
import { createRoot as criarRaiz } from 'react-dom/client';
import { RouterProvider as ProvedorRotas } from 'react-router/dom';
import { rotas } from './router.jsx';
import './styles.css';
criarRaiz(document.getElementById('root')).render(
  <ModoEstrito>
    <ProvedorRotas router={rotas} />
  </ModoEstrito>,
);
