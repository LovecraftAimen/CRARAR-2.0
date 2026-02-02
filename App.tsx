
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useUsuarios } from './hooks/useUsuarios';
import LoginForm from './components/LoginForm';
import AdminDashboard from './pages/AdminDashboard';
import AtendenteDashboard from './pages/AtendenteDashboard';
import { TooltipProvider } from './components/ui/tooltip';

/**
 * MainRouter handles the primary application routing logic based on user session and profile.
 * We use a standard function component here to avoid issues with React.FC's child prop expectations.
 */
const MainRouter = () => {
  const { session, profile, loading: authLoading } = useAuth();
  const { currentUsuario, loading: userLoading } = useUsuarios();

  if (authLoading || userLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-crarar-light">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-crarar-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-crarar-primary">Carregando CRARAR...</p>
        </div>
      </div>
    );
  }

  // Auth Logic
  if (currentUsuario) {
    return (
      <Routes>
        <Route path="/" element={<AtendenteDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  if (session) {
    return (
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return <LoginForm />;
};

/**
 * Main App component that initializes the router, auth, and tooltip providers.
 */
const App = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <TooltipProvider>
          <MainRouter />
        </TooltipProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
