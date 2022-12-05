import { useEffect, useRef } from 'react';
import jsonlint from 'jsonlint-mod';
import CodeMirror from 'codemirror';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/comment/continuecomment';
import 'codemirror/addon/comment/comment';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/keymap/sublime.js';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/json-lint.js';

window.jsonlint = jsonlint;

interface IProps {
  value?: string;
  onChange(value: string): void;
}

const JsonEditor = (props: IProps) => {
  const { value, onChange } = props;
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      const myCodeMirror = CodeMirror.fromTextArea(editorRef?.current, {
        mode: 'application/json',
        lint: true,
        tabSize: 2,
      });
  
      try {
        if (value) {
          myCodeMirror.setValue(JSON.stringify(JSON.parse(value), null, 2));
        }
      } catch (error) {
        myCodeMirror.setValue(value || '');
      }
  
      myCodeMirror.on('change', cm => {
        onChange(cm.getValue());
      });
    }
    
  }, [value, onChange]);

  return (
    <textarea ref={editorRef}></textarea>
  );
};

export default JsonEditor;