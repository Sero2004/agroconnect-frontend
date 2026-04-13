import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PaiementSucces() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirige vers l'accueil après 3 secondes
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          Paiement réussi !
        </h1>
        <p className="text-gray-600 mb-4">
          Merci {user?.prenoms} pour votre achat sur AgroConnect Bénin.
        </p>
        <p className="text-sm text-gray-400">
          Vous serez redirigé vers l'accueil dans 3 secondes...
        </p>
      </div>
    </div>
  );
}

export default PaiementSucces;
