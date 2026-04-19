import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing';
import About from './pages/About';
import Privacy from './pages/Privacy';
import KVKK from './pages/KVKK';
import EsnafApp from './apps/esnaf/EsnafApp';
import AdminApp from './apps/admin/AdminApp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/kvkk" element={<KVKK />} />
        <Route path="/esnaf/*" element={<EsnafApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </Router>
  );
}

export default App;
