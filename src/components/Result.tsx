// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import { Award, Download, Mail, RefreshCw, Share2 } from 'lucide-react';
//
// const Result: React.FC = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const certificateRef = useRef<HTMLDivElement>(null);
//
//   const [userName, setUserName] = useState('');
//   const [score, setScore] = useState(0);
//   const [percentage, setPercentage] = useState(0);
//   const [category, setCategory] = useState({ title: '', message: '' }); // Initialize as an object
//   const [email, setEmail] = useState('');
//   const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
//   const [isSendingEmail, setIsSendingEmail] = useState(false);
//
//   useEffect(() => {
//     const storedName = localStorage.getItem('userName');
//     const storedScore = localStorage.getItem('quizScore');
//     const storedPercentage = localStorage.getItem('quizPercentage');
//
//     if (!storedName || !storedScore || !storedPercentage) {
//       navigate('/');
//       return;
//     }
//
//     setUserName(storedName);
//     setScore(parseInt(storedScore, 10));
//
//     const percentValue = parseFloat(storedPercentage);
//     setPercentage(percentValue);
//
//     // Set category as an object with title and message
//     if (percentValue >= 80) {
//       setCategory({
//         title: t('genderChampion'),
//         message: "Congratulations! You are highly sensitive to gender equality and can bring positive change in society."
//       });
//     } else if (percentValue >= 60) {
//       setCategory({
//         title: t('genderSensitive'),
//         message: "You are sensitive to gender equality, but there is still room to learn and develop."
//       });
//     } else {
//       setCategory({
//         title: t('genderAware'),
//         message: t('You are aware of gender issues, but need to deepen your understanding further')
//       });
//     }
//   }, [navigate, t]);
//
//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
//         <h1 className="text-3xl font-bold text-center mb-6">
//           {t('yourScore')}: {percentage.toFixed(1)}%
//         </h1>
//
//         <div className={`text-center p-6 rounded-lg mb-6 ${
//           percentage >= 80
//             ? 'bg-green-100 text-green-800'
//             : percentage >= 60
//               ? 'bg-blue-100 text-blue-800'
//               : 'bg-yellow-100 text-yellow-800'
//         }`}>
//           <h2 className="text-2xl font-bold mb-2">{t('congratulations')}, {userName}!</h2>
//           <p className="text-xl font-bold">{category.title}</p>  {/* Fix: Render category.title */}
//           <p className="text-lg mt-2">{category.message}</p>     {/* Fix: Render category.message */}
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default Result;


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Award, Download, Mail, RefreshCw, Share2 } from 'lucide-react';
import logo from '../assets/logo.png';

const Result: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const certificateRef = useRef<HTMLDivElement>(null);

  const [userName, setUserName] = useState('');
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [category, setCategory] = useState('');
  const [email, setEmail] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedScore = localStorage.getItem('quizScore');
    const storedPercentage = localStorage.getItem('quizPercentage');

    if (!storedName || !storedScore || !storedPercentage) {
      navigate('/');
      return;
    }

    setUserName(storedName);
    setScore(parseInt(storedScore, 10));

    const percentValue = parseFloat(storedPercentage);
    setPercentage(percentValue);

    // Determine category based on percentage
    if (percentValue >= 80) {
      setCategory(t('genderChampion'));
    } else if (percentValue >= 60) {
      setCategory(t('genderSensitive'));
    } else {
      setCategory(t('genderAware'));
    }
