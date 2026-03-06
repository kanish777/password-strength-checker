import React, { useState, useEffect } from 'react';
import PasswordInput from './components/PasswordInput';
import StrengthMeter from './components/StrengthMeter';
import Suggestions from './components/Suggestions';
import PasswordGenerator from './components/PasswordGenerator';
import PersonalInfoAlert from './components/PersonalInfoAlert';
import EmojiIndicator from './components/EmojiIndicator';
import PasswordHistory from './components/PasswordHistory';
import { checkPasswordStrength, generateStrongPassword } from './utils/passwordUtils';
import { savePasswordCheck, getPasswordHistory } from './services/api';

function App() {
  const [password, setPassword] = useState('');
  const [strengthData, setStrengthData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    birthYear: '',
    email: ''
  });
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (password.length > 0) {
      const data = checkPasswordStrength(password, personalInfo);
      setStrengthData(data);
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
    } catch (error) {
      console.log('History not available - backend connection needed');
    }
  };

  const handleSaveCheck = async () => {
    if (!strengthData) return;
    setIsLoading(true);
    try {
      await savePasswordCheck({
        strength: strengthData.strength,
        score: strengthData.score,
        hasEmoji: strengthData.hasEmoji,
        suggestions: strengthData.suggestions
      });
      await loadHistory();
      alert('Password check saved successfully!');
    } catch (error) {
      alert('Could not save to database - ensure backend is running');
    }
    setIsLoading(false);
  };

  const handleGeneratePassword = (options) => {
    const newPassword = generateStrongPassword(options);
    setPassword(newPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🔐 Password Strength Checker
          </h1>
          <p className="text-gray-300 text-lg">
            Create unbreakable passwords with real-time analysis & emoji support
          </p>
        </header>

        <div className="max-w-4xl mx-auto grid gap-8">
          {/* Personal Info Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>👤</span> Personal Info Detection
            </h2>
            <p className="text-gray-300 text-sm mb-4">
              Enter your info to detect if you're using personal data in passwords (optional)
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Your name"
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
              <input
                type="text"
                placeholder="Birth year (e.g., 1990)"
                value={personalInfo.birthYear}
                onChange={(e) => setPersonalInfo({ ...personalInfo, birthYear: e.target.value })}
                className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Password Input Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>🔑</span> Enter Your Password
            </h2>
            <PasswordInput 
              password={password} 
              setPassword={setPassword} 
            />
            
            {strengthData && (
              <div className="mt-6 space-y-6">
                <StrengthMeter strengthData={strengthData} />
                
                {strengthData.hasPersonalInfo && (
                  <PersonalInfoAlert detectedInfo={strengthData.personalInfoDetected} />
                )}
                
                {strengthData.hasEmoji && (
                  <EmojiIndicator emojis={strengthData.emojisFound} />
                )}
                
                <Suggestions suggestions={strengthData.suggestions} />
              </div>
            )}

            {strengthData && (
              <button
                onClick={handleSaveCheck}
                disabled={isLoading}
                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⏳</span> Saving...
                  </>
                ) : (
                  <>
                    <span>💾</span> Save Password Check to Database
                  </>
                )}
              </button>
            )}
          </div>

          {/* Password Generator Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>⚡</span> Password Generator
            </h2>
            <PasswordGenerator onGenerate={handleGeneratePassword} />
          </div>

          {/* Password History Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-between text-white"
            >
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span>📜</span> Password Check History
              </h2>
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
