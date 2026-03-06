import React from 'react';

function PersonalInfoAlert({ detectedInfo }) {
  if (!detectedInfo || detectedInfo.length === 0) return null;

  return (
    <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="text-4xl">⚠️</div>
        <div className="flex-1">
          <h3 className="text-red-400 font-bold text-lg mb-2">
            Personal Information Detected!
          </h3>
          <p className="text-red-300/80 mb-4">
            Your password contains personal information that makes it easier to guess.
            Attackers often try personal details first!
          </p>
          <div className="space-y-2">
            {detectedInfo.map((info, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-red-500/20 rounded-lg px-4 py-2"
              >
                <span className="text-xl">
                  {info.type === 'name' && '👤'}
                  {info.type === 'birthYear' && '📅'}
                  {info.type === 'email' && '📧'}
                  {info.type === 'common' && '🔄'}
                </span>
                <div>
                  <span className="text-red-300 font-medium capitalize">{info.type}: </span>
                  <span className="text-red-200">"{info.match}" detected in password</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-amber-500/20 rounded-lg border border-amber-500/30">
            <p className="text-amber-300 text-sm flex items-start gap-2">
              <span>💡</span>
              <span>
                <strong>Tip:</strong> Use a passphrase with random words or generate a secure password
                using our password generator above.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfoAlert;
