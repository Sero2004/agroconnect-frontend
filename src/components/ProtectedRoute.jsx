import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  // Pas connecté → redirection vers connexion
  if (!user) {
    return <Navigate to="/connexion" />;
  }

  // Rôle non autorisé → redirection vers accueil
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
