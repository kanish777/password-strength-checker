import React, { useState } from 'react';

function PasswordInput({ password, setPassword }) {
  const [showPassword, setShowPassword] = useState(false);
  const [pasteAttempt, setPasteAttempt] = useState(false);

  const handlePaste = (e) => {
    e.preventDefault();
    setPasteAttempt(true);
    setTimeout(() => setPasteAttempt(false), 3000);
  };

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handleChange}
          onPaste={handlePaste}
          placeholder="Type your password here... (emojis supported! 🎉)"
          className="w-full bg-white/5 border-2 border-white/20 rounded-xl px-5 py-4 text-white text-lg placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-200 pr-24"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl hover:scale-110 transition-transform"
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>

      {pasteAttempt && (
        <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-3 text-red-300 animate-pulse">
          <span className="text-xl">🚫</span>
          <span>Pasting is disabled! Please type your password manually for security.</span>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Characters: {password.length}</span>
        <span className="flex items-center gap-1">
          <span>💡</span> Tip: Include emojis for extra security!
        </span>
      </div>
    </div>
  );
}

export default PasswordInput;
