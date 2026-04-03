import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Accueil from "./pages/Accueil";
import Admin from "./pages/Admin";
import Connexion from "./pages/Connexion";
import Dashboard from "./pages/Dashboard";
import Inscription from "./pages/Inscription";
import ModifierProduit from "./pages/ModifierProduit";
import PublierProduit from "./pages/PublierProduit";

function App() {
  const location = useLocation();
  const pagesPubliques = ["/connexion", "/inscription"];
  const afficherNavbar = !pagesPubliques.includes(location.pathname);

  return (
    <>
      {afficherNavbar && <Navbar />}
      <Routes>
        {/* Pages publiques */}
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />

        {/* Pages accessibles à tous les connectés */}
        <Route
          path="/"
          element={
            <ProtectedRoute roles={["agriculteur", "acheteur", "admin"]}>
              <Accueil />
            </ProtectedRoute>
          }
        />

        {/* Pages agriculteur seulement */}
        <Route
          path="/publier"
          element={
            <ProtectedRoute roles={["agriculteur"]}>
              <PublierProduit />
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
          path="/modifier-produit/:id"
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
        <Route path="*" element={<Navigate to="/connexion" />} />
      </Routes>
    </>
  );
}

export default App;
