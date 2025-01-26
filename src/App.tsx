import React, { useState, useEffect } from 'react';
import { Download, Minus, Plus, Save } from 'lucide-react';
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
  const [spacingScale, setSpacingScale] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleDownloadPDF();
            break;
          case '+':
            e.preventDefault();
            adjustSpacing(0.1);
            break;
          case '-':
            e.preventDefault();
            adjustSpacing(-0.1);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Auto-save functionality
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
      setIsSaving(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resumeData]);

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

  const adjustSpacing = (delta: number) => {
    setSpacingScale(prev => Math.max(0.5, Math.min(1.5, prev + delta)));
  };

  return (
    <div className="h-screen flex overflow-hidden relative">
      {/* Mobile View Switcher */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex border-b bg-white">
        <button 
          className={`flex-1 p-4 ${mobileView === 'form' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => setMobileView('form')}
        >
          Edit
        </button>
        <button 
          className={`flex-1 p-4 ${mobileView === 'preview' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => setMobileView('preview')}
        >
          Preview
        </button>
      </div>

      {/* Left Side - Form */}
      <div className={`w-full lg:w-1/2 lg:max-w-[800px] overflow-y-auto bg-white border-r 
        ${mobileView === 'form' ? 'block' : 'hidden lg:block'}`}>
        <ResumeForm data={resumeData} onChange={setResumeData} />
      </div>

      {/* Right Side - Preview */}
      <div className={`flex-1 bg-[#4A5568] flex-col overflow-hidden 
        ${mobileView === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {/* Controls Bar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-white">
              <button
                onClick={() => adjustSpacing(-0.1)}
                className="p-2 rounded hover:bg-white/10 transition-colors group relative"
                title="Decrease spacing (Ctrl -)"
              >
                <Minus size={20} />
              </button>
              <span className="text-lg">Aa</span>
              <button
                onClick={() => adjustSpacing(0.1)}
                className="p-2 rounded hover:bg-white/10 transition-colors group relative"
                title="Increase spacing (Ctrl +)"
              >
                <Plus size={20} />
              </button>
            </div>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              title="Download PDF (Ctrl S)"
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>

          {/* Resume Preview */}
          <div style={{ 
            transform: `scale(${Math.min(
              (window.innerHeight - 160) / 792,
              (window.innerWidth - window.innerWidth * 0.5 - 80) / 612
            )})`,
            transformOrigin: 'top center'
          }}>
            <ResumePreview 
              data={resumeData} 
              spacingScale={spacingScale}
            />
          </div>
        </div>
      </div>

      {/* Auto-save Indicator - Moved to bottom right */}
      <div className="fixed bottom-4 right-4 text-sm text-gray-400 flex items-center gap-2">
        <Save size={16} className={isSaving ? 'animate-spin' : ''} />
        {isSaving ? "Saving..." : "All changes saved"}
      </div>
    </div>
  );
}

export default App;