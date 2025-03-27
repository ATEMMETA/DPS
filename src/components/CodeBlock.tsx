import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import CodeMirror from '@uiw/react-codemirror';
import { FC, useState } from 'react';
import { DndProvider, useDrag, useDrop, ConnectDropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

yinterface Props {
  code: string;
  height: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

interface DraggedItem {
  text: string;
}

const DraggableText: FC<{ text: string }> = ({ text }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'text',
    item: { text },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(node) => {
        if (node) {
          drag(node as HTMLElement);
        }
      }}
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

const InputDropZone: FC<{ onDrop: (text: string) => void }> = ({ onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'text',
    drop: (item: DraggedItem) => onDrop(item.text),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop as unknown as React.RefObject<HTMLDivElement>}
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
        onChange={(e) => onDrop(e.target.value)}
        placeholder="Or paste code here..."
        style={{ width: '100%', minHeight: '50px' }}
      />
    </div>
  );
};

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
  const [editorCode, setEditorCode] = useState(code);

  const handleCodeChange = (value: string) => {
    setEditorCode(value);
    onChange(value);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <DraggableText text="Sample code: console.log('Hello!')" />
        <InputDropZone onDrop={(text) => handleCodeChange(text)} />
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
};
