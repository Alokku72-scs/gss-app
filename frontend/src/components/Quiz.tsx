import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { useLocation } from "react-router-dom";

interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const Quiz: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const location = useLocation();
  const  selectedLanguage  = location.state || { selectedLanguage: "en" };

  const questions: Question[] = t('questions', { returnObjects: true }) as Question[];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<{ [key: number]: number }>({});
  const [score, setScore] = useState(0);
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    if (!userName) {
      navigate('/');
    }
  }, [navigate]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption({
      ...selectedOption,
      [currentQuestionIndex]: optionIndex
    });
  };

  useEffect(() => {
    const handleSubmit = async () => {

      const totalScore = score;
      const percentage = score;

      localStorage.setItem('quizScore', totalScore.toString());
      localStorage.setItem('quizPercentage', percentage.toString());

      const response = await fetch("https://gss.i-saksham.org/quiz/save-quiz-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedLanguage:selectedLanguage.language,
          answers: Object.keys(selectedOption).map(index => ({
            question: questions[Number(index)].text,
            selectedOption: questions[Number(index)].options[selectedOption[Number(index)]]
          }))
        })
      });

      if (response.ok) {
        navigate('/result');
      } else {
        console.error('Error saving quiz data');
      }
    };

    if (submit) {
      handleSubmit();
    }
  }, [submit]);

  const handleNext = () => {
    const selected = selectedOption[currentQuestionIndex];
    if (questions[currentQuestionIndex].correctAnswer === selected) {
      setScore(score + 10);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setSubmit(true);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
      <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {t('question')} {currentQuestionIndex + 1} {t('of')} {questions.length}
                </h2>
                <div className="text-sm text-gray-500">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-[#EF7F1A] h-2.5 rounded-full"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedOption[currentQuestionIndex] === index
                        ? 'bg-[#FDF1E5] border-[#EF7F1A]'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionSelect(index)}
                  >
                    <div className="flex items-start">
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full border ${
                        selectedOption[currentQuestionIndex] === index
                          ? 'border-[#EF7F1A] bg-[#EF7F1A] text-white'
                          : 'border-gray-300'
                      } mr-3 flex-shrink-0 mt-0.5`}>
                        {selectedOption[currentQuestionIndex] === index && '✓'}
                      </div>
                      <span>{option}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleNext}
                disabled={selectedOption[currentQuestionIndex] === undefined}
                className={`flex items-center px-4 py-2 rounded-md ${
                  selectedOption[currentQuestionIndex] === undefined
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-[#EF7F1A] text-white hover:bg-[#D06C15]'
                }`}
              >
                {currentQuestionIndex === questions.length - 1 ? t('submit') : t('next')}
                {currentQuestionIndex < questions.length - 1 && <ChevronRight size={20} className="ml-1" />}
              </button>
            </div>
          </div>
      </div>
  );
};

export default Quiz;
