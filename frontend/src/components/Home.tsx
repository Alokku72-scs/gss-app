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
  const [language, setLanguage] = useState("English");
  const [showPopup, setShowPopup] = useState(true)

  const changeLanguage = (lng: string, lng1: string) => {
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
    // { code: "zh", name: "中文 (Chinese)" },
    // { code: "es", name: "Español (Spanish)" },
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
        const response = await fetch("http://localhost:5000/quiz/total-visits");
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
      navigate("/quiz", { state: { language } });
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
        <div className="bg-white p-3 rounded-2xl shadow-2xl text-center max-w-lg mx-auto border border-[#EF7F1A] w-full max-w-2xl">
          <img src={logo} alt="Logo" className="mx-auto mb-4 w-24" />

          <h2 className=" text-2xl ">
            How <strong>gender sensitive</strong> is your community ?
          </h2>
          <p>Answer simple observations and sence it. Take the quiz now</p>
          <p className="mt-1">An awareness initiative by I-Saksham: <span className="font-bold">Promoting Voice and Choice for Every Women</span></p>

          <div className="text-[#EF7F1A] text-3xl mt-2 animate-bounce">🌐</div>

          <p className="text-gray-700 mt-2 text-lg">Please select your preferred language:</p>

          <div className="grid grid-cols-2 gap-3 mt-6">
            {allLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code, language.name)}
                className="bg-[#D06C15] text-white py-3 px-5 rounded-lg font-semibold 
                   hover:bg-[#B75A10] hover:scale-105 transition duration-300 shadow-md"
               >
                {language.name}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-6 px-6 italic leading-relaxed">
            Disclaimer: The language translations may not be completely correct as this is an AI-generated quiz.
            <span className="font-semibold">I-Saksham Education and Learning Foundation</span> is making an effort to promote a gender-equal society.
          </p>
        </div>
      ) : showPopup ? (
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-[810px] mx-auto border border-orange-300">
          {/* Back Button */}
          <div className="flex items-center mb-2">
            <button
              className="ml-0 p-2 rounded-full bg-orange-100 hover:bg-orange-200 transition duration-300"
              onClick={handleSelectedLanguage}
            >
              <ArrowLeft size={25} className="text-orange-600" />
            </button>
            {/* Logo */}
            <img src={logo} alt="Logo" className="mx-auto  w-28" />
          </div>



          {/* Title */}
          <h1 className="text-3xl font-bold text-orange-600">{t('siteTitle')}</h1>

          {/* Description */}
          <p className="mt-3 text-gray-600 text-lg leading-relaxed">
            {t('genderQuizIntro')}
          </p>
          <p className="mt-2 text-gray-500 text-base">
            You can select one or more options for each question. You will be given
            <span className="font-semibold text-orange-500"> 0 to 4 points </span>
            based on your answers.
          </p>

          {/* Total Visitors */}
          <div className="mt-5 bg-orange-200 text-orange-900 px-5 py-2 rounded-lg inline-block shadow">
            <span className="font-semibold">🌍 Total Visitors:</span> {visitCount}
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-3 bg-gray-100 text-gray-500 text-sm rounded-md shadow-inner italic">
            <span className="font-semibold text-gray-700">Disclaimer:</span> The language translations may not be completely accurate
            as this is an AI-generated quiz. <span className="font-semibold">I-Saksham Education and Learning Foundation</span>
            is making an effort to promote a gender-equal society.
          </div>

          {/* Button */}
          <button
            onClick={handleClosePopup}
            className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-7 py-3 rounded-full 
               shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
          >
            Got It! →
          </button>
        </div>

      ) : (
        <div className="bg-white p-10 rounded-2xl shadow-2xl text-center w-[650px] mx-auto border border-orange-300">
          {/* Back Button */}
          <div className="flex items-center mb-2">
            <button
              className="ml-0 p-2 rounded-full bg-orange-100 hover:bg-orange-200 transition duration-300"
              onClick={handleSelectedLanguage}
            >
              <ArrowLeft size={25} className="text-orange-600" />
            </button>
            {/* Logo */}
            <img src={logo} alt="Logo" className="mx-auto  w-28" />
          </div>
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-center text-[#EF7F1A] mb-4">
            {t("welcome")}
          </h1>

          {/* Intro Text */}
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {t("intro")}
          </p>

          {/* Form */}
          <form onSubmit={handleStartQuiz} className="max-w-md mx-auto">
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                {t("enterName")}
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-orange-400 
                         shadow-sm transition duration-300"
                required
              />
            </div>

            {/* Start Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 
                       text-white py-3 px-6 rounded-full font-bold shadow-lg 
                       hover:scale-105 hover:shadow-xl transition-transform duration-300"
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