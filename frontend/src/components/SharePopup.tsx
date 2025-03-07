import React from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Share2,
  MessageCircle,
} from "lucide-react";

interface SharePopupProps {
  onClose: () => void;
}

const SharePopup: React.FC<SharePopupProps> = ({ onClose }) => {
  const handleShare = async (platform: string) => {
    try {
      const shareUrl = "https://gss.i-saksham.org";
      const shareText = "Check how gender sensitive your community is. I just did. #VoiceAndChoice #IWD2025 #iSaksham";

      let shareLink = '';

      switch (platform) {
        case 'Facebook':
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          break;
        case 'Twitter':
          shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
          break;
        case 'LinkedIn':
          shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
          break;
        case 'WhatsApp':
          shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
          break;
        case 'Native':
          if (navigator.share) {
            await navigator.share({
              title: 'Gender Sensitivity Certificate',
              text: shareText,
              url: shareUrl,
            });
            return;
          }
          break;
      }

      if (shareLink) {
        window.open(shareLink, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const socialPlatforms = [
    {
      name: "Facebook",
      icon: <Facebook size={24} />,
      color: "#1877F2",
      className: "hover:bg-[#1877F2] hover:text-white"
    },
    {
      name: "Twitter",
      icon: <Twitter size={24} />,
      color: "#1DA1F2",
      className: "hover:bg-[#1DA1F2] hover:text-white"
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={24} />,
      color: "#0A66C2",
      className: "hover:bg-[#0A66C2] hover:text-white"
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle size={24} />,
      color: "#25D366",
      className: "hover:bg-[#25D366] hover:text-white"
    },
    {
      name: "Native",
      icon: <Share2 size={24} />,
      color: "#0284C7",
      className: "hover:bg-[#0284C7] hover:text-white"
    }
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[320px] max-w-full mx-4">
        <h2 className="text-xl font-bold text-center mb-6">Share Link</h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {socialPlatforms.map((platform) => (
            <button
              key={platform.name}
              onClick={() => handleShare(platform.name)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ${platform.className}`}
              style={{ color: platform.color }}
            >
              {platform.icon}
              <span className="text-xs mt-2">{platform.name}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SharePopup;