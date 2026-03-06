import React from 'react';

function StrengthMeter({ strengthData }) {
  const { strength, score, details } = strengthData;

  const getStrengthConfig = () => {
    switch (strength) {
      case 'Very Weak':
        return {
          color: 'from-red-600 to-red-500',
          bgColor: 'bg-red-500/20',
          textColor: 'text-red-400',
          emoji: '😰',
          width: '20%'
        };
      case 'Weak':
        return {
          color: 'from-orange-600 to-orange-500',
          bgColor: 'bg-orange-500/20',
          textColor: 'text-orange-400',
          emoji: '😟',
          width: '40%'
        };
      case 'Medium':
        return {
          color: 'from-yellow-600 to-yellow-500',
          bgColor: 'bg-yellow-500/20',
          textColor: 'text-yellow-400',
          emoji: '😐',
          width: '60%'
        };
      case 'Strong':
        return {
          color: 'from-lime-600 to-lime-500',
          bgColor: 'bg-lime-500/20',
          textColor: 'text-lime-400',
          emoji: '😊',
          width: '80%'
        };
      case 'Very Strong':
        return {
          color: 'from-green-600 to-green-500',
          bgColor: 'bg-green-500/20',
          textColor: 'text-green-400',
          emoji: '🔒',
          width: '100%'
        };
      default:
        return {
          color: 'from-gray-600 to-gray-500',
          bgColor: 'bg-gray-500/20',
          textColor: 'text-gray-400',
          emoji: '❓',
          width: '0%'
        };
    }
  };

  const config = getStrengthConfig();

  return (
    <div className={`${config.bgColor} rounded-xl p-5 border border-white/10`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{config.emoji}</span>
          <div>
            <h3 className={`text-xl font-bold ${config.textColor}`}>{strength}</h3>
            <p className="text-gray-400 text-sm">Score: {score}/100</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-4 bg-white/10 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full bg-gradient-to-r ${config.color} transition-all duration-500 ease-out rounded-full`}
          style={{ width: config.width }}
        />
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <CriteriaItem 
          label="Length (8+)" 
          met={details.hasMinLength} 
        />
        <CriteriaItem 
          label="Uppercase" 
          met={details.hasUppercase} 
        />
        <CriteriaItem 
          label="Lowercase" 
          met={details.hasLowercase} 
        />
        <CriteriaItem 
          label="Numbers" 
          met={details.hasNumbers} 
        />
        <CriteriaItem 
          label="Symbols" 
          met={details.hasSymbols} 
        />
        <CriteriaItem 
          label="12+ Chars" 
          met={details.hasGoodLength} 
        />
        <CriteriaItem 
          label="No Patterns" 
          met={!details.hasCommonPatterns} 
        />
        <CriteriaItem 
          label="Has Emoji" 
          met={details.hasEmoji} 
          bonus={true}
        />
      </div>
    </div>
  );
}

function CriteriaItem({ label, met, bonus = false }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
      met 
        ? bonus 
          ? 'bg-purple-500/20 text-purple-300' 
          : 'bg-green-500/20 text-green-300'
        : 'bg-white/5 text-gray-500'
    }`}>
      <span>{met ? '✓' : '✗'}</span>
      <span className="text-sm">{label}</span>
      {bonus && met && <span className="text-xs">+bonus</span>}
    </div>
  );
}

export default StrengthMeter;
