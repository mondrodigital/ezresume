import { useState } from 'react';
import { ResumeData } from '../types';
import ResumePreview from './ResumePreview';
import Split from 'react-split';
import '../styles/Split.css';
import '../styles/Preview.module.css';
import HTMLPreview from './HTMLPreview';  // If needed

const initialData: ResumeData = {
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    website: 'www.johndoe.com',
    linkedin: 'linkedin.com/in/johndoe',
    summary: '<p>This is a <strong>professional</strong> summary.</p>',
  },
  experience: [
    {
      company: 'Company A',
      position: 'Developer',
      startDate: '2020',
      endDate: '2021',
      description: '<ul><li>Worked as a <em>developer</em> on various projects.</li></ul>',
    },
    {
      company: 'Company B',
      position: 'Engineer',
      startDate: '2019',
      endDate: '2020',
      description: '<ol><li>Developed software solutions.</li><li>Collaborated with teams.</li></ol>',
    },
  ],
  education: [
    {
      school: 'University X',
      degree: 'Bachelor of Science',
      graduationDate: '2019',
      description: '<p>Studied computer science focused on <strong>software engineering</strong>.</p>',
    },
  ],
  skills: ['JavaScript', 'React', 'TypeScript'],
};

// Add this function to parse job descriptions
const parseJobDescription = (text: string) => {
  // Initialize default values
  let company = '';
  let position = '';
  let startDate = '';
  let endDate = '';
  let description = '';

  // Try to extract company name (assumes format "Company: Company Name" or similar)
  const companyMatch = text.match(/(?:Company|Organization|Employer):\s*([^\n]+)/i);
  if (companyMatch) {
    company = companyMatch[1].trim();
  }

  // Try to extract position (assumes format "Position: Job Title" or similar)
  const positionMatch = text.match(/(?:Position|Title|Role):\s*([^\n]+)/i);
  if (positionMatch) {
    position = positionMatch[1].trim();
  }

  // Try to extract dates (assumes format "Date: Start - End" or similar)
  const dateMatch = text.match(/(?:Date|Duration|Period):\s*([^\n]+)/i);
  if (dateMatch) {
    const dates = dateMatch[1].split('-').map(d => d.trim());
    startDate = dates[0];
    endDate = dates[1] || 'Present';
  }

  // Extract description (everything after "Description:" or similar)
  const descriptionMatch = text.match(/(?:Description|Responsibilities|Details):\s*([\s\S]+)$/i);
  if (descriptionMatch) {
    // Convert bullet points to HTML list
    const bulletPoints = descriptionMatch[1]
      .split('\n')
      .map(point => point.trim())
      .filter(point => point.length > 0)
      .map(point => point.replace(/^[•\-\*]\s*/, '')); // Remove existing bullet points

    description = `<ul>${bulletPoints.map(point => `<li>${point}</li>`).join('')}</ul>`;
  }

  return {
    company,
    position,
    startDate,
    endDate,
    description
  };
};

