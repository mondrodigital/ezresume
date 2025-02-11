import React from 'react';

interface Props {
  content: string;
}

const HTMLPreview = ({ content }: Props) => {
  return (
    <div className="html-preview" dangerouslySetInnerHTML={{ __html: content }} />
  );
};

export default HTMLPreview;