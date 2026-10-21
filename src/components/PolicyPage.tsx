import { ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PolicyArticle from './PolicyArticle';
import type { PolicyDocument } from '../content/policies';

// /privacy ve /kvkk gibi tek metinli sayfalar; tüm metinler /politikalar'da.
const PolicyPage = ({ doc }: { doc: PolicyDocument }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 lg:py-16 px-5 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-emerald-700 font-bold mb-8 hover:gap-3 transition-all"
        >
          <ChevronLeft size={20} /> Anasayfaya Dön
        </button>
        <PolicyArticle doc={doc} />
        <p className="mt-6 text-center text-sm text-slate-500">
          Gizlilik Politikası, Kullanım Koşulları ve KVKK Aydınlatma Metninin tamamı:{' '}
          <Link to="/politikalar" className="font-semibold text-emerald-700 hover:underline">Politikalar ve Koşullar</Link>
        </p>
      </div>
    </div>
  );
};

export default PolicyPage;
