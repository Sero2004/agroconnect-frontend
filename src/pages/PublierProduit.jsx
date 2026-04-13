import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { uploadImage } from "../services/cloudinary";

const VILLES_BENIN = [
  "Abomey",
  "Abomey-Calavi",
  "Allada",
  "Aplahoué",
  "Banikoara",
  "Bembéréké",
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
].sort();

function PublierProduit() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    categorie: "",
    description: "",
    prix: "",
    quantite: "",
    unite: "kg",
    ville: user?.ville || "",
  });
  const [fichierPhoto, setFichierPhoto] = useState(null);
  const [apercu, setApercu] = useState(null);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");
  const [chargement, setChargement] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErreur("L'image est trop lourde (Max 2 Mo).");
        return;
      }
      setErreur("");
      setFichierPhoto(file);
      setApercu(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    if (Number(form.prix) <= 0) {
      setErreur("Le prix doit être supérieur à 0.");
      return;
    }
    if (Number(form.quantite) <= 0) {
      setErreur("La quantité doit être supérieure à 0.");
      return;
    }
    setChargement(true);
    try {
      let photoUrl = "";
      if (fichierPhoto) photoUrl = await uploadImage(fichierPhoto);
      await api.post("/produits", { ...form, photo: photoUrl });
      setSucces("Produit publié avec succès ✅");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de la publication");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative py-10 px-4"
      style={{ backgroundImage: `url('/bg-connexion.jpg')` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Formulaire glassmorphism */}
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-white/30 relative z-10">
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="text-white/70 hover:text-white flex items-center gap-1 text-sm transition-all mb-6"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 text-center drop-shadow-md">
          🌾 Publier un produit
        </h2>

        {erreur && (
          <p className="bg-red-500/80 text-white px-4 py-2 rounded-xl mb-4 text-sm border border-red-400 text-center">
            ⚠️ {erreur}
          </p>
        )}
        {succes && (
          <p className="bg-green-500/30 text-white px-4 py-2 rounded-xl mb-4 text-sm border border-green-400/50 text-center">
            {succes}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nom + Catégorie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-1 uppercase">
                Nom du produit
              </label>
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                placeholder="Ex: Manioc"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white mb-1 uppercase">
                Catégorie
              </label>
              <select
                name="categorie"
                value={form.categorie}
                onChange={handleChange}
                className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all appearance-none"
                required
              >
                <option value="" className="text-black">
                  Choisir une catégorie
                </option>
                <option value="cereale" className="text-black">
                  🌾 Céréales
                </option>
                <option value="legume" className="text-black">
                  🥦 Légumes
                </option>
                <option value="fruit" className="text-black">
                  🍍 Fruits
                </option>
                <option value="tubercule" className="text-black">
                  🥔 Tubercules
                </option>
                <option value="legumineuse" className="text-black">
                  🫘 Légumineuses
                </option>
                <option value="epice" className="text-black">
                  🌶️ Épices
                </option>
                <option value="autre" className="text-black">
                  🌿 Autre
                </option>
              </select>
            </div>
          </div>

          {/* Prix + Quantité + Unité */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-1 uppercase">
                Prix (FCFA)
              </label>
              <input
                type="number"
                name="prix"
                value={form.prix}
                onChange={handleChange}
                className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white mb-1 uppercase">
                Quantité
              </label>
              <input
                type="number"
                name="quantite"
                value={form.quantite}
                onChange={handleChange}
                className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white mb-1 uppercase">
                Unité
              </label>
              <select
                name="unite"
                value={form.unite}
                onChange={handleChange}
                className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all appearance-none"
              >
                <option value="kg" className="text-black">
                  kg
                </option>
                <option value="g" className="text-black">
                  g
                </option>
                <option value="sac" className="text-black">
                  sac
                </option>
                <option value="tonne" className="text-black">
                  tonne
                </option>
                <option value="unité" className="text-black">
                  unité
                </option>
                <option value="litre" className="text-black">
                  litre
                </option>
              </select>
            </div>
          </div>

          {/* Ville */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1 uppercase">
              Ville
            </label>
            <select
              name="ville"
              value={form.ville}
              onChange={handleChange}
              className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all appearance-none"
              required
            >
              <option value="" className="text-black">
                Choisir une commune
              </option>
              {VILLES_BENIN.map((v) => (
                <option key={v} value={v} className="text-black">
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1 uppercase">
              Description (Optionnel)
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              placeholder="Récolte fraîche du matin..."
            />
          </div>

          {/* Photo */}
          <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
            <label className="block text-xs font-semibold text-white mb-2 uppercase">
              Photo du produit
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhoto}
              className="text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-600 file:text-white cursor-pointer"
            />
            {apercu && (
              <img
                src={apercu}
                alt="Aperçu"
                className="mt-4 rounded-xl h-32 w-full object-cover border border-white/30"
              />
            )}
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={chargement}
            className="bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold transform active:scale-95 transition-all shadow-lg mt-2 border border-green-400/50 disabled:opacity-50"
          >
            {chargement ? "Publication en cours..." : "Publier maintenant 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PublierProduit;
