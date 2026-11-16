import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { activate, initActivation, useActivation } from "./lib/activation";
import { useMe } from "./lib/store";
import Layout from "./components/Layout";
import Welcome from "./pages/Welcome";
import LatihTubi from "./pages/LatihTubi";
import Sesi from "./pages/Sesi";
import Nota from "./pages/Nota";
import NotaBab from "./pages/NotaBab";
import Scoreboard from "./pages/Scoreboard";
import Profil from "./pages/Profil";
import { Toaster, toast } from "./components/ui";

// Sahkan kod tersimpan, dan aktifkan terus jika dibuka melalui pautan ?kod=PT-XXXX-XXXX-XXXX
const kodParam = new URLSearchParams(location.search).get("kod");
initActivation().then(async () => {
  if (!kodParam) return;
  const err = await activate(kodParam);
  history.replaceState(null, "", location.pathname + location.hash);
  setTimeout(() => toast(err ? `Kod tidak sah: ${err}` : "✅ Versi penuh diaktifkan melalui pautan. Selamat belajar!", err ? "err" : "ok"), 600);
});

export default function App() {
  const me = useMe();
  useActivation(); // render semula seluruh aplikasi apabila status pengaktifan berubah
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
