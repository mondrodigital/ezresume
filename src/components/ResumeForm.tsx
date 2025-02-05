import React, { useState } from 'react';
import { ResumeData } from '../types';
import { ChevronDown, ChevronUp, Plus, Trash2, HelpCircle } from 'lucide-react';
import TextEditor from './TextEditor';
import { HTMLPreview } from './HTMLPreview';  // If needed

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

interface Section {
  id: string;
  title: string;
  isOpen: boolean;
}

const parseMultipleJobs = (text: string) => {
  // Split the text into blocks based on "Company:" or double newlines
  const jobBlocks = text.split(/(?=Company:|Employer:)/i).filter(block => block.trim());
  
  return jobBlocks.map(jobText => {
    // Extract job details
    const company = jobText.match(/(?:Company|Employer):\s*([^\n]+)/i)?.[1]?.trim() || '';
    const position = jobText.match(/(?:Position|Title|Role|Job Title):\s*([^\n]+)/i)?.[1]?.trim() || '';
    const dateMatch = jobText.match(/(?:Date|Duration|Period):\s*([^\n]+)/i);
    let startDate = '';
    let endDate = '';
    
    if (dateMatch) {
      const dates = dateMatch[1].split('-').map(d => d.trim());
      startDate = dates[0] || '';
      endDate = dates[1] || 'Present';
    }

    // Get bullet points
    const bulletPoints = jobText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))
      .map(point => point.replace(/^[•\-\*]\s*/, ''))
      .filter(point => point.length > 0);

    const description = `<ul>${bulletPoints.map(point => `<li>${point}</li>`).join('')}</ul>`;

    return {
      company,
      position,
      startDate,
      endDate,
      description
    };
  });
};

