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
import Ujian from "./pages/Ujian";
import { Toaster, toast } from "./components/ui";
import { ActivationGate } from "./components/Activation";

// Sahkan kod tersimpan, dan aktifkan terus jika dibuka melalui pautan ?kod=PT-XXXX-XXXX-XXXX
const kodParam = new URLSearchParams(location.search).get("kod");
(async () => {
  if (kodParam) {
    const err = await activate(kodParam); // aktifkan dahulu supaya skrin kunci tidak berkelip
    history.replaceState(null, "", location.pathname + location.hash);
    setTimeout(() => toast(err ? `Kod dalam pautan tidak sah. ${err}` : "✅ Aplikasi diaktifkan. Selamat belajar!", err ? "err" : "ok"), 600);
  }
  await initActivation();
})();

export default function App() {
  const me = useMe();
  const act = useActivation();
  if (!act.ready) return <div className="grid min-h-dvh place-items-center text-sm text-slate-400">Memuatkan…</div>;
  if (!act.active) return <><ActivationGate /><Toaster /></>;
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
          <Route path="/ujian" element={<Ujian />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
