import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import CodeMirror from '@uiw/react-codemirror';
import { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop, DragSourceMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Props {
  code: string;
  height: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

interface DraggedItem {
  text: string;
}

const DraggableText = ({ text }: { text: string }) => {
  const [{ isDragging }, drag] = useDrag<DraggedItem, unknown, { isDragging: boolean }>(() => ({
    type: 'text',
    item: { text },
    collect: (monitor: DragSourceMonitor<DraggedItem, unknown>) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '10px',
        backgroundColor: '#ddd',
        marginBottom: '10px',
        cursor: 'move',
      }}
    >
      {text}
    </div>
  );
};

const InputDropZone = ({ onDrop }: { onDrop: (text: string) => void }) => {
  const [inputValue, setInputValue] = useState('');
  const dropRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'text',
    drop: (item: DraggedItem) => {
      onDrop(item.text);
      setInputValue(item.text);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onDrop(value);
  };

  return (
    <div
      ref={(node) => {
        dropRef.current = node;
        drop(node);
      }}
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
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Or paste code here..."
        style={{ width: '100%', minHeight: '50px' }}
      />
    </div>
  );
};

export const CodeBlock = ({
  height,
  code,
  editable = false,
  onChange = () => {},
}: Props) => {
  const [editorCode, setEditorCode] = useState(code);

  const handleCodeChange = (value: string) => {
    setEditorCode(value);
    onChange(value);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <DraggableText text="Sample code: console.log('Hello!')" />
        <InputDropZone onDrop={handleCodeChange} />
        <CodeMirror
          value={editorCode}
          height={height}
          theme={tokyoNight}
          extensions={[StreamLanguage.define(go)]}
          onChange={handleCodeChange}
          editable={editable}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            bracketMatching: true,
          }}
        />
      </div>
    </DndProvider>
  );
}