export default function ResumeForm({ data, onChange }: Props) {
  const [sections, setSections] = useState<Section[]>([
    { id: 'personal', title: 'Personal Information', isOpen: true },
    { id: 'summary', title: 'Professional Summary', isOpen: false },
    { id: 'experience', title: 'Employment History', isOpen: false },
    { id: 'education', title: 'Education', isOpen: false },
    { id: 'skills', title: 'Skills', isOpen: false },
  ]);

  const [expandedExperiences, setExpandedExperiences] = useState<number[]>([]);
  const [expandedEducation, setExpandedEducation] = useState<number[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [bulkInput, setBulkInput] = useState('');

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, isOpen: !section.isOpen } : section
    ));
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const toggleExperience = (index: number) => {
    setExpandedExperiences(expanded => 
      expanded.includes(index) 
        ? expanded.filter(i => i !== index)
        : [...expanded, index]
    );
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExperience = [...data.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    onChange({ ...data, experience: newExperience });
  };

  const addExperience = () => {
    const newExp = {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange({
      ...data,
      experience: [...data.experience, newExp]
    });
    // Automatically expand the new entry
    setExpandedExperiences(prev => [...prev, data.experience.length]);
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEducation = [...data.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    onChange({ ...data, education: newEducation });
  };

  const toggleEducation = (index: number) => {
    setExpandedEducation(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const addEducation = () => {
    onChange({
      ...data,
      education: [...data.education, {
        school: '',
        degree: '',
        graduationDate: '',
        description: ''
      }]
    });
  };

  const deleteExperience = (index: number) => {
    const newExperience = data.experience.filter((_, i) => i !== index);
    onChange({ ...data, experience: newExperience });
    setExpandedExperiences(prev => prev.filter(i => i !== index));
  };

  const deleteEducation = (index: number) => {
    const newEducation = data.education.filter((_, i) => i !== index);
    onChange({ ...data, education: newEducation });
    setExpandedEducation(prev => prev.filter(i => i !== index));
  };

  const getSectionSummary = (sectionId: string) => {
    switch (sectionId) {
      case 'personal':
        return data.personalInfo.firstName ? 
          `${data.personalInfo.firstName} ${data.personalInfo.lastName}` : 
          'No personal information added';
      case 'experience':
        return `${data.experience.length} positions`;
      case 'education':
        return `${data.education.length} qualifications`;
      case 'skills':
        return `${data.skills.length} skills`;
      default:
        return '';
    }
  };

  const addSkill = () => {
    onChange({
      ...data,
      skills: [...data.skills, '']
    });
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...data.skills];
    newSkills[index] = value;
    onChange({ ...data, skills: newSkills });
  };

  const deleteSkill = (index: number) => {
    const newSkills = data.skills.filter((_, i) => i !== index);
    onChange({ ...data, skills: newSkills });
  };

  const handleAddEducation = () => {
    addEducation();
    setExpandedEducation(prev => [...prev, data.education.length - 1]);
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newSkill.trim()) {
        onChange({
          ...data,
          skills: [...data.skills, newSkill.trim()]
        });
        setNewSkill('');
        setShowSkillInput(false);
      }
    }
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = data.skills.filter((_, i) => i !== index);
    onChange({ ...data, skills: newSkills });
  };

  const handleBulkImport = () => {
    const parsedJobs = parseMultipleJobs(bulkInput);
    if (parsedJobs.length > 0) {
      // Add the new jobs to the existing experience array
      const updatedExperience = [...data.experience, ...parsedJobs];
      
      onChange({
        ...data,
        experience: updatedExperience
      });
      
      setBulkInput(''); // Clear the input after import
      
      // Expand all newly added jobs
      const newJobIndexes = parsedJobs.map((_, index) => 
        data.experience.length + index
      );
      setExpandedExperiences(prev => [...prev, ...newJobIndexes]);
    }
  };

  const hasJobContent = (job: typeof data.experience[0]) => {
    return job.company.trim() !== '' || 
           job.position.trim() !== '' || 
           job.startDate.trim() !== '' || 
           job.endDate.trim() !== '' || 
           job.description.trim() !== '';
  };

  return (
    <div className="p-8 space-y-12">
      {/* Personal Information Section */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          Your contact details are the gateway to opportunities. Make them clear and professional. 
          Recruiters spend 7.4 seconds scanning a resume—ensure they can reach you.
        </p>
        
        <div className="space-y-4">
          <div className="border rounded-lg hover:border-blue-500 transition-colors p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">First Name</label>
                <input
                  type="text"
                  value={data.personalInfo.firstName}
                  onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                <input
                  type="text"
                  value={data.personalInfo.lastName}
                  onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="border rounded-lg hover:border-blue-500 transition-colors p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={data.personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone</label>
                <input
                  type="tel"
                  value={data.personalInfo.phone}
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Websites & Social Links Section */}
          <div className="border rounded-lg hover:border-blue-500 transition-colors p-4">
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">Websites & Social Links</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your online presence is your extended portfolio. Link to work that proves your claims. 
                Clean up your profiles first—recruiters will check them.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Website</label>
                <input
                  type="url"
                  value={data.personalInfo.website}
                  onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., portfolio-website.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={data.personalInfo.linkedin}
                  onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., linkedin.com/in/username"
                />
              </div>
            </div>
          </div>

          <div className="border rounded-lg hover:border-blue-500 transition-colors p-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Professional Summary</label>
              <TextEditor
                value={data.personalInfo.summary}
                onChange={(value) => handlePersonalInfoChange('summary', value)}
                placeholder="Write 2-4 short & energetic sentences to interest the reader! Mention your role, experience & most importantly - your biggest achievements, best qualities and skills."
              />
            </div>
          </div>
        </div>
      </section>

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

      {/* Professional Summary Section */}
      <section>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('summary')}
        >
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Professional Summary</h2>
            <HelpCircle 
              size={20}
              className="text-blue-500"
              aria-label="Highlight your key achievements and skills"
            />
          </div>
          {sections.find(s => s.id === 'summary')?.isOpen ? (
            <ChevronUp size={24} />
          ) : (
            <ChevronDown size={24} />
          )}
        </div>

        {sections.find(s => s.id === 'summary')?.isOpen && (
          <div className="mt-4">
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              Your elevator pitch. Hook the employer with 3-4 powerful sentences.
              Focus on your top achievements and value proposition.
            </p>
            <TextEditor
              value={data.personalInfo.summary}
              onChange={(value) => handlePersonalInfoChange('summary', value)}
              placeholder="Highlight your professional journey and key achievements..."
            />
          </div>
        )}
      </section>

      {/* Employment History Section */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Employment History</h2>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          Hiring managers skim for outcomes. Lead with your biggest wins, then explain how. 
          Strong bullets follow: Changed [Thing] + Using [Method] + Result [Number].
        </p>
        
        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <div 
              key={index}
              className="border rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
            >
              <div 
                className="p-4 flex justify-between items-center"
                onClick={() => toggleExperience(index)}
              >
                <div>
                  <h3 className="font-medium text-gray-900">
                    {exp.position || 'Position'} at {exp.company || 'Company'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {exp.startDate || 'Start Date'} - {exp.endDate || 'End Date'}
                  </p>
                </div>
                <ChevronDown 
                  className={`transform transition-transform ${
                    expandedExperiences.includes(index) ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {expandedExperiences.includes(index) && (
                <div className="p-4 border-t">
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteExperience(index);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete position
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      placeholder="e.g. Marketing Manager"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Employer</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      placeholder="e.g. Acme Inc"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        placeholder="e.g. Mar 2023"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        placeholder="e.g. Present"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Description</label>
                    <div className="text-xs text-gray-500 mb-2">
                      Structure each point as:
                      • What you changed (Led, Built, Improved)
                      • How you did it (tools, team, approach)
                      • Impact (money saved, growth achieved, time reduced)
                    </div>
                    <TextEditor
                      value={exp.description}
                      onChange={(value) => handleExperienceChange(index, 'description', value)}
                      placeholder="Example:
• Led rebranding project across 5 markets, increasing brand recognition by 40%
• Reduced customer response time from 24hrs to 2hrs by redesigning support workflow
• Built new sales process that increased quarterly revenue by $300K"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addExperience}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
          >
            <Plus size={20} />
            Add one more employment
          </button>
        </div>
      </section>

      {/* Education Section */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Education</h2>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          Education signals competence and commitment. But it's not just about degrees—highlight relevant 
          coursework and projects that demonstrate practical skills.
        </p>
        
        <div className="space-y-4">
          {data.education.map((edu, index) => (
            <div 
              key={index}
              className="border rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
            >
              <div 
                className="p-4 flex justify-between items-center"
                onClick={() => toggleEducation(index)}
              >
                <div>
                  <h3 className="font-medium text-gray-900">
                    {edu.degree || 'Degree'} at {edu.school || 'School'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {edu.graduationDate || 'Graduation Date'}
                  </p>
                </div>
                <ChevronDown 
                  className={`transform transition-transform ${
                    expandedEducation.includes(index) ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {expandedEducation.includes(index) && (
                <div className="p-4 border-t">
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEducation(index);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete education
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Date</label>
                    <input
                      type="text"
                      value={edu.graduationDate}
                      onChange={(e) => handleEducationChange(index, 'graduationDate', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., May 2020"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <TextEditor
                      value={edu.description}
                      onChange={(value) => handleEducationChange(index, 'description', value)}
                      placeholder="Describe your major achievements, relevant coursework, or thesis"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={handleAddEducation}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
          >
            <Plus size={20} />
            Add one more education
          </button>
        </div>
      </section>

      {/* Skills section stays the same */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold">Skills</h2>
          <span className="text-blue-500">🔗</span>
        </div>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          Mirror the job posting's key terms. Applicant tracking systems (ATS) filter by matching skills. 
          Be specific: "React.js" over "Programming." List your strongest skills first.
        </p>

        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, index) => (
            <div 
              key={index} 
              className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {skill}
              <button
                onClick={() => handleRemoveSkill(index)}
                className="text-gray-400 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
          {showSkillInput ? (
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleSkillInputKeyDown}
              onBlur={() => {
                if (!newSkill.trim()) setShowSkillInput(false);
              }}
              className="px-3 py-1 text-sm border rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Type and press Enter"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setShowSkillInput(true)}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm"
            >
              <Plus size={16} />
              Add skill
            </button>
          )}
        </div>
      </div>
    </div>
  );
}