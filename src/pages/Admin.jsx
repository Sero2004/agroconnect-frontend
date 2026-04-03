import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [agriculteurs, setAgriculteurs] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchAgriculteurs();
  }, []);

  const fetchAgriculteurs = async () => {
    try {
      const res = await api.get("/admin/agriculteurs");
      setAgriculteurs(res.data);
    } catch (err) {
      console.error("Erreur chargement agriculteurs", err);
    } finally {
      setChargement(false);
    }
  };

  const validerCompte = async (id) => {
    try {
      await api.put(`/admin/valider/${id}`);
      fetchAgriculteurs();
    } catch (err) {
      console.error("Erreur validation", err);
    }
  };

  const rejeterCompte = async (id) => {
    if (window.confirm("Voulez-vous vraiment rejeter ce compte ?")) {
      try {
        await api.delete(`/admin/rejeter/${id}`);
        fetchAgriculteurs();
      } catch (err) {
        console.error("Erreur rejet", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          🛡️ Interface Admin
        </h1>
        <p className="text-gray-500 mb-8">Gérez les comptes agriculteurs</p>

        {chargement ? (
          <div className="text-center py-20">
            <div className="animate-bounce text-4xl mb-4">🌱</div>
            <p className="text-gray-400">Chargement...</p>
          </div>
        ) : agriculteurs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-gray-500">
              Aucun compte en attente de validation.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {agriculteurs.map((agriculteur) => (
              <div
                key={agriculteur.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                    👨‍🌾
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">
                      {agriculteur.nom} {agriculteur.prenoms}
                    </p>
                    <p className="text-sm text-gray-500">{agriculteur.email}</p>
                    <p className="text-sm text-gray-500">
                      📞 {agriculteur.telephone} · 📍 {agriculteur.ville}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${agriculteur.email_verifie ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                      >
                        {agriculteur.email_verifie
                          ? "✅ Email vérifié"
                          : "❌ Email non vérifié"}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${agriculteur.compte_valide ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {agriculteur.compte_valide
                          ? "✅ Validé"
                          : "⏳ En attente"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!agriculteur.compte_valide && (
                    <button
                      onClick={() => validerCompte(agriculteur.id)}
                      className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      ✅ Valider
                    </button>
                  )}
                  <button
                    onClick={() => rejeterCompte(agriculteur.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    ❌ Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
