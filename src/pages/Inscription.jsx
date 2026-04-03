import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Inscription() {
  const [form, setForm] = useState({
    nom: "",
    prenoms: "",
    email: "",
    mot_de_passe: "",
    role: "agriculteur",
    telephone: "",
    ville: "",
  });
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const VILLES_BENIN = [
    "Abomey",
    "Abomey-Calavi",
    "Allada",
    "Aplahoué",
    "Banikoara",
    "Bassinila",
    "Bembéréké",
    "Berboui",
    "Bohicon",
    "Cotonou",
    "Covè",
    "Dassa-Zoumé",
    "Djougou",
    "Dogbo-Tota",
    "Ganvié",
    "Grand-Popo",
    "Kandi",
    "Kérou",
    "Kétou",
    "Lalo",
    "Lokossa",
    "Malanville",
    "Natitingou",
    "N'Dali",
    "Nikki",
    "Ouidah",
    "Parakou",
    "Pobè",
    "Porto-Novo",
    "Sakété",
    "Savalou",
    "Savè",
    "Tanguiéta",
    "Tchaourou",
    "Zagnanado",
  ].sort(); // .sort() permet de les ranger par ordre alphabétique automatiquement

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur(""); // 👈 efface l'erreur avant chaque tentative
    setSucces("");
    try {
      await api.post("/auth/inscription", form);
      setSucces("Inscription réussie ✅");
      setTimeout(() => navigate("/connexion"), 1500);
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur inscription");
    }
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center bg-no-repeat bg-cover bg-center relative py-8 overflow-y-auto"
      style={{
        backgroundImage: `url('/fresh-vegetables-fruit-market-stall.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      {/* LE CONTENEUR EFFET VERRE (GLASSMORPHISM) */}
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/30 relative z-10">
        <h2 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-md">
          🌱 Créer un compte
        </h2>

        {erreur && (
          <p className="bg-red-500/80 text-white px-4 py-2 rounded-xl mb-4 text-sm border border-red-400 text-center backdrop-blur-sm">
            {erreur}
          </p>
        )}

        {succes && (
          <p className="bg-green-500/30 backdrop-blur-md text-white px-4 py-2 rounded-xl mb-4 text-sm border border-green-400/50 text-center shadow-lg">
            {succes}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Ligne Nom et Prénoms */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-white mb-1 drop-shadow-sm">
                Nom
              </label>
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all backdrop-blur-sm"
                placeholder="Koffi"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-white mb-1 drop-shadow-sm">
                Prénoms
              </label>
              <input
                type="text"
                name="prenoms"
                value={form.prenoms}
                onChange={handleChange}
                className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all backdrop-blur-sm"
                placeholder="Agbessi"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-white mb-1 drop-shadow-sm">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all backdrop-blur-sm"
              placeholder="exemple@gmail.com"
              required
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-semibold text-white mb-1 drop-shadow-sm">
              Mot de passe
            </label>
            <input
              type="password"
              name="mot_de_passe"
              value={form.mot_de_passe}
              onChange={handleChange}
              className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all backdrop-blur-sm"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Téléphone et Ville */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-white mb-1 drop-shadow-sm">
                Téléphone
              </label>
              <input
                type="text"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all backdrop-blur-sm"
                placeholder="97000000"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-white mb-1 drop-shadow-sm">
                Ville
              </label>
              <div className="relative">
                <select
                  name="ville"
                  value={form.ville}
                  onChange={handleChange}
                  className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all backdrop-blur-sm cursor-pointer appearance-none"
                  required
                >
                  <option value="" className="text-gray-800">
                    Choisir une ville
                  </option>
                  {VILLES_BENIN.map((ville) => (
                    <option key={ville} value={ville} className="text-gray-800">
                      {ville}
                    </option>
                  ))}
                </select>

                {/* Petite flèche personnalisée car "appearance-none" cache la flèche par défaut */}
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-white/60">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Rôle / Sélecteur */}
          <div>
            <label className="block text-sm font-semibold text-white mb-1 drop-shadow-sm">
              Je suis
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all backdrop-blur-sm cursor-pointer appearance-none"
              style={{ colorScheme: "dark" }} // Aide à garder les options lisibles sur certains navigateurs
            >
              <option value="agriculteur" className="text-gray-800">
                🌾 Agriculteur
              </option>
              <option value="acheteur" className="text-gray-800">
                🛒 Acheteur
              </option>
            </select>
          </div>

          {/* Bouton Submit */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold transform active:scale-95 transition-all shadow-lg mt-2 border border-green-400/50"
          >
            Créer mon compte
          </button>
        </form>

        <p className="text-center text-sm text-white mt-6">
          Déjà un compte ?{" "}
          <Link
            to="/connexion"
            className="text-green-300 font-bold hover:underline drop-shadow-sm"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Inscription;
