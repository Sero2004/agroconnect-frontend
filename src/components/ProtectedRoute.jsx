import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, roles }) {
  // 1. On récupère aussi "loading" depuis le contexte
  const { user, loading } = useAuth();

  // 2. TANT QUE ÇA CHARGE, ON N'AFFICHE RIEN (OU UN SPINNER)
  // C'est l'étape cruciale pour ne pas être déconnecté au retour de FedaPay
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // 3. Une fois que loading est FALSE, on vérifie si l'utilisateur existe
  if (!user) {
    return <Navigate to="/connexion" />;
  }

  // 4. Vérification des rôles
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
