
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { tailwindConfig } from './tailwind.config.ts';

// 1. Aplicação da configuração importada
const setupTailwind = () => {
  if ((window as any).tailwind) {
    (window as any).tailwind.config = tailwindConfig;
  }
};

// 2. Injeção de CSS Global via JS (para evitar dependência de arquivos .css externos em CDNs)
const injectBaseStyles = () => {
  const style = document.createElement('style');
  style.type = 'text/tailwindcss';
  style.innerHTML = `
    @layer base {
      body {
        @apply font-sans antialiased overflow-x-hidden;
      }
    }
    @layer components {
      .glass {
        @apply bg-white/80 backdrop-blur-md dark:bg-slate-900/80;
      }
      .scrollbar-green {
        scrollbar-width: thin;
        scrollbar-color: #3B7A57 transparent;
      }
      .scrollbar-green::-webkit-scrollbar { width: 6px; }
      .scrollbar-green::-webkit-scrollbar-track { background: transparent; }
      .scrollbar-green::-webkit-scrollbar-thumb { background: #3B7A57; border-radius: 10px; }
      
      .dark body { background-color: #020617 !important; color: #f8fafc !important; }
      .dark .bg-white { background-color: #0f172a !important; }
      .dark .bg-slate-50, .dark .bg-slate-100 { background-color: #020617 !important; }
      .dark .text-slate-900, .dark .text-crarar-text { color: #ffffff !important; }
      .dark .border-slate-100, .dark .border-slate-200 { border-color: #1e293b !important; }
    }
  `;
  document.head.appendChild(style);
};

// 3. Inicialização do Tema
const initTheme = () => {
  const theme = localStorage.getItem('theme') || 
               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Execução
setupTailwind();
injectBaseStyles();
initTheme();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
