import React, { useRef, useEffect, useState } from 'react';
import { ResumeData } from '../types';
import { shared, fontSize, colors } from '../styles/resumeStyles';
import { ChevronDown, Plus, Minus } from 'lucide-react';

interface Props {
  data: ResumeData;
  spacingScale: number;
}

export default function ResumePreview({ data, spacingScale }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  // Check for content overflow
  useEffect(() => {
    if (contentRef.current) {
      setHasOverflow(contentRef.current.scrollHeight > contentRef.current.clientHeight);
    }
  }, [data, spacingScale]);

  const spacing = {
    section: `${12 * spacingScale}px`,
    item: `${8 * spacingScale}px`,
    text: `${4 * spacingScale}px`,
  };

  return (
    <div className="relative">
      <div className="bg-white shadow-lg" style={{ width: '612px', height: '792px', padding: '40px', fontFamily: 'Arial, sans-serif' }}>
        <div 
          ref={contentRef} 
          className="h-[712px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
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
            <div style={{ marginTop: spacing.section, marginBottom: spacing.section }}>
              <h2 className="text-[14px] font-bold mb-[8px] border-b border-[#cccccc] pb-[4px]">
                Professional Summary
              </h2>
              <p className="text-[8px] whitespace-pre-line">
                {data.personalInfo.summary}
              </p>
            </div>
          )}

          {data.experience.length > 0 && (
            <div style={{ marginBottom: spacing.section }}>
              <h2 className="text-[14px] font-bold mb-[8px] border-b border-[#cccccc] pb-[4px]">
                Experience
              </h2>
              <div style={{ gap: spacing.item }}>
                {data.experience.map((exp, index) => (
                  <div key={index} style={{ marginBottom: spacing.item }}>
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
            <div style={{ marginBottom: spacing.section }}>
              <h2 className="text-[14px] font-bold mb-[8px] border-b border-[#cccccc] pb-[4px]">
                Education
              </h2>
              <div style={{ gap: spacing.item }}>
                {data.education.map((edu, index) => (
                  <div key={index} style={{ marginBottom: spacing.item }}>
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
            <div style={{ marginBottom: spacing.section }}>
              <h2 className="text-[14px] font-bold mb-[8px] border-b border-[#cccccc] pb-[4px]">
                Skills
              </h2>
              <div style={{ gap: spacing.item }}>
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
      </div>

      {/* Overflow indicator */}
      {hasOverflow && (
        <div className="absolute bottom-2 right-2 text-blue-600 bg-white rounded-full shadow-lg p-2 animate-bounce">
          <ChevronDown size={20} />
        </div>
      )}
    </div>
  );
}