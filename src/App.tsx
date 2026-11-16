import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { useMe } from "./lib/store";
import Layout from "./components/Layout";
import Welcome from "./pages/Welcome";
import LatihTubi from "./pages/LatihTubi";
import Sesi from "./pages/Sesi";
import Nota from "./pages/Nota";
import NotaBab from "./pages/NotaBab";
import Scoreboard from "./pages/Scoreboard";
import Profil from "./pages/Profil";
import { Toaster } from "./components/ui";

export default function App() {
  const me = useMe();
  if (!me) return <><Welcome /><Toaster /></>;
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LatihTubi />} />
          <Route path="/latih/sesi" element={<Sesi />} />
          <Route path="/nota" element={<Nota />} />
          <Route path="/nota/:id" element={<NotaBab />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
