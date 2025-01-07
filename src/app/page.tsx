'use client';
import { useState, useEffect } from 'react';
import LanguagePopup from './Language';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import AdSense from '@/components/AdSense';


interface Suggestion {
  place_id: string;
  description: string;
}

const App: React.FC = () => {
  const [language, setLanguage] = useState<string | null>(null);
  const [startFrom, setStartForm] = useState<string>('');
  const [endsAt, setEndsAt] = useState<string>('');
  const [dateTime, setDateTime] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<string>('Auto'); // New state for selected vehicle type
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
        const newSuggestions = data.locData.predictions.map((prediction: Suggestion) => ({
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

  const translations: Record<
    string,
    {
      words: { text: string; className?: string }[];
      placeholders: {
        startLocation: string;
        destinationLocation: string;
        dateTime: string;
      };
      vehicleOptions: {
        auto: string;
        toto: string;
        taxi: string;
        car: string;
      };
    }
  > = {
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
      vehicleOptions: {
        auto: 'Auto',
        toto: 'Toto',
        taxi: 'Taxi',
        car: 'Car',
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
      vehicleOptions: {
        auto: 'অটো',
        toto: 'টোটো',
        taxi: 'ট্যাক্সি',
        car: 'গাড়ি',
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
      <div className="flex flex-col items-center min-h-screen px-4 sm:px-8" style={{ backgroundImage: "url('/map6.jpg')" }}>
        <div className="mt-10">
          {language && (
            <TypewriterEffectSmooth
              words={currentTranslations.words}
              className="text-center text-3xl font-semibold text-gray-800"
            />
          )}
        </div>
        <div className="w-full max-w-4xl border border-stone-400 bg-gray-200 shadow-2xl rounded-lg p-8">
          {/* First Row: Start Location & Destination Location */}
          <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 mb-4">
            <div className="relative w-full sm:w-[45%]">
              <input
                id="startFrom"
                type="text"
                value={startFrom}
                onChange={handleStartForm}
                placeholder={currentTranslations.placeholders.startLocation}
                className="w-full sm:w-[24rem] px-4 py-3 rounded-md bg-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <div className="relative w-full sm:w-[45%]">
              <input
                id="destination"
                type="text"
                value={endsAt}
                onChange={handleEndsAt}
                placeholder={currentTranslations.placeholders.destinationLocation}
                className="w-full sm:w-[26.2rem] px-4 py-3 rounded-md bg-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          </div>

          {/* Second Row: Vehicle Type, Date-Time Picker, Submit Button */}
          <div className="flex flex-col sm:flex-row sm:gap-8 mb-4">
            {/* Vehicle Type Dropdown */}
            <div className="w-full sm:w-[30%] mb-4 sm:mb-0">
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full sm:w-[16rem] h-[3.3rem] px-4 py-3 rounded-md bg-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Auto">{currentTranslations.vehicleOptions.auto}</option>
                <option value="Toto">{currentTranslations.vehicleOptions.toto}</option>
                <option value="Taxi">{currentTranslations.vehicleOptions.taxi}</option>
                <option value="Car">{currentTranslations.vehicleOptions.car}</option>
              </select>
            </div>


            {/* Date-Time Picker */}
            <div className="w-full sm:w-[30%] mb-4 sm:mb-0">
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full sm:w-[16rem] px-4 py-3 rounded-md bg-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              onClick={() => {
                const formatDate = new Date(dateTime).toLocaleDateString();

                // Conditional message based on language
                const message =
                  language === 'bn'
                    ? `হ্যালো, আমি একটি ${vehicleType} রাইড চাই ${startFrom} থেকে ${endsAt} পর্যন্ত, ${formatDate} তারিখে।`
                    : `Hi, I want to request a ${vehicleType} ride from ${startFrom} to ${endsAt} on ${formatDate}`;

                const phoneNumber = '919387651141'; // Replace with your WhatsApp number
                const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                window.location.href = whatsappURL;
              }}
              className="w-full sm:w-[30%] px-6 py-3 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600"
            >
              {language === 'bn' ? 'সাবমিট' : 'Submit'}
            </button>

          </div>
        </div>
        <AdSense />
      </div>
    </>
  );
};

export default App;
