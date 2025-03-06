import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ShareOptions {
  title: string;
  text: string;
  hashtags?: string[];
}

export const generateCertificateImages = async (
  certificateRef: HTMLDivElement,
  options: ShareOptions
) => {
  if (!certificateRef) throw new Error('Certificate reference is required');

  try {
    // Generate PNG
    const canvas = await html2canvas(certificateRef, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const pngUrl = canvas.toDataURL('image/png');

    // Generate PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(pngUrl, 'PNG', 0, 0, imgWidth, imgHeight);
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    return {
      pngUrl,
      pdfUrl,
      shareViaApi: async () => {
        if (navigator.share) {
          await navigator.share({
            title: options.title,
            text: options.text,
            url: window.location.href // Share the page URL instead of the image
          });
        }
      },
      shareToTwitter: () => {
        const twitterUrl = new URL('https://twitter.com/intent/tweet');
        twitterUrl.searchParams.append('text', options.text);
        if (options.hashtags) {
          twitterUrl.searchParams.append('hashtags', options.hashtags.join(','));
        }
        twitterUrl.searchParams.append('url', window.location.href);
        window.open(twitterUrl.toString(), '_blank');
      },
      shareToLinkedIn: () => {
        const linkedInUrl = new URL('https://www.linkedin.com/sharing/share-offsite/');
        linkedInUrl.searchParams.append('url', window.location.href);
        window.open(linkedInUrl.toString(), '_blank');
      },
      shareToFacebook: () => {
        const facebookUrl = new URL('https://www.facebook.com/sharer/sharer.php');
        facebookUrl.searchParams.append('u', window.location.href);
        window.open(facebookUrl.toString(), '_blank');
      },
      shareToWhatsApp: () => {
        const whatsappText = `${options.text}\n${window.location.href}`;
        const whatsappUrl = new URL('https://wa.me/');
        whatsappUrl.searchParams.append('text', whatsappText);
        window.open(whatsappUrl.toString(), '_blank');
      },
      cleanup: () => {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw error;
  }
};