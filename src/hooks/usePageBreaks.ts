import { useMemo } from 'react';
import { ResumeData } from '../types';

export interface PageContent {
  personalInfo: boolean;
  summary: boolean;
  experience: number[];
  education: number[];
  skills: boolean;
}

// Maximum items per page (based on actual content height)
const ITEMS_PER_PAGE = 5;

export const usePageBreaks = (data: ResumeData) => {
  return useMemo(() => {
    const pages: PageContent[] = [];
    
    // Start with first page
    let currentPage: PageContent = {
      personalInfo: true,
      summary: true,
      experience: [],
      education: [],
      skills: false
    };
    
    let itemCount = 0;
    let experienceStarted = false;
    let educationStarted = false;

    // Add experience items
    data.experience.forEach((_, index) => {
      if (!experienceStarted) {
        experienceStarted = true;
        itemCount++; // Count the section header
      }

      if (itemCount >= ITEMS_PER_PAGE) {
        pages.push(currentPage);
        currentPage = {
          personalInfo: false,
          summary: false,
          experience: [index],
          education: [],
          skills: false
        };
        itemCount = 1; // Reset count but include current item
      } else {
        currentPage.experience.push(index);
        itemCount++;
      }
    });

    // Add education items
    data.education.forEach((_, index) => {
      if (!educationStarted) {
        educationStarted = true;
        itemCount++; // Count the section header
      }

      if (itemCount >= ITEMS_PER_PAGE) {
        pages.push(currentPage);
        currentPage = {
          personalInfo: false,
          summary: false,
          experience: [],
          education: [index],
          skills: false
        };
        itemCount = 1; // Reset count but include current item
      } else {
        currentPage.education.push(index);
        itemCount++;
      }
    });

    // Add skills section
    if (data.skills.length > 0) {
      if (itemCount >= ITEMS_PER_PAGE) {
        pages.push(currentPage);
        currentPage = {
          personalInfo: false,
          summary: false,
          experience: [],
          education: [],
          skills: true
        };
      } else {
        currentPage.skills = true;
      }

    }

    pages.push(currentPage);
    return { pages, totalPages: pages.length };
  }, [data]);
}; 