import React, { useState } from 'react';
import { ResumeData } from '../types';
import { ChevronDown, ChevronUp, Plus, Trash2, Link, HelpCircle } from 'lucide-react';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

interface Section {
  id: string;
  title: string;
  isOpen: boolean;
}

export default function ResumeForm({ data, onChange }: Props) {
  const [sections, setSections] = useState<Section[]>([
    { id: 'personal', title: 'Personal Information', isOpen: true },
    { id: 'experience', title: 'Employment History', isOpen: false },
    { id: 'education', title: 'Education', isOpen: false },
    { id: 'skills', title: 'Skills', isOpen: false },
  ]);

  const [expandedExperiences, setExpandedExperiences] = useState<number[]>([]);
  const [expandedEducation, setExpandedEducation] = useState<number[]>([]);

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
    setExpandedEducation(expanded => 
      expanded.includes(index) 
        ? expanded.filter(i => i !== index)
        : [...expanded, index]
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

  const renderSectionHeader = (section: Section) => (
    <div className="border-b border-gray-200">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => toggleSection(section.id)}
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
          {!section.isOpen && (
            <p className="text-sm text-gray-500 mt-1">
              {getSectionSummary(section.id)}
            </p>
          )}
        </div>
        {section.isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
    </div>
  );

  const renderField = (label: string, value: string, onChange: (value: string) => void, placeholder?: string) => (
    <div className="mb-4">
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>
  );

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

  return (
    <div className="p-8">
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            {renderField('First Name', data.personalInfo.firstName, 
              (value) => handlePersonalInfoChange('firstName', value))}
            {renderField('Last Name', data.personalInfo.lastName,
              (value) => handlePersonalInfoChange('lastName', value))}
          </div>
          {renderField('Email', data.personalInfo.email,
            (value) => handlePersonalInfoChange('email', value))}
          {renderField('Phone', data.personalInfo.phone,
            (value) => handlePersonalInfoChange('phone', value))}
          {renderField('Website', data.personalInfo.website,
            (value) => handlePersonalInfoChange('website', value))}
          {renderField('LinkedIn', data.personalInfo.linkedin,
            (value) => handlePersonalInfoChange('linkedin', value))}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Professional Summary</label>
            <textarea
              value={data.personalInfo.summary}
              onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
              placeholder="Write 2-4 short & energetic sentences to interest the reader! Mention your role, experience & most importantly - your biggest achievements, best qualities and skills."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 h-32"
            />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Employment History</h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExperience(index)}
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {exp.position || 'New Position'} at {exp.company || 'Company Name'}
                    </h3>
                    {!expandedExperiences.includes(index) && (
                      <p className="text-sm text-gray-500 mt-1">
                        {exp.startDate} - {exp.endDate}
                      </p>
                    )}
                  </div>
                  {expandedExperiences.includes(index) ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </div>

                {expandedExperiences.includes(index) && (
                  <div className="p-4 border-t">
                    <div className="flex justify-end mb-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteExperience(index);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid gap-4">
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
                        <textarea
                          value={exp.description}
                          onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                          className="w-full p-2 border rounded-lg h-32"
                          placeholder="Describe your role and achievements"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={addExperience}
              className="flex items-center gap-2 text-blue-600 font-medium mt-4"
            >
              <Plus size={16} />
              Add one more employment
            </button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleEducation(index)}
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {edu.degree || 'New Degree'} at {edu.school || 'School Name'}
                    </h3>
                    {!expandedEducation.includes(index) && (
                      <p className="text-sm text-gray-500 mt-1">
                        {edu.graduationDate}
                      </p>
                    )}
                  </div>
                  {expandedEducation.includes(index) ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </div>

                {expandedEducation.includes(index) && (
                  <div className="p-4 border-t">
                    <div className="flex justify-end mb-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEducation(index);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          className="w-full p-2 border rounded-lg"
                          placeholder="e.g. Bachelor of Science"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">School</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                          className="w-full p-2 border rounded-lg"
                          placeholder="e.g. University of Example"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Graduation Date</label>
                        <input
                          type="text"
                          value={edu.graduationDate}
                          onChange={(e) => handleEducationChange(index, 'graduationDate', e.target.value)}
                          className="w-full p-2 border rounded-lg"
                          placeholder="e.g. May 2023"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Description</label>
                        <textarea
                          value={edu.description}
                          onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                          className="w-full p-2 border rounded-lg h-32"
                          placeholder="Describe your studies, achievements, and relevant coursework"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={addEducation}
              className="flex items-center gap-2 text-blue-600 font-medium mt-4"
            >
              <Plus size={16} />
              Add one more education
            </button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills</h2>
          <div className="space-y-2">
            {data.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                  placeholder="e.g. Digital Marketing Strategy"
                />
                <button
                  onClick={() => deleteSkill(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <button 
            onClick={addSkill}
            className="flex items-center gap-2 text-blue-500 font-medium mt-4"
          >
            <Plus size={16} />
            Add one more skill
          </button>
        </div>
      </div>
    </div>
  );
}