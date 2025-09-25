
import React from 'react';

interface HumanSilhouetteProps {
  activeTopic: 'numerology' | 'family' | 'wounds' | 'nlp' | 'cuento' | 'symbol';
}

const HumanSilhouette: React.FC<HumanSilhouetteProps> = ({ activeTopic }) => {
  const getGlowFilter = (topic: string) => `url(#glow-${topic})`;
  
  const topicConfig = {
      numerology: { color: 'text-purple-400', filter: getGlowFilter('numerology') },
      family: { color: 'text-rose-400', filter: getGlowFilter('family') },
      wounds: { color: 'text-amber-400', filter: getGlowFilter('wounds') },
      nlp: { color: 'text-cyan-400', filter: getGlowFilter('nlp') },
      cuento: { color: 'text-yellow-300', filter: getGlowFilter('cuento') },
      symbol: { color: 'text-indigo-300', filter: getGlowFilter('symbol') },
  };
    
  const headClass = ['numerology', 'nlp'].includes(activeTopic) ? topicConfig[activeTopic as 'numerology' | 'nlp'].color : 'text-stone-600';
  const heartClass = activeTopic === 'family' ? topicConfig.family.color : 'text-stone-600';
  const gutClass = activeTopic === 'wounds' ? topicConfig.wounds.color : 'text-stone-600';
  const baseClass = ['cuento', 'symbol'].includes(activeTopic) ? topicConfig[activeTopic as 'cuento' | 'symbol'].color : 'text-stone-700/50';
  const baseFilter = ['cuento', 'symbol'].includes(activeTopic) ? topicConfig[activeTopic as 'cuento' | 'symbol'].filter : 'none';

  return (
    <svg 
        viewBox="0 0 200 400" 
        className="w-48 h-96 transition-all duration-500"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <filter id="glow-numerology" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" in="SourceGraphic" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <filter id="glow-family" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" in="SourceGraphic" />
                 <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <filter id="glow-wounds" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" in="SourceGraphic" />
                 <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <filter id="glow-nlp" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" in="SourceGraphic" />
                 <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <filter id="glow-cuento" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="coloredBlur" in="SourceGraphic" />
                 <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
             <filter id="glow-symbol" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" in="SourceGraphic" />
                 <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Base Body */}
        <g style={{ filter: baseFilter }}>
            <path d="M100 80 C 80 80, 80 100, 80 120 L 80 250 C 80 280, 70 300, 70 330 L 70 380 L 90 380 L 90 280 L 110 280 L 110 380 L 130 380 L 130 330 C 130 300, 120 280, 120 250 L 120 120 C 120 100, 120 80, 100 80 Z" fill="currentColor" className={`${baseClass} transition-colors duration-500`} />
            <circle cx="100" cy="50" r="30" fill="currentColor" className={`${baseClass} transition-colors duration-500`}/>
        </g>
        
        {/* Highlighted Head */}
        <g className={`transition-all duration-500 ${headClass}`} style={{ filter: ['numerology', 'nlp'].includes(activeTopic) ? topicConfig[activeTopic as 'numerology' | 'nlp'].filter : 'none' }}>
           <circle cx="100" cy="50" r="25" fill="currentColor" opacity="0.8" />
        </g>
        
        {/* Highlighted Heart */}
        <g className={`transition-all duration-500 ${heartClass}`} style={{ filter: activeTopic === 'family' ? topicConfig.family.filter : 'none' }}>
           <path d="M100,140 a 15,15 0 0,1 15,15 c 0,15 -30,30 -15,40 c 15,-10 -15,-25 -15,-40 a 15,15 0 0,1 15,-15" fill="currentColor" opacity="0.8"/>
        </g>
        
        {/* Highlighted Gut */}
        <g className={`transition-all duration-500 ${gutClass}`} style={{ filter: activeTopic === 'wounds' ? topicConfig.wounds.filter : 'none' }}>
           <ellipse cx="100" cy="190" rx="20" ry="10" fill="currentColor" opacity="0.8"/>
        </g>
    </svg>
  );
};

export default HumanSilhouette;
