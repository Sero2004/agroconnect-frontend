import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Accueil() {
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState("");
  const [villeFiltre, setVilleFiltre] = useState("");

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await api.get("/produits");
        setProduits(res.data);
      } catch (err) {
        console.error("Erreur chargement produits", err);
      } finally {
        setChargement(false);
      }
    };
    fetchProduits();
  }, []);

  const villes = [...new Set(produits.map((p) => p.ville).filter(Boolean))];

  const [categorieFiltre, setCategorieFiltre] = useState("");

  const CATEGORIES = [
    { label: "Tous", emoji: "🌿", valeur: "" },
    { label: "Céréales", emoji: "🌾", valeur: "cereale" },
    { label: "Légumes", emoji: "🥦", valeur: "legume" },
    { label: "Fruits", emoji: "🍍", valeur: "fruit" },
    { label: "Tubercules", emoji: "🥔", valeur: "tubercule" },
    { label: "Légumineuses", emoji: "🫘", valeur: "legumineuse" },
    { label: "Épices", emoji: "🌶️", valeur: "epice" },
  ];

  const { user } = useAuth();
  // Assure-toi que ce hook est bien défini et fonctionne pour récupérer les infos utilisateur
  const handleAchat = async (produit) => {
    // 1. Récupérer le token
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Vous devez être connecté pour acheter un produit.");
      // Optionnel : rediriger vers /connexion
      return;
    }

    try {
      const response = await fetch(
        "https://agroconnect-backend-djtm.onrender.com/api/paiement/creer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 2. ENVOYER LE TOKEN ICI (Très important)
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            montant: produit.prix,
            produit_nom: produit.nom,
            // Récupère les infos réelles si tu les as, sinon laisse FedaPay les demander au client
            email_client: user.email,
            nom_client: user.nom,
            prenom_client: user.prenoms,
          }),
        },
      );
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirection vers FedaPay
      }
    } catch (error) {
      console.error("Erreur paiement :", error);
      alert("Une erreur est survenue lors de la préparation du paiement.");
    }
  };

  const produitsFiltres = produits.filter((p) => {
    const matchRecherche = p.nom
      ?.toLowerCase()
      .includes(recherche.toLowerCase());
    const matchVille = villeFiltre ? p.ville === villeFiltre : true;
    const matchCategorie = categorieFiltre
      ? p.categorie === categorieFiltre
      : true;
    return matchRecherche && matchVille && matchCategorie;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {/* Hero Section */}
      <div
        className="text-white py-24 px-6 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/bg-connexion.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            🌱 Bienvenue sur AgroConnect Bénin
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            Achetez directement auprès des agriculteurs béninois — frais, local
            et sans intermédiaires.
          </p>

          {/* Barre de recherche améliorée */}
          <div className="flex flex-col md:flex-row gap-2 max-w-xl mx-auto mb-10">
            {/* Barre de recherche améliorée */}
            <div className="flex flex-col md:flex-row gap-2 max-w-xl mx-auto mb-10 bg-white rounded-2xl p-2 shadow-2xl">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 bg-transparent focus:outline-none font-medium"
                />
              </div>
              <select
                value={villeFiltre}
                onChange={(e) => setVilleFiltre(e.target.value)}
                className="px-4 py-3 rounded-xl text-gray-600 bg-gray-100 focus:outline-none cursor-pointer font-medium"
              >
                <option value="">Toutes les villes</option>
                {villes.map((ville) => (
                  <option key={ville} value={ville}>
                    {ville}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats dans le hero */}
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <p className="text-3xl font-black">{produits.length}</p>
            <p className="text-xs text-gray-300 uppercase tracking-wider">
              Produits
            </p>
          </div>
          <div className="w-px bg-white/20"></div>
          <div className="text-center">
            <p className="text-3xl font-black">{villes.length}</p>
            <p className="text-xs text-gray-300 uppercase tracking-wider">
              Villes
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black">
              {/* On filtre pour être sûr de n'avoir que des nombres valides */}
              {
                [
                  ...new Set(
                    produits
                      .map((p) => p.user_id)
                      .filter((id) => id !== undefined && id !== null),
                  ),
                ].length
              }
            </p>
            <p className="text-xs text-gray-300 uppercase tracking-wider">
              Agriculteurs
            </p>
          </div>
        </div>
      </div>

      {/* Catégories */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.valeur}
              onClick={() => setCategorieFiltre(cat.valeur)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                categorieFiltre === cat.valeur
                  ? "bg-green-700 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-400 hover:text-green-700"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      {/* Grille Produits */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🌾 Produits disponibles
          {recherche && (
            <span className="text-base font-normal text-gray-400 ml-2">
              — résultats pour "{recherche}"
            </span>
          )}
        </h2>

        {chargement ? (
          <div className="text-center py-20">
            <div className="animate-bounce text-4xl mb-4">🌱</div>
            <p className="text-gray-400">Récolte des produits en cours...</p>
          </div>
        ) : produitsFiltres.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-500 font-medium">Aucun produit trouvé.</p>
            <button
              onClick={() => {
                setRecherche("");
                setVilleFiltre("");
              }}
              className="mt-4 text-green-700 hover:underline text-sm"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {produitsFiltres.map((produit) => (
              <div
                key={produit.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col"
              >
                {/* Image */}
                <div className="h-52 overflow-hidden bg-gray-100 relative">
                  {produit.photo ? (
                    <img
                      src={produit.photo}
                      alt={produit.nom}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-green-50">
                      <span className="text-6xl">🌿</span>
                    </div>
                  )}
                  {/* Badge ville */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      📍 {produit.ville}
                    </span>
                  </div>
                  {/* Badge unité */}
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-green-700/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {produit.unite}
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-green-700 transition-colors">
                    {produit.nom}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 italic">
                    {produit.description || "Pas de description."}
                  </p>

                  <div className="mt-auto">
                    {/* Prix */}
                    <div className="bg-green-50 rounded-xl px-4 py-3 mb-4 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                          Prix
                        </p>
                        <p className="text-2xl font-black text-green-700">
                          {Number(produit.prix).toLocaleString()}
                          <span className="text-sm font-normal text-gray-500">
                            {" "}
                            FCFA
                          </span>
                        </p>
                      </div>
                      {produit.quantite && (
                        <div className="text-right">
                          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                            Stock
                          </p>
                          <p className="text-sm font-bold text-gray-600">
                            {produit.quantite} {produit.unite}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Vendeur + Contact */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">
                          👨‍🌾
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-700">
                            {produit.vendeur_nom} {produit.vendeur_prenoms}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {produit.vendeur_tel}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={"tel:" + produit.vendeur_tel}
                          className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                        >
                          📞
                        </a>
                        <a
                          href={"https://wa.me/229" + produit.vendeur_tel}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-[#25D366] hover:bg-[#1ebe57] text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                        >
                          💬
                        </a>
                      </div>
                    </div>
                    <div className="my-4 border-t border-gray-200">
                      {/* BOUTON ACHETER PRINCIPAL */}
                      <button
                        onClick={() => handleAchat(produit)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-md shadow-green-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <span>🛒</span> Passer commande
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12 px-6 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo + description */}
            <div>
              <p className="text-xl font-bold mb-2">🌱 AgroConnect Bénin</p>
              <p className="text-green-300 text-sm">
                La plateforme qui valorise nos terres et soutient nos
                agriculteurs en éliminant les intermédiaires.
              </p>
            </div>
            {/* Liens */}
            <div>
              <p className="font-bold mb-3 text-green-300 uppercase text-xs tracking-wider">
                Navigation
              </p>
              <div className="flex flex-col gap-2 text-sm text-green-200">
                <a href="/" className="hover:text-white transition">
                  🏠 Accueil
                </a>
                <a href="/inscription" className="hover:text-white transition">
                  📝 S'inscrire
                </a>
                <a href="/connexion" className="hover:text-white transition">
                  🔐 Se connecter
                </a>
              </div>
            </div>
            {/* Contact */}
            <div>
              <p className="font-bold mb-3 text-green-300 uppercase text-xs tracking-wider">
                Contact
              </p>
              <div className="flex flex-col gap-2 text-sm text-green-200">
                <p>📍 Cotonou, Bénin</p>
                <p>📧 contact@agroconnect.bj</p>
                <p>📞 +229 00 00 00 00</p>
              </div>
            </div>
          </div>
          <div className="border-t border-green-800 pt-6 text-center text-green-500 text-xs">
            &copy; 2026 AgroConnect — République du Bénin · Tous droits réservés
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Accueil;
