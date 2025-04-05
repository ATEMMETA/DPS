'use client';
import { useState } from 'react';

interface Props {
  code: string;
  height: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

const CodeBlock = ({ height, code, editable = false, onChange = () => {} }: Props) => {
  const [editorCode, setEditorCode] = useState(code);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditorCode(value);
    onChange(value);
  };

  return (
    <textarea
      value={editorCode}
      onChange={handleCodeChange}
      style={{ height, width: '100%', minHeight: '100px' }}
      readOnly={!editable}
      placeholder="// Type code here"
    />
  );
};

export default CodeBlock;
