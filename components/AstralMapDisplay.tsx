import React, { useState, useRef } from 'react';
import type { AstralMapAnalysis } from '../types';
import AnalysisCard from './AnalysisCard';
import HumanSilhouette from './HumanSilhouette';
import PdfFullReport from './PdfFullReport';

// Make TypeScript aware of the libraries loaded from the script tags
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

// Type for the keys of analysis sections
type TopicKey = 'symbol' | 'numerology' | 'family' | 'wounds' | 'nlp' | 'cuento';


interface AstralMapDisplayProps {
  analysis: AstralMapAnalysis;
  onReset: () => void;
}

const cleanAndFormatContent = (content: string) => {
    // 1. Replace single newlines (that are not part of a double newline) with a space to join broken sentences.
    // 2. Normalize multiple newlines into a single double newline for consistent paragraph breaks.
    // 3. Trim whitespace from the start and end.
    const cleaned = content.replace(/(?<!\n)\n(?!\n)/g, ' ').replace(/\n{2,}/g, '\n\n').trim();

    return cleaned.split('\n\n').map((paragraph, index) => {
        const trimmed = paragraph.trim();
        if (!trimmed) return null; // Don't render empty paragraphs

        // More robust title detection: it's a title if it's short and doesn't end with a period, or it contains a colon.
        const isTitle = (trimmed.length > 0 && trimmed.length < 80 && !trimmed.endsWith('.') && !trimmed.endsWith('?')) || (trimmed.includes(':') && trimmed.length < 80);

        if (isTitle) {
            return <h4 key={index} className="text-lg font-semibold text-purple-300/90 mt-6 mb-2 !important">{trimmed}</h4>;
        }
        return <p key={index} className="mb-4">{trimmed}</p>;
    });
};


const AstralMapDisplay: React.FC<AstralMapDisplayProps> = ({ analysis, onReset }) => {
  const [activeTopic, setActiveTopic] = useState<TopicKey>('symbol');
  const [isDownloading, setIsDownloading] = useState(false);
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const fullPdfRef = useRef<HTMLDivElement>(null); // Ref for the full report component

  const analysisSections: { [key in TopicKey]: { title: string; content: string; icon: TopicKey } } = {
    symbol: { title: "Tu Símbolo Visual", content: analysis.symbolicImage, icon: 'symbol' },
    numerology: { title: "Tus Números", content: analysis.numerology, icon: 'numerology' },
    family: { title: "Tus Raíces Familiares", content: analysis.family, icon: 'family' },
    wounds: { title: "Las Heridas como Guías", content: analysis.wounds, icon: 'wounds' },
    nlp: { title: "El Poder de Tu Lenguaje", content: analysis.nlp, icon: 'nlp' },
    cuento: { title: "Tu Cuento", content: analysis.cuento, icon: 'cuento' },
  };

  const activeSection = analysisSections[activeTopic];

  const handleDownload = async () => {
    const { jsPDF } = window.jspdf;
    const content = fullPdfRef.current; // Target the hidden full report
    if (!content) return;

    setIsDownloading(true);

    try {
        const canvas = await window.html2canvas(content, { 
            backgroundColor: '#0c0a09',
            scale: 2,
            useCORS: true,
            windowWidth: content.scrollWidth,
            windowHeight: content.scrollHeight,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });
        
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save('Mi-Mapa-Astral.pdf');

    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Hubo un error al generar el PDF. Por favor, inténtalo de nuevo.");
    } finally {
        setIsDownloading(false);
    }
  };


  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in transition-all duration-500">
        {/* Hidden component for generating the full PDF content */}
        <PdfFullReport ref={fullPdfRef} analysis={analysis} />

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            <aside className="space-y-3 lg:sticky lg:top-16 self-start">
                {Object.keys(analysisSections).map((key) => {
                    const section = analysisSections[key as TopicKey];
                    return (
                        <AnalysisCard
                            key={key}
                            title={section.title}
                            iconType={section.icon}
                            isSelected={activeTopic === key}
                            onClick={() => setActiveTopic(key as TopicKey)}
                        />
                    );
                })}
                 <div className="pt-6 space-y-3">
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="w-full px-6 py-3 bg-purple-600/80 hover:bg-purple-500/80 disabled:bg-stone-600 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg transition-colors"
                    >
                        {isDownloading ? 'Generando PDF...' : 'Descargar Mapa Completo'}
                    </button>
                    <button
                        onClick={onReset}
                        className="w-full px-6 py-3 bg-stone-700 hover:bg-stone-600 text-stone-200 font-semibold rounded-lg transition-colors"
                    >
                        Crear un Nuevo Mapa
                    </button>
                </div>
            </aside>

            <main className="flex-grow flex items-start gap-8">
                <div 
                    ref={pdfContentRef}
                    id="pdf-content" 
                    className="flex-grow p-6 md:p-8 bg-stone-900/50 border border-stone-800 rounded-2xl min-h-[60vh] backdrop-blur-sm"
                >
                    {activeTopic === 'symbol' ? (
                        <div className="text-center flex flex-col items-center justify-center h-full">
                            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400 mb-4">
                                {activeSection.title}
                            </h3>
                            <div className="bg-black/20 p-2 rounded-lg shadow-2xl shadow-purple-900/30">
                                <img
                                    src={`data:image/png;base64,${analysis.symbolicImage}`}
                                    alt="Símbolo astral personal"
                                    className="rounded-md max-w-full h-auto object-contain aspect-square"
                                    style={{maxWidth: '512px'}}
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400 mb-6">
                                {activeSection.title}
                            </h3>
                            <div className="prose prose-invert prose-stone max-w-none text-stone-300/90 leading-relaxed font-light">
                                {cleanAndFormatContent(activeSection.content)}
                            </div>
                        </div>
                    )}
                </div>
                 <div className="hidden xl:block sticky top-24 flex-shrink-0">
                    <HumanSilhouette activeTopic={activeTopic} />
                </div>
            </main>
        </div>
    </div>
  );
};

export default AstralMapDisplay;