import React from 'react';

interface Props {
  content: string;
}

const HTMLPreview = ({ content }: Props) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
};

export { HTMLPreview };  // Named export
export default HTMLPreview;  // Also keep default export for compatibility