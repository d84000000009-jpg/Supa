import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const errorIcon = "https://cdn-icons-png.flaticon.com/512/564/564619.png"; // ícone de erro
const errorImg = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"; // imagem ilustrativa

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-4">
        <img src={errorIcon} alt="404 Icon" className="w-16 h-16 mb-2" />
        <h1 className="text-5xl font-extrabold text-pink-500 mb-2">404</h1>
        <p className="text-lg text-gray-700 mb-2 font-medium">Página não encontrada</p>
        <img src={errorImg} alt="Ilustração erro" className="w-full h-40 object-cover rounded-lg mb-2" />
        <p className="text-base text-gray-500 mb-4">Desculpe, não conseguimos encontrar a página que você procura.</p>
        <a href="/" className="inline-block px-6 py-2 bg-pink-500 text-white rounded-full shadow hover:bg-pink-600 transition">Voltar para o início</a>
      </div>
    </div>
  );
};

export default NotFound;
