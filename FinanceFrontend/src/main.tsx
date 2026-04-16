import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client.ts';
import { ToastProvider } from './components/Toast/utils/toast-provider.tsx';
import { AuthProvider } from './context/auth-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ApolloProvider client={client}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ApolloProvider>
    </AuthProvider>
  </StrictMode>,
);
