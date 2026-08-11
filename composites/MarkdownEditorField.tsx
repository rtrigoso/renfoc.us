'use client';
import { useEffect, useRef } from 'react';
import MarkdownEditor from 'markdown-text-editor';

type MarkdownEditorFieldProps = {
    id: string;
    defaultValue: string;
    onChange: (value: string) => void;
};

// Mirrors the library's default toolbar (markdown-text-editor.es.js addToolbar())
// minus "preview" and "image".
const TOOLBAR_WITHOUT_PREVIEW = [
    'undo',
    'redo',
    'heading',
    'blockquote',
    'ul',
    'ol',
    'checklist',
    'outdent',
    'indent',
    'bold',
    'italic',
    'strikethrough',
    'code',
    'codeblock',
    'hr',
    'table',
    'link',
];

export default function MarkdownEditorField({ id, defaultValue, onChange }: MarkdownEditorFieldProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const textarea = document.createElement('textarea');
        textarea.id = id;
        textarea.value = defaultValue;
        textarea.required = true;
        container.appendChild(textarea);

        const editor = new MarkdownEditor(textarea, { onChange, toolbar: TOOLBAR_WITHOUT_PREVIEW });

        return () => {
            editor.destroy();
            container.replaceChildren();
        };
    }, [id, defaultValue, onChange]);

    return <div ref={containerRef} />;
}
