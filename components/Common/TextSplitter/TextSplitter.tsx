import React from 'react';

interface TextSplitterProps {
  children: React.ReactNode;
  className?: string;
}

export const TextSplitter = ({ children, className = '' }: TextSplitterProps) => {
  let counter = 0;

  const splitText = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === 'string') {
      return node.split('').map((char, index) => (
        <span key={index} data-index={counter++}>
          {char}
        </span>
      ));
    }

    if (React.isValidElement(node)) {
      return React.cloneElement(node, {
        ...node.props,
        children: splitText(node.props.children),
      });
    }

    return node;
  };

  return (
    <div className={className}>{React.Children.map(children, (child) => splitText(child))}</div>
  );
};