//     if (percentValue >= 80) {
//       setCategory({
//         title: t('genderChampion'),
//         message: "Congratulations! You are highly sensitive to gender equality and can bring positive change in society."
//       });
//     } else if (percentValue >= 60) {
//       setCategory({
//         title: t('genderSensitive'),
//         message: "You are sensitive to gender equality, but there is still room to learn and develop."
//       });
//     } else {
//       setCategory({
//         title: t('genderAware'),
//         message: "You are aware of gender issues, but need to deepen your understanding further."
//       });
  }, [navigate, t]);

  const handleTryAgain = () => {
    navigate('/');
  };

  const handleDownloadCertificate = async () => {
    if (!certificateRef.current) return;

    setIsGeneratingPDF(true);

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${userName}_gender_sensitivity_certificate.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShareCertificate = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');

      if (navigator.share) {
        await navigator.share({
          title: 'My Gender Sensitivity Certificate',
          text: `I scored ${percentage.toFixed(1)}% on the Gender Sensitivity Quiz!`,
          url: imgData
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const shareText = `I scored ${percentage.toFixed(1)}% on the Gender Sensitivity Quiz!`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
      }
    } catch (error) {
      console.error('Error sharing certificate:', error);
    }
  };

  const handleSendEmail = async () => {
    if (!email || !certificateRef.current) return;

    setIsSendingEmail(true);

    try {
      // In a real application, you would send the email through a backend service
      // This is a simulation for the demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`Certificate would be sent to ${email} in a real application.`);
      setEmail('');
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Result summary */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <p className="text-xl font-bold text-center mb-5 bg-yellow-100 text-yellow-800 p-2">
        {t('congratulations')}, {userName}!  {t('youAre')} <span className="font-bold">{category}</span>,
        {t('yourScore')}: {percentage.toFixed(1)}%
       
          <div className="flex justify-center">
          <button
            onClick={handleTryAgain}
            className="flex items-center mt-2 px-6 py-2 bg-gray-200 text-gray-500 rounded-md hover:bg-gray-300 transition duration-300"
          >
            <RefreshCw size={20} className="mr-2" />
            {t('tryAgain')}
          </button>
        </div>
        </p>
        

       
      </div>

      {/* Certificate */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">{t('certificateFrom')}</h2>

        <div
          ref={certificateRef}
          className="border-8 border-[#EF7F1A] rounded-lg p-8 bg-white mb-6"
          style={{
            backgroundImage: 'linear-gradient(45deg, rgba(239, 127, 26, 0.05) 25%, transparent 25%, transparent 50%, rgba(239, 127, 26, 0.05) 50%, rgba(239, 127, 26, 0.05) 75%, transparent 75%, transparent)',
            backgroundSize: '40px 40px'
          }}
        >
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {/*<Award size={80} className="text-[#EF7F1A]" /> */}
              <img src={logo} />
            </div>

            <h1 className="text-4xl font-bold text-[#EF7F1A] mb-2">{category}</h1>
            <h2 className="text-2xl font-semibold mb-6">{t('certificateFrom')}</h2>

            <p className="text-xl mb-4">
              {t('thisIsToCertifyThat')}
            </p>

            <p className="text-3xl font-bold mb-4 text-[#EF7F1A]">
              {userName}
            </p>

            <p className="text-xl mb-6">
              {t('hasCompletedTheGenderSensitivityQuiz')} <br />
              {t('withAScoreOf')} <span className="font-bold">{percentage.toFixed(1)}%</span>
            </p>

            <div className="flex justify-center mb-4">
              <div className="w-48 h-1 bg-[#EF7F1A]"></div>
            </div>

            <p className="text-lg">
              i-Saksham: Empowering Young Women Leaders in Bihar
            </p>
          </div>
        </div>

        {/* Certificate actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-3">{t('shareTitle')}</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleShareCertificate}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                <Share2 size={20} className="mr-2" />
                Share
              </button>

              <button
                onClick={handleDownloadCertificate}
                disabled={isGeneratingPDF}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 disabled:bg-green-400"
              >
                <Download size={20} className="mr-2" />
                {isGeneratingPDF ? 'Generating...' : t('downloadCertificate')}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">{t('emailCertificate')}</h3>
            <div className="flex space-x-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF7F1A]"
              />

              <button
                onClick={handleSendEmail}
                disabled={!email || isSendingEmail}
                className="flex items-center px-4 py-2 bg-[#EF7F1A] text-white rounded-md hover:bg-[#D06C15] transition duration-300 disabled:bg-[#F8C093]"
              >
                <Mail size={20} className="mr-2" />
                {isSendingEmail ? 'Sending...' : t('send')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;