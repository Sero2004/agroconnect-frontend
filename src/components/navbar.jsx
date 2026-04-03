import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, deconnexion } = useAuth();
  const navigate = useNavigate();

  const handleDeconnexion = () => {
    deconnexion();
    navigate("/connexion");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">🌱</span>
        <div>
          <p className="text-green-700 font-black text-lg leading-none">
            AgroConnect
          </p>
          <p className="text-gray-400 text-[10px] leading-none tracking-widest uppercase">
            Bénin
          </p>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex gap-3 items-center">
        {user ? (
          <>
            <span className="text-sm text-gray-600 hidden md:block">
              👋{" "}
              <span className="font-semibold">
                {user.nom} {user.prenoms}
              </span>
            </span>

            {/* Liens agriculteur */}
            {user.role === "agriculteur" && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-green-700 text-sm font-medium transition"
                >
                  📊 Dashboard
                </Link>
                <Link
                  to="/publier"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-1"
                >
                  <span>+</span> Publier
                </Link>
              </>
            )}

            {/* Lien admin */}
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
              >
                🛡️ Admin
              </Link>
            )}

            <button
              onClick={handleDeconnexion}
              className="border border-red-300 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg text-sm transition"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link
              to="/connexion"
              className="text-gray-600 hover:text-green-700 text-sm font-medium transition"
            >
              Connexion
            </Link>
            <Link
              to="/inscription"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
            >
              S'inscrire
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
