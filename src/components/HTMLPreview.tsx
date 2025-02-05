import React from 'react';

interface Props {
  content: string;
}

const HTMLPreview = ({ content }: Props) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
};

export default HTMLPreview;