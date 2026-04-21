import { useLottie } from 'lottie-react';
import { useNavigate, useLocation } from 'react-router-dom';
import error404 from '../assets/error404.json';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const options = {
    animationData: error404,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfdfd] px-4 py-12">
      <div className="w-full max-w-4xl mb-4 transform scale-110"> 
        <div className="w-full h-auto drop-shadow-2xl">
          {View}
        </div>
      </div>
      
      <div className="text-center space-y-6 relative z-10">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
            Sayfa Bulunamadı
          </h1>
          <div className="bg-rose-50 border border-rose-100 px-6 py-3 rounded-2xl inline-block">
             <span className="text-slate-400 mr-2">Adres:</span>
             <code className="text-rose-600 font-mono font-bold text-lg">{location.pathname}</code>
          </div>
          <p className="text-2xl text-slate-500 font-medium max-w-lg mx-auto">
            Aradığınız yola ulaşılamadı. Muhtemelen bir yazım hatası var.
          </p>
        </div>
        
        <div className="pt-8">
          <button
            onClick={() => navigate('/')}
            className="px-14 py-6 bg-slate-900 text-white font-black text-xl rounded-[2rem] 
                       hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105 active:scale-95
                       shadow-2xl shadow-indigo-100 cursor-pointer flex items-center gap-4 mx-auto"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
