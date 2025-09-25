
import React from 'react';
import { BrainIcon, HeartIcon, NlpIcon, WoundsIcon, StoryIcon, ImageIcon } from './icons/TopicIcons';

interface AnalysisCardProps {
  title: string;
  iconType: 'numerology' | 'family' | 'wounds' | 'nlp' | 'cuento' | 'symbol';
  isSelected: boolean;
  onClick: () => void;
}

const iconMap = {
  numerology: BrainIcon,
  family: HeartIcon,
  wounds: WoundsIcon,
  nlp: NlpIcon,
  cuento: StoryIcon,
  symbol: ImageIcon,
};

const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, iconType, isSelected, onClick }) => {
  const IconComponent = iconMap[iconType];

  const borderClass = isSelected 
    ? 'border-purple-500 ring-2 ring-purple-500/50' 
    : 'border-stone-700 hover:border-purple-500/50';
  
  const bgClass = isSelected
    ? 'bg-stone-800/80'
    : 'bg-stone-900/60';

  return (
    <div
      onClick={onClick}
      className={`p-4 flex items-center space-x-4 rounded-lg cursor-pointer transition-all duration-300 border ${borderClass} ${bgClass}`}
    >
      <div className={`p-3 rounded-md ${isSelected ? 'bg-purple-600/30' : 'bg-stone-700/50'}`}>
        <IconComponent className={`w-6 h-6 ${isSelected ? 'text-purple-300' : 'text-stone-400'}`} />
      </div>
      <div>
        <h4 className={`font-semibold transition-colors ${isSelected ? 'text-white' : 'text-stone-300'}`}>{title}</h4>
      </div>
    </div>
  );
};

export default AnalysisCard;