import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUsuarios } from "../hooks/useUsuarios";
import { PawPrint, LogIn, Lock, Mail, ShieldCheck } from "lucide-react";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn } = useAuth();
  const { loginUsuario } = useUsuarios();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const isAtendente = await loginUsuario(email, password);
      if (isAtendente) return;
      await signIn(email, password);
    } catch (err: any) {
      setError("Credenciais inválidas. Verifique seu email e senha.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-crarar-primary/20 via-crarar-primary to-crarar-primary/20"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-crarar-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-crarar-primary/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-[440px] animate-fade-in relative z-10">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-transparent shadow-xl shadow-crarar-primary/10 border border-gray-100 ring-4 ring-gray-50/50">
            {/* <PawPrint className="h-10 w-10 text-crarar-primary" /> */}
            <img
              src="CRARAR_logo.png"
              alt="Logo CRARAR"
              className="h-16 w-auto mb-2"
            />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-2">
            CRARAR
          </h1>
          <p className="mt-2 text-slate-500 font-medium">
            Gestão Veterinária Profissional de Presidente Dutra
          </p>
        </div>

        <div className="rounded-[32px] bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-crarar-primary transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-4 pl-12 pr-4 text-sm font-medium text-slate-700 focus:bg-white focus:border-crarar-primary focus:ring-4 focus:ring-crarar-primary/5 outline-none transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Senha
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-crarar-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-4 pl-12 pr-4 text-sm font-medium text-slate-700 focus:bg-white focus:border-crarar-primary focus:ring-4 focus:ring-crarar-primary/5 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 animate-slide-up">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-crarar-primary py-4 text-sm font-bold text-white shadow-lg shadow-crarar-primary/20 hover:shadow-crarar-primary/30 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <LogIn className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="h-px w-full bg-slate-100"></div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="h-3 w-3" /> Acesso Seguro Monitorado
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 font-medium">
            © {new Date().getFullYear()} CRARAR • Centro de Referência Animal
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
