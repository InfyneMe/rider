'use client';

import { useState, useEffect } from 'react';
import LanguagePopup from './Language';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';

const App: React.FC = () => {
  const [language, setLanguage] = useState<string | null>(null);

  // Translations for different languages
  const translations: Record<string, any> = {
    en: {
      words: [
        { text: 'Welcome' },
        { text: 'to' },
        { text: 'Rider.', className: 'text-blue-500 dark:text-blue-500' },
      ],
      placeholders: {
        startLocation: 'Start Location',
        destinationLocation: 'Destination Location',
        dateTime: 'Select Date & Time',
      },
    },
    bn: {
      words: [
        { text: 'স্বাগতম' },
        { text: 'আপনার', className: 'text-blue-500 dark:text-blue-500' },
        { text: 'রাইডার এ।' },
      ],
      placeholders: {
        startLocation: 'শুরু স্থান',
        destinationLocation: 'গন্তব্য স্থান',
        dateTime: 'তারিখ এবং সময় নির্বাচন করুন',
      },
    },
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('appLanguage', lang);
  };

  const currentTranslations = translations[language || 'en'];

  return (
    <>
      {!language && <LanguagePopup onSelectLanguage={handleLanguageChange} />}
      <div className="flex flex-col items-center min-h-screen px-4 sm:px-8" style={{ backgroundImage: "url('/map4.jpg')"}}>
        <div className="mt-10">
            {language && (
              <TypewriterEffectSmooth
                words={currentTranslations.words}
                className="text-center text-3xl font-semibold text-gray-800"
              />
            )}
          <div className="w-full max-w-4xl border border-stone-400 bg-gray-100 shadow-2xl rounded-lg p-8 space-y-8">
            <form className="flex flex-wrap gap-6 items-center justify-between">
              <input
                type="text"
                placeholder={currentTranslations.placeholders.startLocation}
                className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full min-w-[200px]"
              />
              <input
                type="text"
                placeholder={currentTranslations.placeholders.destinationLocation}
                className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full min-w-[200px]"
              />
              <input
                type="datetime-local"
                className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full min-w-[200px]"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-3 rounded-md font-medium shadow-md hover:bg-blue-600 transition duration-300 min-w-[150px]"
              >
                {language === 'bn' ? 'অনুরোধ করুন' : 'Request Ride'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;