import { ResumeData } from '../types';
import { HTMLPreview } from './HTMLPreview';

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
    padding: '0.6in',
    backgroundColor: 'white',
    fontFamily: 'Times New Roman, serif',
    fontSize: '9pt',
    lineHeight: '1.2',
    boxSizing: 'border-box' as const,
    margin: '0 auto',
    transform: 'scale(0.65)',
    transformOrigin: 'top center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  };

  // Wrapper div to handle scaling and spacing
  const wrapperStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    marginBottom: '60px',
    paddingTop: '10px',
  };

  const headerStyle = {
    marginBottom: '16pt',
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
    marginBottom: '20px',
  };

  const sectionTitleStyle = {
    fontSize: '10pt',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    borderBottom: '1px solid #000',
    paddingBottom: '2pt',
    marginBottom: '8pt',
    letterSpacing: '0.05em',
  };

  const experienceItemStyle = {
    marginBottom: '16px',
  };

  const companyStyle = {
    fontSize: '9pt',
    fontWeight: 'bold',
    marginBottom: '2pt',
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
              <div style={{ fontSize: '10pt', lineHeight: '1.6' }}>
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {data.skills.map((skill, idx) => (
                <span 
                  key={idx}
                  style={{
                    backgroundColor: '#f0f0f0',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '14px',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview; 