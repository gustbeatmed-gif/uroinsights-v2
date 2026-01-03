
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-48 h-48',
    xl: 'w-80 h-80'
  };

  return (
    <div className={`flex items-center justify-center ${className} select-none`}>
      <div className={`${sizes[size]} relative`}>
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-lg"
        >
          {/* Círculo de fundo branco com borda preta nítida */}
          <circle cx="50" cy="50" r="47" fill="white" stroke="black" strokeWidth="3"/>
          
          {/* Símbolo UI centralizado horizontalmente (x=50) */}
          {/* Efeito de sombra do UI (offset para direita e baixo) */}
          <text 
            x="52" y="42" 
            fill="black" 
            fontSize="38" 
            fontWeight="900" 
            fontFamily="Inter, sans-serif"
            textAnchor="middle"
            dominantBaseline="middle"
          >UI</text>
          
          {/* UI Principal Amarelo */}
          <text 
            x="50" y="40" 
            fill="#FACC15" 
            fontSize="38" 
            fontWeight="900" 
            fontFamily="Inter, sans-serif" 
            textAnchor="middle"
            dominantBaseline="middle"
          >UI</text>
          
          {/* Texto 'Uro' centralizado */}
          <text 
            x="50" y="68" 
            fill="black" 
            fontSize="24" 
            fontWeight="900" 
            fontFamily="Inter, sans-serif" 
            textAnchor="middle"
            dominantBaseline="middle"
          >Uro</text>
          
          {/* Texto 'Insights' centralizado e amarelo */}
          <text 
            x="50" y="82" 
            fill="#FACC15" 
            fontSize="11" 
            fontWeight="900" 
            fontFamily="Inter, sans-serif" 
            textAnchor="middle"
            dominantBaseline="middle"
          >Insights</text>
        </svg>
      </div>
    </div>
  );
};
