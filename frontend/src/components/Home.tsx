import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.png";
import { ArrowLeft } from "lucide-react";

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [visitCount, setVisitCount] = useState(0);
  //const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [language,setLanguage] = useState("English");
  const [showPopup, setShowPopup] = useState(true)

  const changeLanguage = (lng: string,lng1:string) => {
    i18n.changeLanguage(lng);
    setShowPopup(true); // Show the popup
    setSelectedLanguage(lng); // Show quiz UI
    setLanguage(lng1);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const worldLanguages = [
    { code: "en", name: "English" },
    { code: "zh", name: "中文 (Chinese)" },
    { code: "es", name: "Español (Spanish)" },
    { code: "ar", name: "العربية (Arabic)" },
    { code: "hi", name: "हिन्दी (Hindi)" },
  ];

  const indianLanguages = [
    { code: "hi", name: "हिन्दी (Hindi)" },
    { code: "bn", name: "বাংলা (Bengali)" },
    { code: "te", name: "తెలుగు (Telugu)" },
    { code: "mr", name: "मराठी (Marathi)" },
    { code: "ta", name: "தமிழ் (Tamil)" },
    { code: "gu", name: "ગુજરાતી (Gujarati)" },
    { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
    { code: "ml", name: "മലയാളം (Malayalam)" },
    { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" },
    { code: "or", name: "ଓଡ଼ିଆ (Odia)" },
  ];

  const allLanguages = [
    ...worldLanguages,
    ...indianLanguages.filter(
      (lang) => !worldLanguages.some((wLang) => wLang.code === lang.code)
    ),
  ];

  useEffect(() => {
    const fetchTotalVisits = async () => {
        try {
            const response = await fetch("http://20.197.54.245/quiz/total-visits");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setVisitCount(data.totalVisits || 0); // Ensure a default value of 0
        } catch (error) {
            console.error("Error fetching total visits:", error);
        }
    };

    fetchTotalVisits();
}, []);




  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem("userName", name);
      navigate("/quiz",{state:{language}});
    }
  };

    const handleSelectedLanguage = () => {
    setSelectedLanguage(null);
    setShowPopup(false);
  }


  return (
    <div className="flex items-center justify-center min-h-screen">
      {!selectedLanguage ? (
        // Language selection UI
        <div className="bg-white p-8 rounded-lg shadow-lg text-center w-[600px]">
          <img src={logo} alt="Logo" className="mx-auto mb-2" />
          <h2 className="text-[#EF7F1A] text-xl font-semibold">
            Gender Sensitivity Quiz
          </h2>
          <div className="text-[#EF7F1A] text-2xl mt-2">🌐</div>
          <p className="text-gray-600 mt-2">Please select your preferred language:</p>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {allLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code,language.name)}
                className="bg-[#D06C15] text-white py-2 px-4 rounded-md hover:bg-[#B75A10] transition duration-300"
              >
                {language.name}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-4 px-4">
            Disclaimer: The language translations may not be completely correct as this is an AI-generated quiz.
            I-Saksham Education and Learning Foundation is making an effort to promote a gender-equal society.
          </p>
        </div>
      ) : showPopup ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center w-[800px]">
          <div className="flex items-center">
            <button
              className="ml-0"
              onClick={handleSelectedLanguage}
            >
              <ArrowLeft size={25} className="rounded"/>
            </button>
          </div>
          <img src={logo} alt="Logo" className="mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-orange-600">{t('siteTitle')}</h1>
          <p className="mt-2 text-gray-600">
            {t('genderQuizIntro')}
          </p>
          <p className="mt-2 text-gray-500">
            You can select one or more options for each question. You will be given 0 to 4 points based on your answers.
          </p>
          <div className="mt-4 bg-orange-100 text-orange-700 px-4 py-2 rounded-lg inline-block">
            Total Visitors: {visitCount}
          </div>
          <div className="mt-6 p-2 bg-gray-100 text-gray-500 text-sm rounded-md">
            Disclaimer: The language translations may not be completely correct as it is an AI-generated quiz. I-Saksham Education and Learning Foundation is making an effort to promote a gender-equal society.
          </div>
          <button
            onClick={handleClosePopup}
            className="mt-8 bg-orange-500 text-white px-6 py-2 rounded-full shadow hover:bg-orange-600"
          >
            Got It! →
          </button>
        </div>

      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center w-[600px]">
          <div className="flex items-center">
            <button
              className="ml-0"
              onClick={handleSelectedLanguage}
            >
              <ArrowLeft size={25} className="rounded"/>
            </button>
          </div>
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" />
          </div>
          <h1 className="text-3xl font-bold text-center text-[#EF7F1A] mb-6">
            {t("welcome")}
          </h1>
          <p className="text-lg text-center mb-8">{t("intro")}</p>
          <form onSubmit={handleStartQuiz} className="max-w-md mx-auto">
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 mb-2">
                {t("enterName")}
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF7F1A]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#EF7F1A] text-white py-3 px-6 rounded-md hover:bg-[#D06C15] transition duration-300 font-bold"
            >
              {t("startQuiz")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default Home;