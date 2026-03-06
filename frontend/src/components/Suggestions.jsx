import React from 'react';

function Suggestions({ suggestions }) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎉</span>
          <div>
            <h3 className="text-green-400 font-semibold text-lg">Excellent Password!</h3>
            <p className="text-green-300/80">Your password meets all security criteria.</p>
          </div>
        </div>
      </div>
    );
  }

  const getSuggestionIcon = (suggestion) => {
    if (suggestion.includes('length') || suggestion.includes('longer')) return '📏';
    if (suggestion.includes('uppercase')) return '🔠';
    if (suggestion.includes('lowercase')) return '🔡';
    if (suggestion.includes('number')) return '🔢';
    if (suggestion.includes('symbol') || suggestion.includes('special')) return '⚡';
    if (suggestion.includes('emoji')) return '😀';
    if (suggestion.includes('personal') || suggestion.includes('name')) return '👤';
    if (suggestion.includes('common') || suggestion.includes('pattern')) return '🔄';
    if (suggestion.includes('sequence')) return '📊';
    return '💡';
  };

  const getPriority = (suggestion) => {
    if (suggestion.includes('personal')) return 'high';
    if (suggestion.includes('common')) return 'high';
    if (suggestion.includes('length')) return 'medium';
    return 'low';
  };

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
      <h3 className="text-amber-400 font-semibold text-lg mb-4 flex items-center gap-2">
        <span>💡</span> Improvement Suggestions
      </h3>
      <ul className="space-y-3">
        {suggestions.map((suggestion, index) => {
          const priority = getPriority(suggestion);
          return (
            <li
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                priority === 'high'
                  ? 'bg-red-500/20 border border-red-500/30'
                  : priority === 'medium'
                  ? 'bg-yellow-500/20 border border-yellow-500/30'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <span className="text-xl flex-shrink-0">{getSuggestionIcon(suggestion)}</span>
              <span className={`${
                priority === 'high'
                  ? 'text-red-300'
                  : priority === 'medium'
                  ? 'text-yellow-300'
                  : 'text-gray-300'
              }`}>
                {suggestion}
              </span>
              {priority === 'high' && (
                <span className="ml-auto text-xs bg-red-500/50 text-red-200 px-2 py-1 rounded">
                  Critical
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Suggestions;
