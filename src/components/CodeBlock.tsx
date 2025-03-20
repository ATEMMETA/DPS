import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import CodeMirror from '@uiw/react-codemirror';
import { FC, useEffect, useState } from 'react';

interface Props {
  code: string;
  height: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let retries = 3;
      while (retries > 0) {
        try {
          const res = await fetch(
            'https://79da20cc15999447f054486ccf411bd8.serveo.net/process_text' //Replace with new address
          );
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data = await res.json();
          setApiResponse(data.message);
          setApiError(null);
          setIsLoading(false);
          return; // Success, exit retry loop
        } catch (err) {
          console.error(err);
          setApiError(err.message);
          retries--;
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCopyText('Copy');
    }, 2000);
    return () => clearTimeout(timeout);
  }, [copyText]);

  return (
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
      {isLoading && <p>Loading...</p>}
      {apiError && <p style={{ color: 'red' }}>Error: {apiError}</p>}
      {apiResponse && <p>{apiResponse}</p>}
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
  );
};
