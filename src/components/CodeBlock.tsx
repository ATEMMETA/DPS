import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import CodeMirror from '@uiw/react-codemirror';
import { FC, useEffect, useState } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Props {
  code: string;
  height: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

// Input Drop Zone Component
const InputDropZone: FC<{
  onDrop: (text: string) => void;
}> = ({ onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'text',
    drop: (item: { text: string }) => onDrop(item.text),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        border: `2px dashed ${isOver ? 'green' : 'gray'}`,
        padding: '20px',
        marginBottom: '20px',
        minHeight: '100px',
        backgroundColor: isOver ? '#e0ffe0' : '#f0f0f0',
      }}
    >
      <p>Drag code here or paste below</p>
      <textarea
        onChange={e => onDrop(e.target.value)}
        placeholder="Or paste code here..."
        style={{ width: '100%', minHeight: '50px' }}
      />
    </div>
  );
};

// Output Zone Component
const OutputZone: FC<{ output: string }> = ({ output }) => (
  <div
    style={{
      border: '2px solid gray',
      padding: '20px',
      minHeight: '100px',
      backgroundColor: '#fff',
    }}
  >
    <p>Output:</p>
    <pre>{output || 'Waiting for response...'}</pre>
  </div>
);

export const CodeBlock: FC<Props> = ({
  height,
  code,
  editable = false,
  onChange = () => {},
}) => {
  const [copyText, setCopyText] = useState<string>('Copy');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputCode, setInputCode] = useState<string>('');

  useEffect(() => {
    if (!inputCode) return;

    const fetchData = async () => {
      setIsLoading(true);
      setApiError(null);
      let retries = 3;
      while (retries > 0) {
        try {
          const res = await fetch(
            'https://79da20cc15999447f054486ccf411bd8.serveo.net/process_text',
            {
              method: 'POST', // Switch to POST for sending code
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: inputCode }),
            }
          );
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          const data = await res.json();
          setApiResponse(data.message);
          setApiError(null);
          setIsLoading(false);
          return;
        } catch (err: any) {
          console.error('Fetch error:', err);
          setApiError(err.message || 'Unknown error');
          retries--;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      setApiError('Failed after retries');
      setIsLoading(false);
    };
    fetchData();
  }, [inputCode]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCopyText('Copy');
    }, 2000);
    return () => clearTimeout(timeout);
  }, [copyText]);

  const handleDrop = (text: string) => {
    setInputCode(text);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`relative h-${height}px overflow-scroll`}>
        <button
          className="absolute right-0 top-0 z-10 rounded bg-[#1A1B26] p-1 text-xs text-white hover:bg-[#2D2E3A] active:bg-[#2D2E3A]"
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopyText('Copied!');
          }}
        >
          {copyText}
        </button>
        <InputDropZone onDrop={handleDrop} />
        {isLoading && <p>Loading...</p>}
        {apiError && <p style={{ color: 'red' }}>Error: {apiError}</p>}
        <OutputZone output={apiResponse} />
        <CodeMirror
          editable={editable}
          value={code}
          minHeight={`${height}px`}
          className="rounded-md overflow-scroll"
          extensions={[StreamLanguage.define(go)]}
          theme={tokyoNight}
          onChange={(value) => onChange(value)}
        />
      </div>
    </DndProvider>
  );
};
