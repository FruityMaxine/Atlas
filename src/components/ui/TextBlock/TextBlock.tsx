import React from 'react';
import './TextBlock.css';

type TextVariant = 'hint' | 'paragraph' | 'caption' | 'section';

interface TextBlockProps {
  text: string;
  variant?: TextVariant;
  align?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
  className?: string;
}

const autoVariant = (text: string): TextVariant => {
  const compact = text.trim().length <= 24;
  return compact ? 'paragraph' : 'hint';
};

const TextBlock: React.FC<TextBlockProps> = ({
  text,
  variant,
  align = 'left',
  style,
  className = '',
}) => {
  const resolvedVariant = variant ?? autoVariant(text);

  return (
    <p
      className={`atlas-text-block atlas-text-${resolvedVariant} ${className}`.trim()}
      style={{ textAlign: align, ...(style || {}) }}
    >
      {text}
    </p>
  );
};

export default TextBlock;
