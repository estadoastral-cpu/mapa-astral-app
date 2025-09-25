import React, { useState } from 'react';
import UserInputForm from './components/UserInputForm';
import AstralMapDisplay from './components/AstralMapDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { generateAstralMap } from './services/geminiService';
import type { UserData, AstralMapAnalysis } from './types';

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [analysis, setAnalysis] = useState<AstralMapAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: UserData) => {
    setUserData(data);
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await generateAstralMap(data);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUserData(null);
    setAnalysis(null);
    setIsLoading(false);
    setError(null);
  };

  return (
    <div className="app-container bg-stone-950 min-h-screen text-stone-200 font-sans bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">
            Bienvenido a tu Mapa Astral
          </h1>
          <p className="mt-4 text-lg text-stone-400 max-w-2xl mx-auto">
            Lee y recuerda quien eres.
          </p>
        </header>

        <div className="flex justify-center">
          {!analysis && !isLoading && <UserInputForm onSubmit={handleFormSubmit} />}
          {isLoading && <LoadingSpinner />}
          {error && (
             <div className="text-center p-8 bg-red-900/20 border border-red-500/50 rounded-lg">
                <h2 className="text-2xl font-bold text-red-400">Ocurrió un Error</h2>
                <p className="mt-2 text-red-300">{error}</p>
                <button onClick={handleReset} className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-500 rounded-md font-semibold">
                    Intentar de Nuevo
                </button>
             </div>
          )}
          {analysis && !isLoading && <AstralMapDisplay analysis={analysis} onReset={handleReset} />}
        </div>
      </main>
    </div>
  );
};

export default App;