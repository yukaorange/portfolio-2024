import React from 'react';

interface ContentRendererProps {
  content: string;
  className?: string;
}

export const ContentRenderer = ({ content }: ContentRendererProps) => {
  const lines = content.split(/\\n/);

  return (
    <>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
};
