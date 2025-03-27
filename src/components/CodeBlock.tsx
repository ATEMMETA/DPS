import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import CodeMirror from '@uiw/react-codemirror';
import { FC, useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
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
      ref={drop} // Correct ref usage for drop
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
  // ... (rest of your CodeBlock component) ...
};
