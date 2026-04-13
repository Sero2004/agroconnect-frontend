import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext"; // 1. Importe useAuth
import Accueil from "./pages/Accueil";
import Admin from "./pages/Admin";
import Connexion from "./pages/Connexion";
import Dashboard from "./pages/Dashboard";
import Inscription from "./pages/Inscription";
import PaiementSucces from "./pages/PaiementSucces";
import PublierProduit from "./pages/PublierProduit";

// ... (tes autres imports)

function App() {
  const location = useLocation();
  const { user, loading } = useAuth(); // 2. Récupère loading

  const pagesPubliques = ["/connexion", "/inscription"];
  const afficherNavbar = !pagesPubliques.includes(location.pathname);

  // 3. SI L'APPLI CHARGE LA SESSION, ON N'AFFICHE RIEN (OU UN SPINNER)
  // Cela empêche la redirection sauvage vers /connexion
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        <p className="ml-3 text-green-800 font-medium">
          Chargement de votre session...
        </p>
      </div>
    );
  }

  return (
    <>
      {afficherNavbar && <Navbar />}
      <Routes>
        {/* Pages publiques */}
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />

        {/* Toutes les autres routes restent identiques */}
        <Route
          path="/"
          element={
            <ProtectedRoute roles={["agriculteur", "acheteur", "admin"]}>
              <Accueil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["agriculteur"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/publier"
          element={
            <ProtectedRoute roles={["agriculteur"]}>
              <PublierProduit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/modifier"
          element={
            <ProtectedRoute roles={["agriculteur"]}>
              <ModifierProduit />
            </ProtectedRoute>
          }
        />

        {/* Pages admin seulement */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Redirection par défaut */}
        <Route path="/paiement-succes" element={<PaiementSucces />} />
        <Route path="*" element={<Navigate to="/connexion" />} />
      </Routes>
    </>
  );
}

export default App;
