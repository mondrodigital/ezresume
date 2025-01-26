import { ResumeData } from './types';

export const templates: Record<Template, {
  name: string;
  description: string;
}> = {
  modern: {
    name: 'Modern',
    description: 'Clean and contemporary design'
  },
  classic: {
    name: 'Classic',
    description: 'Traditional and professional layout'
  },
  minimal: {
    name: 'Minimal',
    description: 'Simple and elegant style'
  }
}; 