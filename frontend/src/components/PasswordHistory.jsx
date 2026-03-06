import React from 'react';

function PasswordHistory({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="mt-4 text-center py-8">
        <span className="text-4xl mb-4 block">📭</span>
        <p className="text-gray-400">No password checks saved yet.</p>
        <p className="text-gray-500 text-sm mt-2">
          Save a password check to see your history here.
        </p>
      </div>
    );
  }

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'Very Weak': return 'text-red-400 bg-red-500/20';
      case 'Weak': return 'text-orange-400 bg-orange-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'Strong': return 'text-lime-400 bg-lime-500/20';
      case 'Very Strong': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStrengthEmoji = (strength) => {
    switch (strength) {
      case 'Very Weak': return '😰';
      case 'Weak': return '😟';
      case 'Medium': return '😐';
      case 'Strong': return '😊';
      case 'Very Strong': return '🔒';
      default: return '❓';
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {history.map((item, index) => (
        <div
          key={item.id || index}
          className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getStrengthEmoji(item.strength)}</span>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStrengthColor(item.strength)}`}>
                  {item.strength}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-bold">{item.score}/100</p>
              <p className="text-gray-500 text-xs">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {item.has_emoji && (
            <div className="inline-flex items-center gap-2 bg-purple-500/20 rounded-full px-3 py-1 text-purple-300 text-sm mr-2">
              <span>🎉</span> Emoji Used
            </div>
          )}

          {item.suggestions && item.suggestions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-gray-400 text-sm mb-2">Suggestions given:</p>
              <ul className="text-gray-500 text-sm space-y-1">
                {item.suggestions.slice(0, 3).map((suggestion, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span>•</span> {suggestion}
                  </li>
                ))}
                {item.suggestions.length > 3 && (
                  <li className="text-purple-400">+{item.suggestions.length - 3} more</li>
                )}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PasswordHistory;
