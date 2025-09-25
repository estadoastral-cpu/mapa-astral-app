import React from 'react';
import type { AstralMapAnalysis } from '../types';

interface PdfFullReportProps {
  analysis: AstralMapAnalysis;
}

const cleanAndFormatContent = (content: string) => {
    const cleaned = content.replace(/(?<!\n)\n(?!\n)/g, ' ').replace(/\n{2,}/g, '\n\n').trim();

    return cleaned.split('\n\n').map((paragraph, index) => {
        const trimmed = paragraph.trim();
        if (!trimmed) return null;

        const isTitle = (trimmed.length > 0 && trimmed.length < 80 && !trimmed.endsWith('.') && !trimmed.endsWith('?')) || (trimmed.includes(':') && trimmed.length < 80);
        
        if (isTitle) {
            return <h4 key={index} className="text-lg font-semibold text-purple-300/90 mt-6 mb-2">{trimmed}</h4>;
        }
        return <p key={index} className="mb-4">{trimmed}</p>;
    });
};

const PdfFullReport = React.forwardRef<HTMLDivElement, PdfFullReportProps>(({ analysis }, ref) => {
  const sections = {
    symbol: { title: "Tu Símbolo Visual", content: analysis.symbolicImage },
    numerology: { title: "Tus Números", content: analysis.numerology },
    family: { title: "Tus Raíces Familiares", content: analysis.family },
    wounds: { title: "Las Heridas como Guías", content: analysis.wounds },
    nlp: { title: "El Poder de Tu Lenguaje", content: analysis.nlp },
    cuento: { title: "Tu Cuento", content: analysis.cuento },
  };

  return (
    <div 
      ref={ref} 
      className="absolute top-0 left-[-9999px] w-[800px] bg-stone-950 text-stone-200 font-sans p-12"
    >
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">
          Tu Mapa Astral
        </h1>
        <p className="mt-4 text-lg text-stone-400">
          Lee y recuerda quien eres.
        </p>
      </header>
      
      <div className="mb-12 text-center break-inside-avoid">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400 mb-4">
          {sections.symbol.title}
        </h3>
        <div className="bg-black/20 p-2 rounded-lg inline-block">
          <img
            src={`data:image/png;base64,${sections.symbol.content}`}
            alt="Símbolo astral personal"
            className="rounded-md max-w-full h-auto object-contain aspect-square"
            style={{ maxWidth: '512px' }}
          />
        </div>
      </div>

      {Object.entries(sections).map(([key, section]) => {
        if (key === 'symbol') return null;
        return (
          <div key={key} className="mb-12 break-inside-avoid">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400 mb-6 pb-2 border-b border-stone-700">
              {section.title}
            </h3>
            <div className="prose prose-invert prose-stone max-w-none text-stone-300/90 leading-relaxed font-light">
              {cleanAndFormatContent(section.content)}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default PdfFullReport;