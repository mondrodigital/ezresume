import React from 'react';
import { Download } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import useLocalStorage from './hooks/useLocalStorage';
import { ResumeData } from './types';
import ResumePDF from './components/ResumePDF';

const initialData: ResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
};

function App() {
  const [resumeData, setResumeData] = useLocalStorage<ResumeData>('resumeData', initialData);

  const handleDownloadPDF = async () => {
    try {
      console.log('Starting PDF generation...');
      
      const blob = await pdf(<ResumePDF data={resumeData} />).toBlob();
      console.log('PDF blob generated:', blob);
      
      const url = URL.createObjectURL(blob);
      console.log('URL created:', url);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeData.personalInfo.firstName || 'resume'}-${resumeData.personalInfo.lastName || 'pdf'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="h-screen flex overflow-hidden relative">
      {/* Floating Download Button (visible only on mobile) */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Download size={20} />
          Download PDF
        </button>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 lg:max-w-[800px] overflow-y-auto bg-white border-r">
        <ResumeForm data={resumeData} onChange={setResumeData} />
      </div>

      {/* Right Side - Preview (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-[#4A5568] flex-col overflow-hidden">
        <div className="p-4 flex justify-end">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={20} />
            Download PDF
          </button>
        </div>
        <div className="flex-1 flex justify-center items-center p-8 overflow-hidden">
          <div style={{ 
            transform: `scale(${Math.min(
              (window.innerHeight - 160) / 792,
              (window.innerWidth - window.innerWidth * 0.5 - 80) / 612
            )})`,
            transformOrigin: 'top center'
          }}>
            <ResumePreview data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;