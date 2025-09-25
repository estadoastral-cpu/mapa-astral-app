import React, { useEffect, useState } from 'react';

const loadingMessages = [
  "Consultando las energías cósmicas...",
  "Alineando los datos planetarios...",
  "Decodificando patrones numerológicos...",
  "Mapeando constelaciones familiares...",
  "Analizando improntas psicológicas...",
  "Conectando vías neuronales...",
  "Sintetizando tu mapa único...",
  "Canalizando tu esencia en una imagen...",
  "Pintando tu símbolo con luz estelar...",
];

const LoadingSpinner: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-stone-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
      <p className="text-lg font-semibold text-stone-300">{loadingMessages[messageIndex]}</p>
      <p className="text-stone-400">Esto puede tardar un momento.</p>
    </div>
  );
};

export default LoadingSpinner;