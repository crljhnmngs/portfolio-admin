'use client';

import React, {
    useEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from 'react';
import {
    Editor,
    EditorState,
    RichUtils,
    convertToRaw,
    convertFromRaw,
    ContentState,
    DraftHandleValue,
    getDefaultKeyBinding,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import {
    Bold,
    Italic,
    Underline,
    Code,
    Type,
    List,
    ListOrdered,
    Quote,
    Heading1,
    Heading2,
} from 'lucide-react';

type RichTextEditorProps = {
    value?: string;
    onChange?: (value: string) => void;
};

export type RichTextEditorHandle = {
    focus: () => void;
};

const INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD', icon: <Bold size={16} /> },
    { label: 'Italic', style: 'ITALIC', icon: <Italic size={16} /> },
    { label: 'Underline', style: 'UNDERLINE', icon: <Underline size={16} /> },
    { label: 'Code', style: 'CODE', icon: <Code size={16} /> },
];

const BLOCK_TYPES = [
    { label: 'H1', style: 'header-one', icon: <Heading1 size={16} /> },
    { label: 'H2', style: 'header-two', icon: <Heading2 size={16} /> },
    { label: 'Blockquote', style: 'blockquote', icon: <Quote size={16} /> },
    { label: 'UL', style: 'unordered-list-item', icon: <List size={16} /> },
    {
        label: 'OL',
        style: 'ordered-list-item',
        icon: <ListOrdered size={16} />,
    },
    { label: 'Code Block', style: 'code-block', icon: <Type size={16} /> },
];

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
    ({ value, onChange }, ref) => {
        const editorRef = useRef<Editor>(null);

        const [editorState, setEditorState] = useState(() =>
            EditorState.createEmpty()
        );

        useEffect(() => {
            if (!value) return;

            const currentContent = editorState.getCurrentContent();
            if (currentContent.hasText()) return;

            try {
                const raw = JSON.parse(value);
                const content = convertFromRaw(raw);
                const newEditorState = EditorState.createWithContent(content);
                setEditorState(EditorState.moveFocusToEnd(newEditorState));
            } catch {
                const content = ContentState.createFromText(value);
                const newEditorState = EditorState.createWithContent(content);
                setEditorState(EditorState.moveFocusToEnd(newEditorState));
            }
        }, [value, editorState]);

        useImperativeHandle(ref, () => ({
            focus: () => editorRef.current?.focus(),
        }));

        const handleChange = (state: EditorState) => {
            setEditorState(state);
            if (onChange) {
                const content = state.getCurrentContent();
                const raw = convertToRaw(content);
                onChange(JSON.stringify(raw));
            }
        };

        const handleKeyCommand = (
            command: string,
            state: EditorState
        ): DraftHandleValue => {
            const newState = RichUtils.handleKeyCommand(state, command);
            if (newState) {
                handleChange(newState);
                return 'handled';
            }
            return 'not-handled';
        };

        const toggleInlineStyle = (style: string) => {
            handleChange(RichUtils.toggleInlineStyle(editorState, style));
        };

        const toggleBlockType = (blockType: string) => {
            handleChange(RichUtils.toggleBlockType(editorState, blockType));
        };

        const currentStyle = editorState.getCurrentInlineStyle();
        const selection = editorState.getSelection();
        const blockType = editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey())
            .getType();

        return (
            <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                    {INLINE_STYLES.map(({ label, style, icon }) => (
                        <button
                            type="button"
                            key={style}
                            onClick={() => toggleInlineStyle(style)}
                            className={`flex items-center gap-1 px-2 py-1 border rounded-md text-sm transition-colors
                                text-black dark:text-white
                                ${
                                    currentStyle.has(style)
                                        ? 'bg-gray-200 dark:bg-gray-700 font-semibold'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            aria-label={label}
                        >
                            {icon}
                        </button>
                    ))}

                    <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-2" />

                    {BLOCK_TYPES.map(({ label, style, icon }) => (
                        <button
                            type="button"
                            key={style}
                            onClick={() => toggleBlockType(style)}
                            className={`flex items-center gap-1 px-2 py-1 border rounded-md text-sm transition-colors
                                text-black dark:text-white
                                ${
                                    blockType === style
                                        ? 'bg-gray-200 dark:bg-gray-700 font-semibold'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            aria-label={label}
                        >
                            {icon}
                        </button>
                    ))}
                </div>

                <div className="border border-gray-300 dark:border-gray-700 rounded-md p-4 min-h-[160px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none">
                    <Editor
                        editorState={editorState}
                        onChange={handleChange}
                        handleKeyCommand={handleKeyCommand}
                        keyBindingFn={getDefaultKeyBinding}
                        spellCheck
                        ref={editorRef}
                    />
                </div>
            </div>
        );
    }
);

RichTextEditor.displayName = 'RichTextEditor';
export default RichTextEditor;
