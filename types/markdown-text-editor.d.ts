declare module 'markdown-text-editor' {
    export interface MarkdownEditorOptions {
        onChange?: (value: string) => void;
        toolbar?: string[];
        [key: string]: unknown;
    }

    export default class MarkdownEditor {
        constructor(target: string | HTMLElement, options?: MarkdownEditorOptions);
        destroy(): void;
    }
}
