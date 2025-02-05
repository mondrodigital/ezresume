import React from 'react';

interface Props {
  content: string;
}

export interface HTMLPreviewProps {
  content: string;
}

const HTMLPreview: React.FC<HTMLPreviewProps> = ({ content }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default HTMLPreview;