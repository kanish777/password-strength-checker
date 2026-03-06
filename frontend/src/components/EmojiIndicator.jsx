import React from 'react';

function EmojiIndicator({ emojis }) {
  if (!emojis || emojis.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className="text-4xl">🎉</div>
        <div className="flex-1">
          <h3 className="text-purple-300 font-bold text-lg mb-2">
            Emoji Password Bonus!
          </h3>
          <p className="text-purple-200/80 mb-4">
            Great job! Using emojis significantly increases password complexity and makes
            brute-force attacks much harder.
          </p>
          
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Emojis detected in your password:</p>
            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji, index) => (
                <span
                  key={index}
                  className="text-3xl bg-white/10 rounded-lg p-2 hover:scale-110 transition-transform cursor-default"
                  title={`Emoji ${index + 1}`}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-green-500/20 rounded-lg p-3 text-center">
              <p className="text-green-400 text-2xl font-bold">{emojis.length}</p>
              <p className="text-green-300/80 text-sm">Emojis Used</p>
            </div>
            <div className="bg-blue-500/20 rounded-lg p-3 text-center">
              <p className="text-blue-400 text-2xl font-bold">+{emojis.length * 10}%</p>
              <p className="text-blue-300/80 text-sm">Security Bonus</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
            <p className="text-purple-200 text-sm">
              <strong>💡 Did you know?</strong> Emojis are encoded as Unicode characters, 
              dramatically expanding the possible character set from ~95 to thousands, 
              making your password exponentially harder to crack!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmojiIndicator;
