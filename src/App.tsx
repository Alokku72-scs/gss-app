import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Result from './components/Result';
import LanguageSelector from './components/LanguageSelector';


function App() {
  const { t } = useTranslation();

  return (
    <div className="bg-[#FDF1E5] min-h-screen">
      <Router>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;