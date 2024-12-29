import React, { useState } from 'react';

const LanguagePopup: React.FC<{ onSelectLanguage: (lang: string) => void }> = ({ onSelectLanguage }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleLanguageSelect = (lang: string) => {
    onSelectLanguage(lang);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center transform transition-all duration-300 scale-100">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Choose Your Language</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleLanguageSelect('en')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-full font-medium shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition duration-300"
          >
            English
          </button>
          <button
            onClick={() => handleLanguageSelect('bn')}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-full font-medium shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition duration-300"
          >
            Bengali
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguagePopup;