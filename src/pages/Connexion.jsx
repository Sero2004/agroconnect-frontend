import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Connexion() {
  const [email, setEmail] = useState("");
  const [mot_de_passe, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const { connexion } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    try {
      const res = await api.post("/auth/connexion", { email, mot_de_passe });
      connexion(res.data.user, res.data.token);
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-no-repeat bg-cover bg-center relative"
      style={{
        backgroundImage: `url('/src/assets/fresh-vegetables-fruit-market-stall.jpg')`,
      }}
    >
      {/* Overlay sombre pour améliorer le contraste */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* LE CONTENEUR EFFET VERRE (GLASSMORPHISM) */}
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/30 relative z-10">
        <h2 className="text-3xl font-bold text-white mb-2 text-center drop-shadow-md">
          🌱 AgroConnect
        </h2>
        <p className="text-center text-green-50 mb-8 text-sm font-medium">
          Heureux de vous revoir ! Connectez-vous.
        </p>

        {erreur && (
          <p className="bg-red-500/80 text-white px-4 py-2 rounded-xl mb-4 text-sm border border-red-400 text-center backdrop-blur-sm">
            {erreur}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-white mb-1 drop-shadow-sm">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Input semi-transparent aussi
              className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all backdrop-blur-sm"
              placeholder="votre@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1 drop-shadow-sm">
              Mot de passe
            </label>
            <input
              type="password"
              value={mot_de_passe}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all backdrop-blur-sm"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold transform active:scale-95 transition-all shadow-lg mt-2 border border-green-400"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm text-white mt-6">
          Pas encore de compte ?{" "}
          <Link
            to="/inscription"
            className="text-green-300 font-bold hover:underline drop-shadow-sm"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Connexion;
