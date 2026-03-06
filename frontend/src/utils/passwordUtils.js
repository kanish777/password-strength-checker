// Emoji regex pattern to detect emojis
const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{231A}-\u{231B}]|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|[\u{25AA}-\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{25FB}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2702}]|[\u{2705}]|[\u{2708}-\u{270D}]|[\u{270F}]|[\u{2712}]|[\u{2714}]|[\u{2716}]|[\u{271D}]|[\u{2721}]|[\u{2728}]|[\u{2733}-\u{2734}]|[\u{2744}]|[\u{2747}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2763}-\u{2764}]|[\u{2795}-\u{2797}]|[\u{27A1}]|[\u{27B0}]|[\u{27BF}]|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]/gu;

// Common password patterns to check against
const commonPatterns = [
  'password', 'qwerty', '123456', 'abc123', 'letmein', 'welcome',
  'monkey', 'dragon', 'master', 'login', 'admin', 'iloveyou',
  'sunshine', 'princess', 'football', 'baseball', 'shadow', 'superman',
  '1234567890', '0987654321', 'asdfgh', 'zxcvbn', 'qazwsx'
];

// Sequential patterns
const sequentialPatterns = [
  '012345', '123456', '234567', '345678', '456789', '567890',
  'abcdef', 'bcdefg', 'cdefgh', 'defghi', 'efghij',
  '098765', '987654', '876543', '765432', '654321',
  'fedcba', 'edcba', 'dcba', 'cba'
];

// Repeated character patterns
const hasRepeatedChars = (password) => {
  return /(.)\1{2,}/.test(password);
};

// Extract emojis from password
const extractEmojis = (password) => {
  const matches = password.match(emojiRegex);
  return matches ? [...new Set(matches)] : [];
};

// Check for personal information in password
const checkPersonalInfo = (password, personalInfo) => {
  const detected = [];
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
    // Also check for 2-digit year
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

// Main password strength checker
export const checkPasswordStrength = (password, personalInfo = {}) => {
  const length = password.length;
  const emojis = extractEmojis(password);
  const hasEmoji = emojis.length > 0;
  
  // Basic checks
  const hasMinLength = length >= 8;
  const hasGoodLength = length >= 12;
  const hasExcellentLength = length >= 16;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);
  
  // Pattern checks
  const lowerPassword = password.toLowerCase();
  const hasCommonPatterns = commonPatterns.some(pattern => lowerPassword.includes(pattern));
  const hasSequentialPatterns = sequentialPatterns.some(pattern => lowerPassword.includes(pattern));
  const hasRepeats = hasRepeatedChars(password);
  
  // Personal info check
  const personalInfoDetected = checkPersonalInfo(password, personalInfo);
  const hasPersonalInfo = personalInfoDetected.length > 0;

  // Calculate score
  let score = 0;
  
  // Length scoring
  if (length >= 8) score += 15;
  if (length >= 12) score += 15;
  if (length >= 16) score += 10;
  if (length >= 20) score += 5;
  
  // Character type scoring
  if (hasUppercase) score += 10;
  if (hasLowercase) score += 10;
  if (hasNumbers) score += 10;
  if (hasSymbols) score += 15;
  if (hasEmoji) score += 15; // Emoji bonus
  
  // Penalties
  if (hasCommonPatterns) score -= 25;
  if (hasSequentialPatterns) score -= 15;
  if (hasRepeats) score -= 10;
  if (hasPersonalInfo) score -= 20;
  
  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Determine strength level
  let strength;
  if (score >= 80) strength = 'Very Strong';
  else if (score >= 60) strength = 'Strong';
  else if (score >= 40) strength = 'Medium';
  else if (score >= 20) strength = 'Weak';
  else strength = 'Very Weak';

  // Generate suggestions
  const suggestions = [];
  
  if (!hasMinLength) {
    suggestions.push('Make your password at least 8 characters long');
  }
  if (!hasGoodLength && hasMinLength) {
    suggestions.push('Consider using 12 or more characters for better security');
  }
  if (!hasUppercase) {
    suggestions.push('Add uppercase letters (A-Z) to strengthen your password');
  }
  if (!hasLowercase) {
    suggestions.push('Add lowercase letters (a-z) to your password');
  }
  if (!hasNumbers) {
    suggestions.push('Include numbers (0-9) in your password');
  }
  if (!hasSymbols) {
    suggestions.push('Add special symbols (!@#$%^&*) for extra security');
  }
  if (!hasEmoji) {
    suggestions.push('🎉 Try adding emojis for a significant security boost!');
  }
  if (hasCommonPatterns) {
    suggestions.push('Avoid common password patterns like "password" or "123456"');
  }
  if (hasSequentialPatterns) {
    suggestions.push('Avoid sequential characters like "abc" or "123"');
  }
  if (hasRepeats) {
    suggestions.push('Avoid repeating characters like "aaa" or "111"');
  }
  if (hasPersonalInfo) {
    suggestions.push('⚠️ Remove personal information from your password - it makes it easy to guess!');
  }

  return {
    strength,
    score,
    suggestions,
    hasEmoji,
    emojisFound: emojis,
    hasPersonalInfo,
    personalInfoDetected,
    details: {
      hasMinLength,
      hasGoodLength,
      hasExcellentLength,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSymbols,
      hasEmoji,
      hasCommonPatterns,
      hasSequentialPatterns,
      hasRepeats
    }
  };
};

// Password generator
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const emojiChars = ['🔒', '🛡️', '⚡', '🔥', '💪', '🎯', '🚀', '💎', '⭐', '🌟', '🔑', '🎉', '✨', '🏆', '💫', '🌈', '🎲', '🃏', '🎪', '🎭'];

export const generateStrongPassword = (options) => {
  const {
    length = 16,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
    includeEmojis = false
  } = options;

  let chars = '';
  let password = '';
  const guaranteedChars = [];

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

  // Default to lowercase if nothing selected
  if (chars.length === 0) {
    chars = lowercaseChars;
  }

  // Calculate how many regular chars we need
  let regularCharsNeeded = length - guaranteedChars.length;
  
  // Add emojis if requested
  const emojisToAdd = [];
  if (includeEmojis) {
    const emojiCount = Math.min(3, Math.floor(length / 5));
    for (let i = 0; i < emojiCount; i++) {
      emojisToAdd.push(emojiChars[Math.floor(Math.random() * emojiChars.length)]);
    }
    regularCharsNeeded -= emojiCount;
  }

  // Generate random characters
  for (let i = 0; i < regularCharsNeeded; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  // Combine and shuffle
  const allChars = [...password.split(''), ...guaranteedChars, ...emojisToAdd];
  
  // Fisher-Yates shuffle
  for (let i = allChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allChars[i], allChars[j]] = [allChars[j], allChars[i]];
  }

  return allChars.join('');
};
