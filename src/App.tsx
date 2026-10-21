import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing';
import About from './pages/About';
import Privacy from './pages/Privacy';
import KVKK from './pages/KVKK';
import Policies from './pages/Policies';
import NotFound from './pages/NotFound';
import EsnafApp from './apps/esnaf/EsnafApp';
import AdminApp from './apps/admin/AdminApp';
import { Seo } from './components/Seo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/about"
          element={
            <>
              <Seo
                title="Hakkımızda | Seydi Rehber"
                description="Seydi Rehber'i kimler geliştiriyor? Seydişehir için hazırlanan ücretsiz şehir rehberi uygulamasının hikâyesi ve hedefleri."
                path="/about"
              />
              <About />
            </>
          }
        />
        <Route
          path="/privacy"
          element={
            <>
              <Seo
                title="Gizlilik Politikası | Seydi Rehber"
                description="Seydi Rehber uygulamasında kişisel verilerin nasıl toplandığı, kullanıldığı ve korunduğu."
                path="/privacy"
              />
              <Privacy />
            </>
          }
        />
        <Route
          path="/kvkk"
          element={
            <>
              <Seo
                title="KVKK Aydınlatma Metni | Seydi Rehber"
                description="6698 sayılı KVKK kapsamında Seydi Rehber kullanıcılarına yönelik aydınlatma metni."
                path="/kvkk"
              />
              <KVKK />
            </>
          }
        />
        <Route
          path="/politikalar"
          element={
            <>
              <Seo
                title="Gizlilik ve Kullanım Politikaları | Seydi Rehber"
                description="Seydi Rehber kullanım koşulları, topluluk kuralları, gizlilik ve veri silme politikaları."
                path="/politikalar"
              />
              <Policies />
            </>
          }
        />
        {/* Paneller ve 404 arama motorlarında listelenmez */}
        <Route
          path="/esnaf/*"
          element={
            <>
              <Seo title="Esnaf Paneli | Seydi Rehber" noindex />
              <EsnafApp />
            </>
          }
        />
        <Route
          path="/admin/*"
          element={
            <>
              <Seo title="Yönetim Paneli | Seydi Rehber" noindex />
              <AdminApp />
            </>
          }
        />
        <Route
          path="*"
          element={
            <>
              <Seo title="Sayfa bulunamadı | Seydi Rehber" noindex />
              <NotFound />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
