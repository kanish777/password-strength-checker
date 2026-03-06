import React, { useState, useEffect } from 'react';

// Emoji regex pattern to detect emojis
const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{231A}-\u{231B}]|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|[\u{25AA}-\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{25FB}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2702}]|[\u{2705}]|[\u{2708}-\u{270D}]|[\u{270F}]|[\u{2712}]|[\u{2714}]|[\u{2716}]|[\u{271D}]|[\u{2721}]|[\u{2728}]|[\u{2733}-\u{2734}]|[\u{2744}]|[\u{2747}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2763}-\u{2764}]|[\u{2795}-\u{2797}]|[\u{27A1}]|[\u{27B0}]|[\u{27BF}]|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]/gu;

// Types
interface PersonalInfo {
  name: string;
  birthYear: string;
  email: string;
}

interface DetectedInfo {
  type: string;
  match: string;
}

interface StrengthDetails {
  hasMinLength: boolean;
  hasGoodLength: boolean;
  hasExcellentLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  hasEmoji: boolean;
  hasCommonPatterns: boolean;
  hasSequentialPatterns: boolean;
  hasRepeats: boolean;
}

interface StrengthData {
  strength: string;
  score: number;
  suggestions: string[];
  hasEmoji: boolean;
  emojisFound: string[];
  hasPersonalInfo: boolean;
  personalInfoDetected: DetectedInfo[];
  details: StrengthDetails;
}

interface GeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  includeEmojis: boolean;
}

interface PasswordCheckRecord {
  id: number;
  strength: string;
  score: number;
  has_emoji: boolean;
  suggestions: string[];
  created_at: string;
}

// Common password patterns
const commonPatterns = [
  'password', 'qwerty', '123456', 'abc123', 'letmein', 'welcome',
  'monkey', 'dragon', 'master', 'login', 'admin', 'iloveyou',
  'sunshine', 'princess', 'football', 'baseball', 'shadow', 'superman'
];

const sequentialPatterns = [
  '012345', '123456', '234567', '345678', '456789', '567890',
  'abcdef', 'bcdefg', 'cdefgh', 'fedcba', '098765', '987654'
];

// Helper functions
const extractEmojis = (password: string): string[] => {
  const matches = password.match(emojiRegex);
  return matches ? [...new Set(matches)] : [];
};

const hasRepeatedChars = (password: string): boolean => /(.)\1{2,}/.test(password);

const checkPersonalInfo = (password: string, personalInfo: PersonalInfo): DetectedInfo[] => {
  const detected: DetectedInfo[] = [];
  const lowerPassword = password.toLowerCase();

  if (personalInfo.name && personalInfo.name.length >= 3) {
    const nameParts = personalInfo.name.toLowerCase().split(/\s+/);
    nameParts.forEach(part => {
      if (part.length >= 3 && lowerPassword.includes(part)) {
        detected.push({ type: 'name', match: part });
      }
    });
  }

  if (personalInfo.birthYear && personalInfo.birthYear.length === 4) {
    if (lowerPassword.includes(personalInfo.birthYear)) {
      detected.push({ type: 'birthYear', match: personalInfo.birthYear });
    }
    const shortYear = personalInfo.birthYear.slice(2);
    if (lowerPassword.includes(shortYear)) {
      detected.push({ type: 'birthYear', match: shortYear });
    }
  }

  if (personalInfo.email) {
    const emailPart = personalInfo.email.split('@')[0].toLowerCase();
    if (emailPart.length >= 3 && lowerPassword.includes(emailPart)) {
      detected.push({ type: 'email', match: emailPart });
    }
  }

  return detected;
};

