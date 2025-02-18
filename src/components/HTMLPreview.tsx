import React from 'react';

interface Props {
  content: string;
}

const HTMLPreview = ({ content }: Props) => {
  const formattedContent = content
    .replace(/<ul>/g, '<div class="list">')
    .replace(/<\/ul>/g, '</div>')
    .replace(/<ol>/g, '<div class="list numbered">')
    .replace(/<\/ol>/g, '</div>')
    .replace(/<li>(.*?)<\/li>/g, (match, p1, offset, string) => {
      const isNumbered = string.lastIndexOf('<ol', offset) > string.lastIndexOf('<ul', offset);
      if (isNumbered) {
        return `<div class="bullet numbered"><span class="bullet-point"></span>${p1}</div>`;
      }
      return `<div class="bullet"><span class="bullet-point">•</span>${p1}</div>`;
    });

  return (
    <div 
      className="html-preview" 
      dangerouslySetInnerHTML={{ __html: formattedContent }}
      style={{
        '& .list': {
          counterReset: 'item',
          margin: 0,
          padding: 0,
        },
        '& .bullet': {
          display: 'block',
          position: 'relative',
          paddingLeft: '12pt',
          marginBottom: '2pt',
        },
        '& .bullet.numbered': {
          counterIncrement: 'item',
        },
        '& .bullet.numbered .bullet-point::before': {
          content: 'counter(item) "."',
          position: 'absolute',
          left: 0,
        },
        '& .bullet-point': {
          position: 'absolute',
          left: 0,
        }
      }}
    />
  );
};

export default HTMLPreview;