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
  const [category, setCategory] = useState('');
  const [email, setEmail] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [message1, setMessage1] = useState("");
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedScore = localStorage.getItem('quizScore');
    const storedPercentage = localStorage.getItem('quizPercentage');
    console.log("storedScore", storedScore);
    // console.log("Score",score);

    if (!storedName || !storedScore || !storedPercentage) {
      navigate('/');
      return;
    }
    const numericPercentage = parseInt(storedPercentage, 10);

    if (numericPercentage > 90) {
      setMessage1(t('VOICE_CHOICE_LEADER'));
    } else if (numericPercentage > 70 && numericPercentage <= 90) {
      setMessage1(t('VOICE_CHOICE_CHAMPION'));
    } else if (score > 50 && score <= 70) {
      setMessage1(t('VOICE_CHOICE_AWARE'));
    } else {
      setMessage1(t('VOICE_CHOICE_MINDSET_SHIFT'));
    }

    console.log("message1:", message1);
    setUserName(storedName);
    setScore(parseInt(storedScore, 10));

    const percentValue = parseFloat(storedPercentage);
    setPercentage(percentValue);

    if (percentValue >= 80) {
      setCategory(t('genderChampion'));
    } else if (percentValue >= 60) {
      setCategory(t('genderSensitive'));
    } else {
      setCategory(t('genderAware'));
    }
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


  // const handleSendEmail = async () => {
  //   if (!email) return;

  //   setIsSendingEmail(true);

  //   try {
  //     const certificate = await handleGenerateCertificate();
  //     if (!certificate) throw new Error("Failed to generate certificate");

  //     // Fetch the PDF as Blob and convert to Base64
  //     const response = await fetch(certificate.pdfUrl);
  //     const blob = await response.blob();
  //     const reader = new FileReader();

  //     reader.readAsDataURL(blob);
  //     reader.onloadend = async () => {
  //       const base64Data = reader.result?.toString().split(',')[1]; // Get only Base64 content

  //       // Send Email with Base64 PDF
  //       const params = {
  //         to_email: email,
  //         from_name: userName,
  //         subject: "Your Certificate",
  //         message: "Please find your certificate attached.",
  //         attachment: base64Data, // Base64 encoded PDF
  //         filename: `${userName}_certificate.pdf`, // File name
  //       };

  //       emailjs.send("service_foq71a3", "template_z2comz3", params,"Phy0lS6_2c9SSS-2T" )
  //         .then(response => {
  //           console.log("Email sent successfully!", response);
  //           alert("Certificate sent successfully!");
  //           setEmail('');
  //         })
  //         .catch(error => {
  //           console.error("Failed to send email:", error);
  //           alert("Failed to send the certificate.");
  //         })
  //         .finally(() => setIsSendingEmail(false));
  //     };
  //   } catch (error) {
  //     console.error("Error sending email:", error);
  //     setIsSendingEmail(false);
  //   }
  // };

  // const handleSendEmail = async (recipientEmail: string) => {

  //   if (!recipientEmail) {
  //     alert("Please enter a valid email address.");
  //     return;
  //   }

  //   setIsSendingEmail(true);

  //   try {
  //     // 1️⃣ Generate the certificate
  //     const certificate = await handleGenerateCertificate();
  //     if (!certificate) throw new Error("Certificate generation failed.");

  //      // Convert PDF Blob to Base64
  //      const base64PDF = await convertBlobToBase64(certificate.pdfBlob);

  //     // 2️⃣ Set EmailJS Template Params
  //     const templateParams = {
  //       name: userName || "User",
  //       email: recipientEmail,  // Dynamic recipient
  //       subject: "Your Gender Sensitivity Certificate",
  //       message: "Congratulations! Your certificate is ready. Download it below.",
  //      // certificate_url: certificate.pdfUrl,  // Add this to template
  //      attachment:base64PDF,
  //     };

  //     // 3️⃣ Send Email through EmailJS
  //     const response = await emailjs.send(
  //       "service_foq71a3",  // Your EmailJS Service ID
  //       "template_z2comz3", // Your EmailJS Template ID
  //       templateParams,
  //       "Phy0lS6_2c9SSS-2T"   // Your EmailJS Public Key
  //     );

  //     if (response.status === 200) {
  //       alert(`Email sent successfully to ${recipientEmail}!`);
  //     } else {
  //       alert("Failed to send email. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error sending email:", error);
  //     alert("An error occurred. Please try again.");
  //   } finally {
  //     setIsSendingEmail(false);
  //   }
  // };

  // // Helper Function: Convert Blob to Base64
  // const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //    const reader = new FileReader();
  //    reader.readAsDataURL(blob);
  //    reader.onloadend = () => resolve(reader.result as string);
  //    reader.onerror = (error) => reject(error);
  //   });
  // };
  //   const handleSendEmail = async () => {
  //     if (!email) return;

  //     setIsSendingEmail(true);

  //     const templateParams = {
  //      to_email: email, // This will be passed to EmailJS
  //     };

  //   try {
  //     const response = await emailjs.send(
  //       "service_foq71a3",   // Replace with your EmailJS Service ID
  //       "template_z2comz3",  // Replace with your EmailJS Template ID
  //       templateParams,
  //       "Phy0lS6_2c9SSS-2T"    // Replace with your EmailJS Public Key
  //     );

  //     if (response.status === 200) {
  //       alert(`Certificate has been sent to ${email}`);
  //       setEmail("");
  //     } else {
  //       alert("Failed to send email.");
  //     }
  //   } catch (error) {
  //     console.error("Error sending email:", error);
  //     alert("An error occurred.");
  //   } finally {
  //     setIsSendingEmail(false);
  //   }
  // };

  // const handleSendEmail = async () => {
  //   if (!email) return;

  //   setIsSendingEmail(true);

  //   try {
  //     // In a real application, you would send the email through a backend service
  //     await new Promise(resolve => setTimeout(resolve, 1500));
  //     alert(`Certificate would be sent to ${email} in a real application.`);
  //     setEmail('');
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //   } finally {
  //     setIsSendingEmail(false);
  //   }
  // };

  const handleSendEmail = async (recipientEmail: string) => {
    if (!recipientEmail) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsSendingEmail(true);

    try {
      // 1️⃣ Generate the certificate
      const certificate = await handleGenerateCertificate();
      if (!certificate) throw new Error("Certificate generation failed.");

      // 2️⃣ Set EmailJS Template Params
      const templateParams = {
        name: userName || "User",
        email: recipientEmail, // Pass only the email string
        subject: "Your Gender Sensitivity Certificate",
        message: "Congratulations! Your certificate is ready. Download it below.",
        certificate_url: certificate.pdfUrl, // Add this to the template
      };

      // 3️⃣ Send Email through EmailJS
      const response = await emailjs.send(
        "service_foq71a3",  // Your EmailJS Service ID
        "template_z2comz3", // Your EmailJS Template ID
        templateParams,
        "Phy0lS6_2c9SSS-2T"   // Your EmailJS Public Key
      );

      if (response.status === 200) {
        alert(`Email sent successfully to ${recipientEmail}!`);
      } else {
        alert("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto">
      {/* Result summary */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className='flex justify-center'>
          <p className="justify-center text-2xl font-bold mb-2 ">{t('congratulations')}, {userName}!🎊
            <span className='text-3xl p-3'>{t('yourScore')}:
            </span>{percentage.toFixed(1)}%
          </p>
        </div>

        <div className={`text-center p-2 rounded-lg mb-2 ${percentage >= 80
          ? 'bg-green-100 text-green-800'
          : percentage >= 60
            ? 'bg-blue-100 text-blue-800'
            : 'bg-yellow-100 text-yellow-800'
          }`}>

          <p className="text-xl">
            {t('youAre')} <span className="font-bold">{category}</span>
          </p>
          <p className='text-2xl font-bold mb-4 text-[#EF7F1A]'>
            {message1 ? message1 : "Default text"}
          </p>
        </div>

        {/* <div className="flex justify-center">
          <button
            onClick={handleTryAgain}
            className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
          >
            <RefreshCw size={20} className="mr-2" />
            {t('tryAgain')}
          </button>
        </div> */}
      </div>

      {/* Certificate */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        {/* <h2 className="text-2xl font-bold text-center mb-6">{t('certificateFrom')}</h2> */}

        <div
          ref={certificateRef}
          className="w-[800px] h-[565px] border-8 border-[#EF7F1A] rounded-lg p-8 bg-white mb-4"
          style={{
            backgroundImage: 'linear-gradient(45deg, rgba(239, 127, 26, 0.05) 25%, transparent 25%, transparent 50%, rgba(239, 127, 26, 0.05) 50%, rgba(239, 127, 26, 0.05) 75%, transparent 75%, transparent)',
            backgroundSize: '40px 40px'
          }}
        >
         
          <div className="text-center bg-white p-8 rounded-lg shadow-lg">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src={logo} alt="I-Saksham Logo" className="h-16 object-contain" />
            </div>

            {/* Category (Title) */}
            <h1 className="text-4xl font-extrabold text-[#EF7F1A] mb-4 uppercase tracking-wide">
              {category}
            </h1>

            {/* Certification Text */}
            <p className="text-xl text-gray-700 mb-2">{t('thisIsToCertifyThat')}</p>

            {/* User Name */}
            <p className="text-4xl font-extrabold text-[#EF7F1A] mb-3">{userName}</p>

            {/* Horizontal Line */}
            <div className="flex justify-center mb-4">
              <div className="w-40 h-1 bg-[#EF7F1A] rounded-full"></div>
            </div>

            {/* Certificate Description */}
            <p className="text-xl font-medium text-gray-800 mb-6 tracking-wide leading-relaxed" style={{ wordSpacing: "3px" }}>
              {t('certificateFrom')}
            </p>

            {/* Organization Footer */}
            <p className="text-lg font-semibold text-gray-900">
              I-Saksham Education and Learning Foundation:{" "}
              <span className="text-gray-700">{t('voice')}</span>
            </p>
          </div>

        </div>


        {/**<p className="text-xl mb-6">
              {t('hasCompletedTheGenderSensitivityQuiz')} <br />
              {t('withAScoreOf')} <span className="font-bold">{percentage.toFixed(1)}%</span>
            </p> */}



        {/* Certificate actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-3">{t('shareTitle')}</h3>
            <div className="flex flex-wrap gap-2">
              <ShareButton onShare={handleGenerateCertificate} />

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
                disabled
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF7F1A]"
              />

              {/* <button
                onClick={() => handleSendEmail(email)}
                disabled={!email || isSendingEmail}
                className="flex items-center px-4 py-2 bg-[#EF7F1A] text-white rounded-md hover:bg-[#D06C15] transition duration-300 disabled:bg-[#F8C093]"
              >
                <Mail size={20} className="mr-2" />
                {isSendingEmail ? 'Sending...' : t('send')}
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;