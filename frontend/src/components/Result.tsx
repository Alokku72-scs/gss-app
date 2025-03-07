import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Download, Mail, RefreshCw } from 'lucide-react';
import { generateCertificateImages } from '../utils/certificateUtils';
import ShareButton from './ShareButton';
import logo from "../assets/logo.png";
import emailjs from "@emailjs/browser";

const Result: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const certificateRef = useRef<HTMLDivElement>(null);

  const [userName, setUserName] = useState('');
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [email, setEmail] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedScore = localStorage.getItem('quizScore');
    const storedPercentage = localStorage.getItem('quizPercentage');

    if (!storedName || !storedScore || !storedPercentage) {
      navigate('/');
      return;
    }
    const numericPercentage = parseInt(storedPercentage, 10);

    if (numericPercentage > 90) {
      setMessage(t('VOICE_CHOICE_LEADER'));
    } else if (numericPercentage > 70 && numericPercentage <= 90) {
      setMessage(t('VOICE_CHOICE_CHAMPION'));
    } else if (score > 50 && score <= 70) {
      setMessage(t('VOICE_CHOICE_AWARE'));
    } else {
      setMessage(t('VOICE_CHOICE_MINDSET_SHIFT'));
    }

    setUserName(storedName);
    setScore(parseInt(storedScore, 10));

    const percentValue = parseFloat(storedPercentage);
    setPercentage(percentValue);

  }, [navigate, t]);

  const handleTryAgain = () => {
    navigate('/');
  };

  const handleGenerateCertificate = async () => {
    if (!certificateRef.current) return null;

    try {
      const certificate = await generateCertificateImages(certificateRef.current, {
        title: 'My Gender Sensitivity Certificate',
        text: `I scored ${percentage.toFixed(1)}% on the Gender Sensitivity Quiz!`,
        hashtags: ['GenderSensitivity', 'ISaksham']
      });
      console.log("handleGenerateCertificate: PNG URL= ", certificate.pngUrl);
      return certificate;
    } catch (error) {
      console.error('Error generating certificate:', error);
      return null;
    }
  };
  //   const handleGenerateCertificate = async () => {
  //     if (!certificateRef.current) return null;

  //     try {
  //       const certificate = await generateCertificateImages(certificateRef.current, {
  //         title: 'My Gender Sensitivity Certificate',
  //         text: `I scored ${percentage.toFixed(1)}% on the Gender Sensitivity Quiz!`,
  //         hashtags: ['GenderSensitivity', 'ISaksham']
  //       });

  //       console.log("Temporary Certificate PNG URL:", certificate.pngUrl);

  //       // Convert data URL to Blob
  //       const response = await fetch(certificate.pngUrl);
  //       const blob = await response.blob();
  //       const formData = new FormData();
  //       formData.append('certificate', blob, `${userName}_certificate.png`);
  //       formData.append('userName', userName);
  //       formData.append('percentage', percentage.toFixed(1));

  //       // Send to backend
  //       const uploadResponse = await fetch('http://localhost:5000/quiz/upload-certificate', {
  //         method: 'POST',
  //         body: formData
  //       });

  //       const data = await uploadResponse.json(); // Get response from backend
  //       console.log('Saved Certificate URL1:', data.fileUrl);
  //       console.log("Saved Certificate URL:", data.filePath); // This is the permanent URL

  //       return data.filePath; // Use this permanent URL
  //     } catch (error) {
  //       console.error('Error generating certificate:', error);
  //       return null;
  //     }
  // };


  const handleDownloadCertificate = async () => {
    setIsGeneratingPDF(true);

    try {
      const certificate = await handleGenerateCertificate();
      if (certificate) {
        const link = document.createElement('a');
        link.href = certificate.pdfUrl;
        link.download = `${userName}_gender_sensitivity_certificate.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        certificate.cleanup();
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Result summary */}
      <div className="bg-white rounded-lg shadow-lg m-2">
        <div className='flex flex-col items-center justify-center m-4'>
          <p className="text-center text-3xl font-bold m-2">🎊{t('congratulations')}, {userName}!🎊</p>
          <p className='text-center text-2xl m-2'>{t('yourScore')} {score}</p>
        </div>

        <div className="text-center p-2 rounded-lg p-2 bg-[#EF7F1A]">
          <p className="text-xl">
            {t('youAre')}
          </p>
          <p className='text-2xl font-bold text-[#222]'>
            {message ? message : "Default text"}
          </p>
        </div>
      </div>

      {/* Certificate */}
      <div className="bg-white rounded-lg shadow-lg m-8">

        <div
          ref={certificateRef}
          className="border-8 border-[#EF7F1A] rounded-lg p-8 bg-white mb-4"
          style={{
            backgroundImage: 'linear-gradient(45deg, rgba(239, 127, 26, 0.05) 25%, transparent 25%, transparent 50%, rgba(239, 127, 26, 0.05) 50%, rgba(239, 127, 26, 0.05) 75%, transparent 75%, transparent)',
            backgroundSize: '40px 40px'
          }}
        >
         
          <div className="text-center bg-white rounded-lg shadow-lg py-8 px-12">
            {/* Logo */}
            <div className="flex justify-center m-2">
              <img src={logo} alt="I-Saksham Logo" className="h-16 object-contain" />
            </div>
            <br/>
            {/* Certification Text */}
            <p className="text-xl font-medium text-[#222] m-2">{t('thisIsToCertifyThat')}</p>

            <p className='m-8'>
              <p className="text-4xl font-extrabold text-[#EF7F1A] my-4">{userName}</p>
              <div className="flex justify-center">
                <div className="w-60 h-1 bg-[#EF7F1A] rounded-full"></div>
              </div>
            </p>

            {/* Certificate Description */}
            <p className="text-xl font-medium text-[#222] m-6 leading-relaxed">
              {t('certificateFrom')}

            </p>
            <br/>
            {/* Organization Footer */}
            <p className="text-[#EF7F1A] m-2">
              <span className='font-bold'>
              I-Saksham Education and Learning Foundation
              </span>
              <br/>
              <span className='font-semibold'>
              {t('voice')}
              </span>
            </p>
          </div>

        </div>

        {/* Certificate actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div>
            <div className="flex flex-row flex-wrap gap-2">
              <button
                  onClick={handleDownloadCertificate}
                  disabled={isGeneratingPDF}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 disabled:bg-green-400"
                >
                  <Download size={20} className="mr-2" />
                  {isGeneratingPDF ? 'Generating...' : t('downloadCertificate')}
              </button>
              <ShareButton onShare={handleGenerateCertificate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;