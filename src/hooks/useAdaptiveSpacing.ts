import { useMemo } from 'react';
import { ResumeData } from '../types';

export const useAdaptiveSpacing = (data: ResumeData) => {
  return useMemo(() => {
    // Calculate total content length
    const contentLength = 
      (data.personalInfo.summary?.length || 0) +
      data.experience.reduce((acc, exp) => acc + (exp.description?.length || 0), 0) +
      data.education.reduce((acc, edu) => acc + (edu.description?.length || 0), 0) +
      data.skills.length;

    // Default spacing
    if (contentLength === 0) {
      return {
        sectionGap: 12,
        lineHeight: 1.4,
        itemSpacing: 8
      };
    }

    // Adjust spacing based on content
    if (contentLength > 2000) {
      return {
        sectionGap: 8,
        lineHeight: 1.2,
        itemSpacing: 4
      };
    }

    if (contentLength < 1000) {
      return {
        sectionGap: 16,
        lineHeight: 1.6,
        itemSpacing: 12
      };
    }

    // Default for medium content
    return {
      sectionGap: 12,
      lineHeight: 1.4,
      itemSpacing: 8
    };
  }, [data]);
}; 