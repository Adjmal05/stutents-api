import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await login({ email, password });
      } else {
        await register({ email, password });
      }
      navigate("/students");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-card__mark">§</div>
        <p className="auth-card__eyebrow">Registre des étudiants — HEI</p>
        <h1 className="auth-card__title">
          {mode === "login" ? "Accès au registre" : "Créer un accès"}
        </h1>
        <p className="auth-card__subtitle">
          {mode === "login"
            ? "Connecte-toi pour consulter et gérer les fiches étudiants."
            : "Crée un compte pour obtenir un accès au registre."}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field">
            <span>Adresse email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prenom.nom@hei.mg"
              required
            />
          </label>

          <label className="field">
            <span>Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Un instant…" : mode === "login" ? "Se connecter" : "Créer le compte"}
          </button>
        </form>

        <button
          type="button"
          className="auth-switch"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError(null);
          }}
        >
          {mode === "login"
            ? "Pas encore de compte ? Inscris-toi"
            : "Déjà un compte ? Connecte-toi"}
        </button>
      </div>
    </div>
  );
}
