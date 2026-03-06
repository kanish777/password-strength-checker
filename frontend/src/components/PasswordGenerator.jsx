import React, { useState } from 'react';
import { generateStrongPassword } from '../utils/passwordUtils';

function PasswordGenerator({ onGenerate }) {
  const [options, setOptions] = useState({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    includeEmojis: false
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const password = generateStrongPassword(options);
    setGeneratedPassword(password);
    onGenerate(options);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUsePassword = () => {
    onGenerate(options);
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="col-span-2 md:col-span-3">
          <label className="text-gray-300 text-sm mb-2 block">
            Password Length: {options.length}
          </label>
          <input
            type="range"
            min="8"
            max="32"
            value={options.length}
            onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>8</span>
            <span>16</span>
            <span>24</span>
            <span>32</span>
          </div>
        </div>

        <OptionToggle
          label="Uppercase (A-Z)"
          checked={options.includeUppercase}
          onChange={(checked) => setOptions({ ...options, includeUppercase: checked })}
          icon="🔠"
        />
        <OptionToggle
          label="Lowercase (a-z)"
          checked={options.includeLowercase}
          onChange={(checked) => setOptions({ ...options, includeLowercase: checked })}
          icon="🔡"
        />
        <OptionToggle
          label="Numbers (0-9)"
          checked={options.includeNumbers}
          onChange={(checked) => setOptions({ ...options, includeNumbers: checked })}
          icon="🔢"
        />
        <OptionToggle
          label="Symbols (!@#)"
          checked={options.includeSymbols}
          onChange={(checked) => setOptions({ ...options, includeSymbols: checked })}
          icon="⚡"
        />
        <OptionToggle
          label="Emojis 😀🔒"
          checked={options.includeEmojis}
          onChange={(checked) => setOptions({ ...options, includeEmojis: checked })}
          icon="🎭"
          special={true}
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-purple-500/25"
      >
        <span className="text-2xl">🎲</span>
        Generate Strong Password
      </button>

      {/* Generated Password Display */}
      {generatedPassword && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 overflow-hidden">
              <p className="text-gray-400 text-sm mb-1">Generated Password:</p>
              <p className="text-white font-mono text-lg break-all">{generatedPassword}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  copied
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Copy to clipboard"
              >
                {copied ? '✅' : '📋'}
              </button>
              <button
                onClick={handleUsePassword}
                className="p-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all duration-200"
                title="Use this password"
              >
                ⬆️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OptionToggle({ label, checked, onChange, icon, special = false }) {
  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        checked
          ? special
            ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50'
            : 'bg-purple-500/20 border border-purple-500/30'
          : 'bg-white/5 border border-white/10 hover:bg-white/10'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="text-xl">{icon}</span>
      <span className={checked ? 'text-white' : 'text-gray-400'}>{label}</span>
      <span
        className={`ml-auto w-10 h-6 rounded-full transition-all duration-200 flex items-center ${
          checked ? 'bg-purple-500 justify-end' : 'bg-gray-600 justify-start'
        }`}
      >
        <span className="w-5 h-5 bg-white rounded-full mx-0.5 shadow-md" />
      </span>
    </label>
  );
}

export default PasswordGenerator;