const checkPasswordStrength = (password: string, personalInfo: PersonalInfo): StrengthData => {
  const length = password.length;
  const emojis = extractEmojis(password);
  const hasEmoji = emojis.length > 0;

  const hasMinLength = length >= 8;
  const hasGoodLength = length >= 12;
  const hasExcellentLength = length >= 16;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);

  const lowerPassword = password.toLowerCase();
  const hasCommonPatterns = commonPatterns.some(pattern => lowerPassword.includes(pattern));
  const hasSequentialPatterns = sequentialPatterns.some(pattern => lowerPassword.includes(pattern));
  const hasRepeats = hasRepeatedChars(password);

  const personalInfoDetected = checkPersonalInfo(password, personalInfo);
  const hasPersonalInfo = personalInfoDetected.length > 0;

  let score = 0;
  if (length >= 8) score += 15;
  if (length >= 12) score += 15;
  if (length >= 16) score += 10;
  if (length >= 20) score += 5;
  if (hasUppercase) score += 10;
  if (hasLowercase) score += 10;
  if (hasNumbers) score += 10;
  if (hasSymbols) score += 15;
  if (hasEmoji) score += 15;
  if (hasCommonPatterns) score -= 25;
  if (hasSequentialPatterns) score -= 15;
  if (hasRepeats) score -= 10;
  if (hasPersonalInfo) score -= 20;

  score = Math.max(0, Math.min(100, score));

  let strength: string;
  if (score >= 80) strength = 'Very Strong';
  else if (score >= 60) strength = 'Strong';
  else if (score >= 40) strength = 'Medium';
  else if (score >= 20) strength = 'Weak';
  else strength = 'Very Weak';

  const suggestions: string[] = [];
  if (!hasMinLength) suggestions.push('Make your password at least 8 characters long');
  if (!hasGoodLength && hasMinLength) suggestions.push('Consider using 12 or more characters for better security');
  if (!hasUppercase) suggestions.push('Add uppercase letters (A-Z) to strengthen your password');
  if (!hasLowercase) suggestions.push('Add lowercase letters (a-z) to your password');
  if (!hasNumbers) suggestions.push('Include numbers (0-9) in your password');
  if (!hasSymbols) suggestions.push('Add special symbols (!@#$%^&*) for extra security');
  if (!hasEmoji) suggestions.push('🎉 Try adding emojis for a significant security boost!');
  if (hasCommonPatterns) suggestions.push('Avoid common password patterns like "password" or "123456"');
  if (hasSequentialPatterns) suggestions.push('Avoid sequential characters like "abc" or "123"');
  if (hasRepeats) suggestions.push('Avoid repeating characters like "aaa" or "111"');
  if (hasPersonalInfo) suggestions.push('⚠️ Remove personal information from your password - it makes it easy to guess!');

  return {
    strength,
    score,
    suggestions,
    hasEmoji,
    emojisFound: emojis,
    hasPersonalInfo,
    personalInfoDetected,
    details: {
      hasMinLength, hasGoodLength, hasExcellentLength,
      hasUppercase, hasLowercase, hasNumbers, hasSymbols,
      hasEmoji, hasCommonPatterns, hasSequentialPatterns, hasRepeats
    }
  };
};

// Password generator
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const emojiChars = ['🔒', '🛡️', '⚡', '🔥', '💪', '🎯', '🚀', '💎', '⭐', '🌟', '🔑', '🎉', '✨', '🏆', '💫', '🌈', '🎲', '🃏', '🎪', '🎭'];

