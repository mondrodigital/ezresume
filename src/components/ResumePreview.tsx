import { ResumeData } from '../types';
import HTMLPreview from './HTMLPreview';
import styles from '../styles/Preview.module.css';

interface Props {
  data: ResumeData;
}

const ResumePreview = ({ data }: Props) => {
  // Helper function to check if text has meaningful content
  const hasContent = (text: string) => {
    const cleanText = text
      .replace(/<[^>]*>/g, '')  // Remove HTML tags
      .replace(/&nbsp;/g, ' ')  // Replace &nbsp; with space
      .trim();
    
    return cleanText !== '' && 
           cleanText !== 'This is a professional summary.' && 
           cleanText !== 'Professional Summary';
  };

  const previewStyle = {
    width: '8.5in',
    height: '11in',
    padding: '0.5in',
    backgroundColor: 'white',
    fontFamily: 'Times New Roman, serif',
    fontSize: '9pt',
    lineHeight: '1.4',
    boxSizing: 'border-box' as const,
    margin: '0 auto',
    overflow: 'auto',
    position: 'relative' as const,
  };

  // Wrapper div to handle scaling and spacing
  const wrapperStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    height: '100%',
    position: 'relative' as const,
    backgroundColor: 'transparent',
  };

  const previewContainerStyle = {
    width: '8.5in',
    height: '11in',
    transform: 'scale(0.65)',
    transformOrigin: 'top center',
    position: 'relative' as const,
    backgroundColor: 'white',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    borderRadius: '4px',
    overflow: 'hidden',
    margin: '0 auto',
  };

  const headerStyle = {
    marginBottom: '12pt',
    textAlign: 'center' as const,
  };

  const nameStyle = {
    fontSize: '14pt',
    fontWeight: 'bold',
    marginBottom: '4pt',
  };

  const contactStyle = {
    fontSize: '8pt',
    color: '#333',
    marginBottom: '16pt',
  };

  const sectionStyle = {
    marginBottom: '12pt',
  };

  const sectionTitleStyle = {
    fontSize: '10pt',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    borderBottom: '1px solid #000',
    paddingBottom: '2pt',
    marginBottom: '6pt',
    letterSpacing: '0.05em',
  };

  const descriptionStyle = {
    fontSize: '10pt',
    lineHeight: '1.4',
    marginLeft: '12pt',  // Add indentation for bullet points
  };

  const bulletStyle = {
    display: 'block',
    position: 'relative',
    paddingLeft: '12pt',
    marginBottom: '2pt',
  };

  const bulletPointStyle = {
    position: 'absolute',
    left: '0',
    content: '"•"',
  };

  const experienceItemStyle = {
    marginBottom: '6px',
  };

  const companyStyle = {
    fontSize: '9pt',
    fontWeight: 'bold',
    marginBottom: '1pt',
  };

  const positionRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10pt',
    color: '#333',
    marginBottom: '8px',
  };

  return (
    <div style={wrapperStyle}>
      <div style={previewContainerStyle}>
        <div style={previewStyle}>
          <div style={headerStyle}>
            <div style={nameStyle}>
              {data.personalInfo.firstName} {data.personalInfo.lastName}
            </div>
            <div style={contactStyle}>
              {data.personalInfo.email} • {data.personalInfo.phone} • {data.personalInfo.website} • {data.personalInfo.linkedin}
            </div>
          </div>

          {/* Profile/Summary section */}
          {hasContent(data.personalInfo.summary) && (
            <div style={{ marginBottom: '24pt' }}>
              <div style={sectionTitleStyle}>Profile</div>
              <div style={{ fontSize: '10pt', lineHeight: '1.6' }}>
                <HTMLPreview content={data.personalInfo.summary} />
              </div>
            </div>
          )}

          {/* Employment section */}
          <div style={{ marginBottom: '24pt' }}>
            <div style={sectionTitleStyle}>Employment</div>
            {data.experience.map((exp, idx) => (
              <div key={idx} style={experienceItemStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4pt' }}>
                  <div style={companyStyle}>{exp.position}, {exp.company}</div>
                  <div style={{ color: '#666', fontSize: '10pt' }}>{exp.startDate} — {exp.endDate}</div>
                </div>
                <div style={descriptionStyle}>
                  <HTMLPreview content={exp.description} />
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          {data.education.length > 0 && (
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}>Education</div>
              {data.education.map((edu, idx) => (
                <div key={idx} style={experienceItemStyle}>
                  <div style={companyStyle}>{edu.school}</div>
                  <div style={positionRowStyle}>
                    <span>{edu.degree}</span>
                    <span>{edu.graduationDate}</span>
                  </div>
                  <HTMLPreview content={edu.description} />
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <div style={sectionStyle}>
              <div style={sectionTitleStyle}>Skills</div>
              <div style={{ fontSize: '10pt', color: '#333', backgroundColor: 'transparent' }}>
                {data.skills.join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview; 