import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';

interface Question {
  text: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
}

const Quiz: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const questions: Question[] = t('questions', { returnObjects: true });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number[] }>({});
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    if (!userName) {
      navigate('/');
    }
  }, [navigate]);

  const handleOptionToggle = (optionIndex: number) => {
    setSelectedOptions(prev => {
      const current = prev[currentQuestionIndex] || [];
      const updated = current.includes(optionIndex)
        ? current.filter(idx => idx !== optionIndex)
        : [...current, optionIndex];

      return {
        ...prev,
        [currentQuestionIndex]: updated
      };
    });
  };

  const calculateScore = (questionIndex: number, selected: number[]) => {
    const question = questions[questionIndex];
    const correctAnswers = question.correctAnswers;

    if (selected.length === correctAnswers.length && correctAnswers.every(ans => selected.includes(ans))) {
      return 4; // Full score
    }
    if (selected.length > 0 && selected.every(sel => correctAnswers.includes(sel))) {
      return 3; // Good score
    }
    if (selected.some(sel => correctAnswers.includes(sel))) {
      return 2; // Partial score
    }
    if (selected.length > 0) {
      return 1; // Low score
    }
    return 0;
  };

  const handleNext = () => {
    const selected = selectedOptions[currentQuestionIndex] || [];
    const score = calculateScore(currentQuestionIndex, selected);

    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: score
    }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0) + score;
      const maxPossibleScore = questions.length * 4;
      const percentage = (totalScore / maxPossibleScore) * 100;

      localStorage.setItem('quizScore', totalScore.toString());
      localStorage.setItem('quizPercentage', percentage.toString());

      navigate('/result');
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const selectedOptionsForCurrentQuestion = selectedOptions[currentQuestionIndex] || [];
  const isNextDisabled = selectedOptionsForCurrentQuestion.length === 0; // Disable if no option is selected

  return (
      <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
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
                      selectedOptionsForCurrentQuestion.includes(index)
                        ? 'bg-[#FDF1E5] border-[#EF7F1A]'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionToggle(index)}
                  >
                    <div className="flex items-start">
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full border ${
                        selectedOptionsForCurrentQuestion.includes(index)
                          ? 'border-[#EF7F1A] bg-[#EF7F1A] text-white'
                          : 'border-gray-300'
                      } mr-3 flex-shrink-0 mt-0.5`}>
                        {selectedOptionsForCurrentQuestion.includes(index) && '✓'}
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
                disabled={isNextDisabled}
                className={`flex items-center px-4 py-2 rounded-md ${
                  isNextDisabled
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