const parseMultipleJobs = (text: string) => {
  // Split the text into separate job blocks
  // Assuming jobs are separated by double newlines or similar delimiter
  const jobBlocks = text.split(/\n{2,}/).filter(block => block.trim());
  
  return jobBlocks.map(jobText => {
    // Initialize default values
    let company = '';
    let position = '';
    let startDate = '';
    let endDate = '';
    let description = '';

    // Try to extract company name
    const companyMatch = jobText.match(/(?:Company|Organization|Employer):\s*([^\n]+)/i);
    if (companyMatch) {
      company = companyMatch[1].trim();
    }

    // Try to extract position
    const positionMatch = jobText.match(/(?:Position|Title|Role):\s*([^\n]+)/i);
    if (positionMatch) {
      position = positionMatch[1].trim();
    }

    // Try to extract dates
    const dateMatch = jobText.match(/(?:Date|Duration|Period):\s*([^\n]+)/i);
    if (dateMatch) {
      const dates = dateMatch[1].split('-').map(d => d.trim());
      startDate = dates[0];
      endDate = dates[1] || 'Present';
    }

    // Extract description
    const descriptionMatch = jobText.match(/(?:Description|Responsibilities|Details):\s*([\s\S]+?)(?=\n*(?:Company|Organization|Employer|$))/i);
    if (descriptionMatch) {
      const bulletPoints = descriptionMatch[1]
        .split('\n')
        .map(point => point.trim())
        .filter(point => point.length > 0)
        .map(point => point.replace(/^[•\-\*]\s*/, '')); // Remove existing bullet points

      description = `<ul>${bulletPoints.map(point => `<li>${point}</li>`).join('')}</ul>`;
    }

    return {
      company,
      position,
      startDate,
      endDate,
      description
    };
  });
};

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [bulkInput, setBulkInput] = useState('');
  const [bulkSkillsInput, setBulkSkillsInput] = useState('');

  const handleBulkImport = () => {
    const parsedJobs = parseMultipleJobs(bulkInput);
    setResumeData(prev => ({
      ...prev,
      experience: parsedJobs
    }));
    setBulkInput('');
  };

  const handleBulkSkillsImport = () => {
    const skills = bulkSkillsInput
      .split(/[\n,]+/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
    console.log("Parsed skills:", skills);
    // Append the new skills to the existing skills array.
    setResumeData(prev => ({ ...prev, skills: [...prev.skills, ...skills] }));
    setBulkSkillsInput('');
  };

  // Helper to update a given field in the resume data:
  const updateField = (section: 'personalInfo' | 'experience' | 'education', field: string, value: string, index?: number) => {
    setResumeData(prev => {
      const newData = { ...prev };
      if (section === 'personalInfo') {
        newData.personalInfo = { ...prev.personalInfo, [field]: value };
      } else if (section === 'experience' && index !== undefined) {
        newData.experience = [...prev.experience];
        newData.experience[index] = { ...prev.experience[index], [field]: value };
      } else if (section === 'education' && index !== undefined) {
        newData.education = [...prev.education];
        newData.education[index] = { ...prev.education[index], [field]: value };
      }
      return newData;
    });
  };

  // Update the hasContent function to match ResumePDF's stricter version
  const hasContent = (text: string) => {
    // Remove HTML tags and whitespace
    const cleanText = text
      .replace(/<[^>]*>/g, '')  // Remove HTML tags
      .replace(/&nbsp;/g, ' ')  // Replace &nbsp; with space
      .trim();
    
    // Return true only if there's actual content
    return cleanText !== '' && 
           cleanText !== 'This is a professional summary.' && 
           cleanText !== 'Professional Summary';
  };

  return (
    <div style={{ 
      padding: '20px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
    }}>
      {/* Main input for job descriptions */}
      <div style={{ 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px'
      }}>
        <h3 style={{ marginBottom: '15px' }}>Import Job Descriptions</h3>
        <textarea
          value={bulkInput}
          onChange={(e) => setBulkInput(e.target.value)}
          style={{
            width: '100%',
            minHeight: '200px',
            padding: '15px',
            marginBottom: '15px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px',
            lineHeight: '1.5'
          }}
          placeholder={`Paste your job descriptions in this format:

Company: Example Corp
Position: Software Engineer
Date: 2020 - 2021
Description:
• Led development of key features
• Managed team of 5 developers`}
        />
        <button
          onClick={handleBulkImport}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Import Jobs
        </button>
      </div>

      {/* New Bulk Skills Import Block */}
      <div style={{ 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px'
      }}>
        <h3 style={{ marginBottom: '15px' }}>Import Skills</h3>
        <textarea
          value={bulkSkillsInput}
          onChange={(e) => setBulkSkillsInput(e.target.value)}
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '15px',
            marginBottom: '15px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px',
            lineHeight: '1.5'
          }}
          placeholder="Paste your skills separated by commas or newlines (e.g., JavaScript, React, TypeScript)"
        />
        <button
          onClick={handleBulkSkillsImport}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Import Skills
        </button>
      </div>

      {/* Replace the flex container with Split */}
      <Split 
        sizes={[50, 50]} 
        minSize={300}
        gutterSize={20}
        style={{ 
          display: 'flex', 
          height: 'calc(100vh - 100px)',
          width: '100%'
        }}
      >
        {/* Left side - Editor */}
        <div style={{ 
          overflow: 'auto',
          padding: '20px',
        }}>
          <h2 style={{ marginBottom: '20px' }}>Resume Editor</h2>
          
          {/* Professional Summary */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              <strong>Professional Summary</strong>
            </label>
            <textarea
              value={resumeData.personalInfo.summary}
              onChange={e => updateField('personalInfo', 'summary', e.target.value)}
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '10px',
                border: '1px solid #ced4da',
                borderRadius: '4px'
              }}
            />
          </div>

          {/* Experience Section */}
          {resumeData.experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: '20px' }}>
              <h3>Experience {idx + 1}</h3>
              <textarea
                value={exp.description}
                onChange={e => updateField('experience', 'description', e.target.value, idx)}
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '10px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px'
                }}
              />
            </div>
          ))}

          {/* Education Section */}
          {resumeData.education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: '20px' }}>
              <h3>Education {idx + 1}</h3>
              <textarea
                value={edu.description}
                onChange={e => updateField('education', 'description', e.target.value, idx)}
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '10px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px'
                }}
              />
            </div>
          ))}
        </div>

        {/* Right side - Preview */}
        <div style={{ 
          flex: 1,
          backgroundColor: 'transparent',  // Remove black background
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
        }}>
          {/* Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '20px',
            color: 'white',
          }}>
            <button style={{ color: 'red', fontSize: '30px', background: 'none', border: 'none' }}>−</button>
            <span style={{ fontSize: '30px', color: 'red' }}>Aa</span>
            <button style={{ color: 'red', fontSize: '30px', background: 'none', border: 'none' }}>+</button>
            <button style={{
              backgroundColor: 'red',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '20px',
            }}>
              ↓ Download PDF
            </button>
          </div>

          {/* Preview container */}
          <div style={{
            backgroundColor: 'white',  // Change to white
            width: '200px',            
            height: '250px',           
            boxShadow: '0 4px 20px rgba(255,0,0,0.5)',  
            borderRadius: '20px',      
            overflow: 'hidden',
            margin: '20px',
          }}>
            <ResumePreview data={resumeData} />
          </div>
        </div>
      </Split>
    </div>
  );
} 