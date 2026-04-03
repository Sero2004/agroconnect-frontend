import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Dashboard() {
  const { user } = useAuth();
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetchMesProduits();
  }, []);

  const fetchMesProduits = async () => {
    try {
      const res = await api.get("/produits/mes-produits");
      setProduits(res.data);
    } catch (err) {
      console.error("Erreur chargement produits", err);
    } finally {
      setChargement(false);
    }
  };

  const supprimerProduit = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      try {
        await api.delete(`/produits/${id}`);
        fetchMesProduits();
      } catch (err) {
        console.error("Erreur suppression", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-700">
              👨‍🌾 Mon Dashboard
            </h1>
            <p className="text-gray-500">
              Bonjour {user?.nom} {user?.prenoms} !
            </p>
          </div>
          <Link
            to="/publier"
            className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            + Publier un produit
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-3xl font-black text-green-700">
              {produits.length}
            </p>
            <p className="text-gray-500 text-sm mt-1">Produits publiés</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-3xl font-black text-green-700">{user?.ville}</p>
            <p className="text-gray-500 text-sm mt-1">Ma localisation</p>
          </div>
        </div>

        {/* Mes produits */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">🌾 Mes produits</h2>
          </div>

          {chargement ? (
            <div className="text-center py-20">
              <div className="animate-bounce text-4xl mb-4">🌱</div>
              <p className="text-gray-400">Chargement...</p>
            </div>
          ) : produits.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">📦</div>
              <p className="text-gray-500 mb-4">
                Vous n'avez pas encore publié de produit.
              </p>
              <Link
                to="/publier"
                className="bg-green-700 text-white px-5 py-2 rounded-xl font-semibold hover:bg-green-800 transition"
              >
                Publier mon premier produit
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {produits.map((produit) => (
                <div
                  key={produit.id}
                  className="p-5 flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-green-50 flex-shrink-0">
                      {produit.photo ? (
                        <img
                          src={produit.photo}
                          alt={produit.nom}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🌿
                        </div>
                      )}
                    </div>
                    {/* Infos */}
                    <div>
                      <p className="font-bold text-gray-800">{produit.nom}</p>
                      <p className="text-sm text-gray-500">
                        {Number(produit.prix).toLocaleString()} FCFA /{" "}
                        {produit.unite}
                      </p>
                      <p className="text-xs text-gray-400">{produit.ville}</p>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/modifier-produit/${produit.id}`}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      ✏️ Modifier
                    </Link>
                    <button
                      onClick={() => supprimerProduit(produit.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