const generateStrongPassword = (options: GeneratorOptions): string => {
  const { length = 16, includeUppercase = true, includeLowercase = true, includeNumbers = true, includeSymbols = true, includeEmojis = false } = options;

  let chars = '';
  const guaranteedChars: string[] = [];

  if (includeUppercase) {
    chars += uppercaseChars;
    guaranteedChars.push(uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]);
  }
  if (includeLowercase) {
    chars += lowercaseChars;
    guaranteedChars.push(lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]);
  }
  if (includeNumbers) {
    chars += numberChars;
    guaranteedChars.push(numberChars[Math.floor(Math.random() * numberChars.length)]);
  }
  if (includeSymbols) {
    chars += symbolChars;
    guaranteedChars.push(symbolChars[Math.floor(Math.random() * symbolChars.length)]);
  }

  if (chars.length === 0) chars = lowercaseChars;

  let regularCharsNeeded = length - guaranteedChars.length;
  const emojisToAdd: string[] = [];
  if (includeEmojis) {
    const emojiCount = Math.min(3, Math.floor(length / 5));
    for (let i = 0; i < emojiCount; i++) {
      emojisToAdd.push(emojiChars[Math.floor(Math.random() * emojiChars.length)]);
    }
    regularCharsNeeded -= emojiCount;
  }

  let password = '';
  for (let i = 0; i < regularCharsNeeded; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  const allChars = [...password.split(''), ...guaranteedChars, ...emojisToAdd];
  for (let i = allChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allChars[i], allChars[j]] = [allChars[j], allChars[i]];
  }

  return allChars.join('');
};

// API functions
const API_BASE_URL = 'http://localhost:3001/api';

const savePasswordCheck = async (checkData: { strength: string; score: number; hasEmoji: boolean; suggestions: string[] }) => {
  const response = await fetch(`${API_BASE_URL}/password-checks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      strength: checkData.strength,
      score: checkData.score,
      has_emoji: checkData.hasEmoji,
      suggestions: checkData.suggestions
    }),
  });
  if (!response.ok) throw new Error('Failed to save');
  return response.json();
};

const getPasswordHistory = async (): Promise<PasswordCheckRecord[]> => {
  const response = await fetch(`${API_BASE_URL}/password-checks?limit=10`);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
};

// Components
function PasswordInput({ password, setPassword }: { password: string; setPassword: (p: string) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [pasteAttempt, setPasteAttempt] = useState(false);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setPasteAttempt(true);
    setTimeout(() => setPasteAttempt(false), 3000);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        <span className="flex items-center gap-1">💡 Tip: Include emojis for extra security!</span>
      </div>
    </div>
  );
}

function StrengthMeter({ strengthData }: { strengthData: StrengthData }) {
  const { strength, score, details } = strengthData;

  const getConfig = () => {
    switch (strength) {
      case 'Very Weak': return { color: 'from-red-600 to-red-500', bgColor: 'bg-red-500/20', textColor: 'text-red-400', emoji: '😰', width: '20%' };
      case 'Weak': return { color: 'from-orange-600 to-orange-500', bgColor: 'bg-orange-500/20', textColor: 'text-orange-400', emoji: '😟', width: '40%' };
      case 'Medium': return { color: 'from-yellow-600 to-yellow-500', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-400', emoji: '😐', width: '60%' };
      case 'Strong': return { color: 'from-lime-600 to-lime-500', bgColor: 'bg-lime-500/20', textColor: 'text-lime-400', emoji: '😊', width: '80%' };
      case 'Very Strong': return { color: 'from-green-600 to-green-500', bgColor: 'bg-green-500/20', textColor: 'text-green-400', emoji: '🔒', width: '100%' };
      default: return { color: 'from-gray-600 to-gray-500', bgColor: 'bg-gray-500/20', textColor: 'text-gray-400', emoji: '❓', width: '0%' };
    }
  };

  const config = getConfig();

  const CriteriaItem = ({ label, met, bonus = false }: { label: string; met: boolean; bonus?: boolean }) => (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${met ? bonus ? 'bg-purple-500/20 text-purple-300' : 'bg-green-500/20 text-green-300' : 'bg-white/5 text-gray-500'}`}>
      <span>{met ? '✓' : '✗'}</span>
      <span className="text-sm">{label}</span>
      {bonus && met && <span className="text-xs">+bonus</span>}
    </div>
  );

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
      <div className="h-4 bg-white/10 rounded-full overflow-hidden mb-4">
        <div className={`h-full bg-gradient-to-r ${config.color} transition-all duration-500 ease-out rounded-full`} style={{ width: config.width }} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <CriteriaItem label="Length (8+)" met={details.hasMinLength} />
        <CriteriaItem label="Uppercase" met={details.hasUppercase} />
        <CriteriaItem label="Lowercase" met={details.hasLowercase} />
        <CriteriaItem label="Numbers" met={details.hasNumbers} />
        <CriteriaItem label="Symbols" met={details.hasSymbols} />
        <CriteriaItem label="12+ Chars" met={details.hasGoodLength} />
        <CriteriaItem label="No Patterns" met={!details.hasCommonPatterns} />
        <CriteriaItem label="Has Emoji" met={details.hasEmoji} bonus={true} />
      </div>
    </div>
  );
}

