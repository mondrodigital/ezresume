import React from 'react';
import { ResumeData } from '../types';
import { shared, fontSize, colors } from '../styles/resumeStyles';

interface Props {
  data: ResumeData;
}

export default function ResumePreview({ data }: Props) {
  return (
    <div 
      className="bg-white shadow-lg" 
      style={{ 
        width: '612px', 
        height: '792px', 
        padding: '40px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div className="text-center">
        <h1 className="text-[20px] font-bold mb-1">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <div className="flex justify-center items-center text-[8px] text-[#666] gap-2">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && (
            <>
              <span>•</span>
              <span>{data.personalInfo.phone}</span>
            </>
          )}
          {data.personalInfo.website && (
            <>
              <span>•</span>
              <span>{data.personalInfo.website}</span>
            </>
          )}
          {data.personalInfo.linkedin && (
            <>
              <span>•</span>
              <span>{data.personalInfo.linkedin}</span>
            </>
          )}
        </div>
      </div>

      {data.personalInfo.summary && (
        <div className="mt-[16px] mb-[12px]">
          <h2 className="text-[14px] font-bold mb-[8px] border-b border-[#ccc] pb-[4px]">
            Professional Summary
          </h2>
          <p className="text-[8px] whitespace-pre-line">
            {data.personalInfo.summary}
          </p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="mb-[12px]">
          <h2 className="text-[14px] font-bold mb-[8px] border-b border-[#ccc] pb-[4px]">
            Experience
          </h2>
          <div className="space-y-[8px]">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="text-[12px] font-bold">{exp.company}</div>
                <div className="flex justify-between items-center">
                  <div className="text-[10px] text-[#666]">{exp.position}</div>
                  <div className="text-[8px] text-[#666]">
                    {exp.startDate} - {exp.endDate}
                  </div>
                </div>
                <p className="text-[8px] mt-1 ml-4 whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.education.length > 0 && (
        <div className="mb-[12px]">
          <h2 className="text-[14px] font-bold mb-[8px] border-b border-[#ccc] pb-[4px]">
            Education
          </h2>
          <div className="space-y-[8px]">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="text-[12px] font-bold">{edu.school}</div>
                <div className="flex justify-between items-center">
                  <div className="text-[10px] text-[#666]">{edu.degree}</div>
                  <div className="text-[8px] text-[#666]">
                    {edu.graduationDate}
                  </div>
                </div>
                <p className="text-[8px] mt-1 ml-4 whitespace-pre-line">
                  {edu.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="mb-[12px]">
          <h2 className="text-[14px] font-bold mb-[8px] border-b border-[#ccc] pb-[4px]">
            Skills
          </h2>
          <div className="flex flex-wrap gap-[5px]">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="text-[8px] bg-[#f0f0f0] px-[8px] py-[3px] rounded-[10px]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}