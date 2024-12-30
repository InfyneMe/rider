'use client';
import { useState, useEffect } from 'react';
import LanguagePopup from './Language';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';

interface Suggestion {
  place_id: string;
  description: string;
}

const App: React.FC = () => {
  const [language, setLanguage] = useState<string | null>(null);
  const [startFrom, setStartForm] = useState<string>('');
  const [endsAt, setEndsAt] = useState<string>('');
  const [startSuggestions, setStartSuggestions] = useState<Suggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Suggestion[]>([]);

  const fetchSuggestions = async (userInput: string, setter: React.Dispatch<React.SetStateAction<Suggestion[]>>) => {
    if (!userInput) {
      setter([]);
      return;
    }

    try {
      const response = await fetch(`/api/place?input=${userInput}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');

      const data = await response.json();
      if (data.locData && data.locData.predictions) {
        const newSuggestions = data.locData.predictions.map((prediction: any) => ({
          place_id: prediction.place_id,
          description: prediction.description,
        }));
        setter(newSuggestions);
      } else {
        setter([]);
      }
    } catch (error) {
      console.error('Error fetching Google Places predictions:', error);
    }
  };

  const handleStartForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setStartForm(userInput);
    fetchSuggestions(userInput, setStartSuggestions);
  };

  const handleEndsAt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setEndsAt(userInput);
    fetchSuggestions(userInput, setDestinationSuggestions);
  };

  const handleSuggestionClick = (
    description: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    suggestionsSetter: React.Dispatch<React.SetStateAction<Suggestion[]>>
  ) => {
    setter(description);
    suggestionsSetter([]); // Clear suggestions on selection
  };

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
        { text: 'আপনার' },
        { text: 'রাইডার এ।', className: 'text-blue-500 dark:text-blue-500' },
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
      <div className="flex flex-col items-center min-h-screen px-4 sm:px-8" style={{ backgroundImage: "url('/map5.jpg')" }}>
        <div className="mt-10">
          {language && (
            <TypewriterEffectSmooth
              words={currentTranslations.words}
              className="text-center text-3xl font-semibold text-gray-800"
            />
          )}
          <div className="w-full max-w-4xl border border-stone-400 bg-gray-100 shadow-2xl rounded-lg p-8">
            <div className="relative flex flex-wrap gap-6 items-center justify-between">
              {/* Start Location */}
              <div className="relative flex-1">
                <input
                  id="startFrom"
                  type="text"
                  value={startFrom}
                  onChange={handleStartForm}
                  placeholder={currentTranslations.placeholders.startLocation}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {startSuggestions.length > 0 && (
                  <ul className="absolute left-0 top-full z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1 max-h-60 overflow-y-auto">
                    {startSuggestions.map((suggestion) => (
                      <li
                        key={suggestion.place_id}
                        onClick={() => handleSuggestionClick(suggestion.description, setStartForm, setStartSuggestions)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        {suggestion.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Destination Location */}
              <div className="relative flex-1">
                <input
                  id="destination"
                  type="text"
                  value={endsAt}
                  onChange={handleEndsAt}
                  placeholder={currentTranslations.placeholders.destinationLocation}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {destinationSuggestions.length > 0 && (
                  <ul className="absolute left-0 top-full z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1 max-h-60 overflow-y-auto">
                    {destinationSuggestions.map((suggestion) => (
                      <li
                        key={suggestion.place_id}
                        onClick={() => handleSuggestionClick(suggestion.description, setEndsAt, setDestinationSuggestions)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        {suggestion.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Date-Time Picker */}
              <input
                type="datetime-local"
                className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-3 rounded-md font-medium shadow-md hover:bg-blue-600 transition duration-300"
              >
                {language === 'bn' ? 'অনুরোধ করুন' : 'Request Ride'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