function Suggestions({ suggestions }: { suggestions: string[] }) {
  if (suggestions.length === 0) {
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

  const getIcon = (s: string) => {
    if (s.includes('length')) return '📏';
    if (s.includes('uppercase')) return '🔠';
    if (s.includes('lowercase')) return '🔡';
    if (s.includes('number')) return '🔢';
    if (s.includes('symbol')) return '⚡';
    if (s.includes('emoji')) return '😀';
    if (s.includes('personal')) return '👤';
    if (s.includes('common') || s.includes('pattern')) return '🔄';
    return '💡';
  };

  const getPriority = (s: string) => {
    if (s.includes('personal') || s.includes('common')) return 'high';
    if (s.includes('length')) return 'medium';
    return 'low';
  };

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
      <h3 className="text-amber-400 font-semibold text-lg mb-4 flex items-center gap-2">💡 Improvement Suggestions</h3>
      <ul className="space-y-3">
        {suggestions.map((s, i) => {
          const priority = getPriority(s);
          return (
            <li key={i} className={`flex items-start gap-3 p-3 rounded-lg ${priority === 'high' ? 'bg-red-500/20 border border-red-500/30' : priority === 'medium' ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-white/5 border border-white/10'}`}>
              <span className="text-xl flex-shrink-0">{getIcon(s)}</span>
              <span className={priority === 'high' ? 'text-red-300' : priority === 'medium' ? 'text-yellow-300' : 'text-gray-300'}>{s}</span>
              {priority === 'high' && <span className="ml-auto text-xs bg-red-500/50 text-red-200 px-2 py-1 rounded">Critical</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PersonalInfoAlert({ detectedInfo }: { detectedInfo: DetectedInfo[] }) {
  if (detectedInfo.length === 0) return null;
  return (
    <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="text-4xl">⚠️</div>
        <div className="flex-1">
          <h3 className="text-red-400 font-bold text-lg mb-2">Personal Information Detected!</h3>
          <p className="text-red-300/80 mb-4">Your password contains personal information that makes it easier to guess.</p>
          <div className="space-y-2">
            {detectedInfo.map((info, i) => (
              <div key={i} className="flex items-center gap-3 bg-red-500/20 rounded-lg px-4 py-2">
                <span className="text-xl">{info.type === 'name' ? '👤' : info.type === 'birthYear' ? '📅' : '📧'}</span>
                <div>
                  <span className="text-red-300 font-medium capitalize">{info.type}: </span>
                  <span className="text-red-200">"{info.match}" detected</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmojiIndicator({ emojis }: { emojis: string[] }) {
  if (emojis.length === 0) return null;
  return (
    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className="text-4xl">🎉</div>
        <div className="flex-1">
          <h3 className="text-purple-300 font-bold text-lg mb-2">Emoji Password Bonus!</h3>
          <p className="text-purple-200/80 mb-4">Great job! Using emojis significantly increases password complexity.</p>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Emojis detected:</p>
            <div className="flex flex-wrap gap-2">
              {emojis.map((e, i) => (
                <span key={i} className="text-3xl bg-white/10 rounded-lg p-2 hover:scale-110 transition-transform">{e}</span>
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
        </div>
      </div>
    </div>
  );
}

function PasswordGenerator({ onGenerate }: { onGenerate: (options: GeneratorOptions) => void }) {
  const [options, setOptions] = useState<GeneratorOptions>({
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
    const pwd = generateStrongPassword(options);
    setGeneratedPassword(pwd);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUse = () => {
    const pwd = generateStrongPassword(options);
    setGeneratedPassword(pwd);
    onGenerate(options);
  };

  const OptionToggle = ({ label, checked, onChange, icon, special = false }: { label: string; checked: boolean; onChange: (c: boolean) => void; icon: string; special?: boolean }) => (
    <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${checked ? special ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50' : 'bg-purple-500/20 border border-purple-500/30' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <span className="text-xl">{icon}</span>
      <span className={checked ? 'text-white' : 'text-gray-400'}>{label}</span>
      <span className={`ml-auto w-10 h-6 rounded-full transition-all duration-200 flex items-center ${checked ? 'bg-purple-500 justify-end' : 'bg-gray-600 justify-start'}`}>
        <span className="w-5 h-5 bg-white rounded-full mx-0.5 shadow-md" />
      </span>
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="col-span-2 md:col-span-3">
          <label className="text-gray-300 text-sm mb-2 block">Password Length: {options.length}</label>
          <input type="range" min="8" max="32" value={options.length} onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })} className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500" />
          <div className="flex justify-between text-xs text-gray-500 mt-1"><span>8</span><span>16</span><span>24</span><span>32</span></div>
        </div>
        <OptionToggle label="Uppercase" checked={options.includeUppercase} onChange={(c) => setOptions({ ...options, includeUppercase: c })} icon="🔠" />
        <OptionToggle label="Lowercase" checked={options.includeLowercase} onChange={(c) => setOptions({ ...options, includeLowercase: c })} icon="🔡" />
        <OptionToggle label="Numbers" checked={options.includeNumbers} onChange={(c) => setOptions({ ...options, includeNumbers: c })} icon="🔢" />
        <OptionToggle label="Symbols" checked={options.includeSymbols} onChange={(c) => setOptions({ ...options, includeSymbols: c })} icon="⚡" />
        <OptionToggle label="Emojis 🎭" checked={options.includeEmojis} onChange={(c) => setOptions({ ...options, includeEmojis: c })} icon="🎉" special={true} />
      </div>
      <button onClick={handleGenerate} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-purple-500/25">
        <span className="text-2xl">🎲</span> Generate Strong Password
      </button>
      {generatedPassword && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 overflow-hidden">
              <p className="text-gray-400 text-sm mb-1">Generated Password:</p>
              <p className="text-white font-mono text-lg break-all">{generatedPassword}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleCopy} className={`p-3 rounded-lg transition-all duration-200 ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/10 hover:bg-white/20 text-white'}`} title="Copy">
                {copied ? '✅' : '📋'}
              </button>
              <button onClick={handleUse} className="p-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all duration-200" title="Use">⬆️</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PasswordHistory({ history }: { history: PasswordCheckRecord[] }) {
  if (history.length === 0) {
    return (
      <div className="mt-4 text-center py-8">
        <span className="text-4xl mb-4 block">📭</span>
        <p className="text-gray-400">No password checks saved yet.</p>
        <p className="text-gray-500 text-sm mt-2">Save a password check to see history.</p>
      </div>
    );
  }

  const getColor = (s: string) => {
    switch (s) {
      case 'Very Weak': return 'text-red-400 bg-red-500/20';
      case 'Weak': return 'text-orange-400 bg-orange-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'Strong': return 'text-lime-400 bg-lime-500/20';
      case 'Very Strong': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getEmoji = (s: string) => {
    switch (s) {
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
        <div key={item.id || index} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getEmoji(item.strength)}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getColor(item.strength)}`}>{item.strength}</span>
            </div>
            <div className="text-right">
              <p className="text-white font-bold">{item.score}/100</p>
              <p className="text-gray-500 text-xs">{new Date(item.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          {item.has_emoji && (
            <div className="inline-flex items-center gap-2 bg-purple-500/20 rounded-full px-3 py-1 text-purple-300 text-sm mr-2">🎉 Emoji Used</div>
          )}
        </div>
      ))}
    </div>
  );
}

// Main App
function App() {
  const [password, setPassword] = useState('');
  const [strengthData, setStrengthData] = useState<StrengthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<PasswordCheckRecord[]>([]);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({ name: '', birthYear: '', email: '' });
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (password.length > 0) {
      setStrengthData(checkPasswordStrength(password, personalInfo));
    } else {
      setStrengthData(null);
    }
  }, [password, personalInfo]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getPasswordHistory();
      setHistory(data);
    } catch { console.log('History not available'); }
  };

  const handleSaveCheck = async () => {
    if (!strengthData) return;
    setIsLoading(true);
    try {
      await savePasswordCheck({ strength: strengthData.strength, score: strengthData.score, hasEmoji: strengthData.hasEmoji, suggestions: strengthData.suggestions });
      await loadHistory();
      alert('Password check saved successfully!');
    } catch { alert('Could not save - ensure backend is running with Aiven MySQL'); }
    setIsLoading(false);
  };

  const handleGeneratePassword = (options: GeneratorOptions) => {
    setPassword(generateStrongPassword(options));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">🔐 Password Strength Checker</h1>
          <p className="text-gray-300 text-lg">Create unbreakable passwords with real-time analysis & emoji support</p>
        </header>

        <div className="max-w-4xl mx-auto grid gap-8">
          {/* Personal Info */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">👤 Personal Info Detection</h2>
            <p className="text-gray-300 text-sm mb-4">Enter your info to detect if you're using personal data in passwords (optional)</p>
            <div className="grid md:grid-cols-3 gap-4">
              <input type="text" placeholder="Your name" value={personalInfo.name} onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })} className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500" />
              <input type="text" placeholder="Birth year (e.g., 1990)" value={personalInfo.birthYear} onChange={(e) => setPersonalInfo({ ...personalInfo, birthYear: e.target.value })} className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500" />
              <input type="email" placeholder="Email" value={personalInfo.email} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500" />
            </div>
          </div>

          {/* Password Input */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">🔑 Enter Your Password</h2>
            <PasswordInput password={password} setPassword={setPassword} />
            {strengthData && (
              <div className="mt-6 space-y-6">
                <StrengthMeter strengthData={strengthData} />
                {strengthData.hasPersonalInfo && <PersonalInfoAlert detectedInfo={strengthData.personalInfoDetected} />}
                {strengthData.hasEmoji && <EmojiIndicator emojis={strengthData.emojisFound} />}
                <Suggestions suggestions={strengthData.suggestions} />
              </div>
            )}
            {strengthData && (
              <button onClick={handleSaveCheck} disabled={isLoading} className="mt-6 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                {isLoading ? <><span className="animate-spin">⏳</span> Saving...</> : <><span>💾</span> Save Password Check to Database</>}
              </button>
            )}
          </div>

          {/* Generator */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">⚡ Password Generator</h2>
            <PasswordGenerator onGenerate={handleGeneratePassword} />
          </div>

          {/* History */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <button onClick={() => setShowHistory(!showHistory)} className="w-full flex items-center justify-between text-white">
              <h2 className="text-xl font-semibold flex items-center gap-2">📜 Password Check History</h2>
              <span className="text-2xl">{showHistory ? '▲' : '▼'}</span>
            </button>
            {showHistory && <PasswordHistory history={history} />}
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-400">
          <p>🔒 Your passwords are checked locally - we never store actual passwords</p>
          <p className="mt-2">Connected to Aiven MySQL Cloud Database</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
