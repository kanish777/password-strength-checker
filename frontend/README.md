# Password Strength Checker - Frontend

## Overview
React frontend for the Password Strength Checker application with real-time password analysis, emoji support, and personal information detection.

## Features

### 🔐 Password Strength Analysis
- Real-time strength meter while typing
- Visual progress bar with color indicators
- Score calculation (0-100)
- Strength levels: Very Weak, Weak, Medium, Strong, Very Strong

### 😀 Emoji Password Support
- Include emojis in passwords for extra security
- Emoji detection and display
- Security bonus for using emojis
- Expanded character set makes passwords harder to crack

### 👤 Smart Personal Info Detection
- Detects if password contains:
  - Your name
  - Birth year
  - Email username
- Alerts user when personal info is found
- Prevents predictable password patterns

### ⚡ Password Generator
- Configurable password length (8-32 characters)
- Toggle options for:
  - Uppercase letters
  - Lowercase letters
  - Numbers
  - Special symbols
  - Emojis
- One-click generation
- Copy to clipboard

### 🚫 Anti-Paste Protection
- Prevents pasting passwords from clipboard
- Encourages users to type passwords manually
- Enhances security awareness

### 📊 Password History
- View saved password check history
- Statistics and trends
- Stored in Aiven MySQL database

## Setup

### 1. Copy frontend files to your Vite project
```bash
cp -r frontend/src/* your-project/src/
```

### 2. Install dependencies
The frontend uses React and Tailwind CSS (already configured in the main project).

### 3. Configure environment
Create a `.env` file:
```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Run development server
```bash
npm run dev
```

## Components

- **App.jsx** - Main application component
- **PasswordInput.jsx** - Password input with anti-paste
- **StrengthMeter.jsx** - Visual strength indicator
- **Suggestions.jsx** - Password improvement tips
- **PasswordGenerator.jsx** - Random password generator
- **PersonalInfoAlert.jsx** - Personal info warning
- **EmojiIndicator.jsx** - Emoji usage display
- **PasswordHistory.jsx** - Historical checks display

## Utils

- **passwordUtils.js** - Password analysis logic
  - `checkPasswordStrength()` - Analyze password
  - `generateStrongPassword()` - Create random password

## Services

- **api.js** - Backend API communication
  - `savePasswordCheck()` - Save to database
  - `getPasswordHistory()` - Fetch history
  - `deletePasswordCheck()` - Remove record
  - `getPasswordStats()` - Get statistics

## Technologies
- React 18+
- Tailwind CSS
- Vite (build tool)
