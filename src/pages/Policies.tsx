import { ChevronLeft, FileText, Lock, Mail, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PolicyArticle from '../components/PolicyArticle';
import { CONTACT_EMAIL, KVKK_NOTICE, POLICY_DOCUMENTS, POLICY_UPDATED_AT, PRIVACY_POLICY, TERMS_OF_SERVICE } from '../content/policies';

const TOC = [
  { doc: PRIVACY_POLICY, icon: Lock },
  { doc: TERMS_OF_SERVICE, icon: FileText },
  { doc: KVKK_NOTICE, icon: UserCheck },
];

const Policies = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10 lg:py-16">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-slate-500 font-semibold mb-10 hover:text-emerald-700 transition-colors"
        >
          <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
            <ChevronLeft size={18} />
          </span>
          Anasayfaya Dön
        </button>

        <header className="mb-10">
          <p className="text-sm font-bold text-emerald-700 mb-3">Yasal Bilgilendirme</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Politikalar ve Koşullar</h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl">
            Seydi Rehber'i kullanırken hangi verilerinizin neden işlendiğini, haklarınızı ve uymanız gereken kuralları burada bulabilirsiniz.
          </p>
          <p className="mt-2 text-sm text-slate-400">Son güncelleme: {POLICY_UPDATED_AT}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          <aside>
            <div className="lg:sticky lg:top-8 space-y-4">
              <nav className="bg-white p-3 rounded-2xl border border-slate-200">
                {TOC.map(({ doc, icon: Icon }) => (
                  <a
                    key={doc.id}
                    href={`#${doc.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-semibold transition-colors"
                  >
                    <Icon size={18} className="text-emerald-600" />
                    {doc.title}
                  </a>
                ))}
              </nav>
              <div className="bg-emerald-700 p-5 rounded-2xl text-white">
                <p className="font-bold mb-1">Sorunuz veya talebiniz mi var?</p>
                <p className="text-emerald-50/90 text-sm mb-4">Veri silme ve KVKK başvuruları dahil her konuda yazabilirsiniz.</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex w-full items-center justify-center gap-2 py-2.5 bg-white text-emerald-800 font-bold rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  <Mail size={16} /> {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </aside>

          <div className="space-y-8 min-w-0">
            {POLICY_DOCUMENTS.map((doc) => (
              <PolicyArticle key={doc.id} doc={doc} headingLevel={2} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies;
