import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const TextEditorContainer = styled.div`
    border: 1px solid var(--color-border);
    border-radius: 6px;
    margin-top: 15px;
    background-color: var(--color-background-card);
    display: flex;
    flex-direction: column;
`;

const Toolbar = styled.div`
    padding: 8px 10px;
    border-bottom: 1px solid var(--color-border);
    display: flex;
    gap: 10px;
    align-items: center;
`;

const EditorButton = styled.button`
    background-color: var(--color-background-page);
    color: var(--color-text-dark);
    border: 1px solid var(--color-border);
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;

    &:hover {
        background-color: var(--color-border);
    }

    &:active {
        background-color: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
    }
`;

const EditorContent = styled.div`
    flex-grow: 1;
    padding: 15px;
    min-height: 200px;
    max-height: 400px; /* Limit height and enable scroll */
    overflow-y: auto;
    outline: none;
    cursor: text;
    font-size: 1rem;
    line-height: 1.6;
    color: var(--color-text-dark);
`;

const FontSizeSelect = styled.select`
    padding: 6px 8px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background-color: var(--color-background-page);
    color: var(--color-text-dark);
    cursor: pointer;
    font-size: 0.9rem;
`;

function BasicEditor({ initialContent, onContentChange }) {
    const editorRef = useRef(null);
    const [currentFontSize, setCurrentFontSize] = useState('3'); // Default to h3 like behavior

    // Update contentEditable div when initialContent changes externally
    useEffect(() => {
        if (editorRef.current && initialContent !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = initialContent;
        }
    }, [initialContent]);

    const handleInput = useCallback(() => {
        if (onContentChange && editorRef.current) {
            onContentChange(editorRef.current.innerHTML);
        }
    }, [onContentChange]);

    const applyFormat = (command, value = null) => {
        if (editorRef.current) {
            document.execCommand(command, false, value);
            // Re-focus the editor after applying format to maintain cursor position
            editorRef.current.focus();
            // Manually trigger input to ensure parent state is updated after format
            handleInput();
        }
    };

    const handleFontSizeChange = (e) => {
        const newSize = e.target.value;
        setCurrentFontSize(newSize);
        // Use a heading tag or font size equivalent to apply visual size
        // document.execCommand('fontSize', false, newSize); is deprecated and less reliable
        // Instead, we can wrap content with a span or apply a class/style
        // For simplicity with execCommand, we'll simulate it with heading tags if possible,
        // or simply change the default font size of the editor content area.
        // For robust font size, we'd need a more advanced selection handling.
        // For this basic editor, we'll map to heading levels for simplicity or apply inline style.
        // Let's go with wrapping in a span with style for better control.

        // Save the current selection range
        const selection = window.getSelection();
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

        if (range) {
            // Create a temporary span to wrap the selected content
            const span = document.createElement('span');
            span.style.fontSize = `${parseInt(newSize) * 0.25 + 1}rem`; // Example: 1rem, 1.25rem, 1.5rem, etc.
            span.style.lineHeight = '1.6'; // Maintain line height

            // Wrap content if a selection exists
            try {
                range.surroundContents(span);
            } catch (error) {
                // If surroundContents fails (e.g., selection crosses elements),
                // we apply to the whole editor content as a fallback or ask user to select.
                console.warn("Could not surround selection, applying to entire content if possible.", error);
                editorRef.current.style.fontSize = `${parseInt(newSize) * 0.25 + 1}rem`;
            }
            // Restore the selection
            selection.removeAllRanges();
            selection.addRange(range);

            handleInput(); // Update parent state
        }
    };

    return (
        <TextEditorContainer>
            <Toolbar>
                <EditorButton type="button" onClick={() => applyFormat('bold')}>Bold</EditorButton>
                <FontSizeSelect value={currentFontSize} onChange={handleFontSizeChange}>
                    <option value="1">Small</option>
                    <option value="3">Medium</option>
                    <option value="5">Large</option>
                </FontSizeSelect>
            </Toolbar>
            <EditorContent
                ref={editorRef}
                contentEditable="true"
                onInput={handleInput}
            />
        </TextEditorContainer>
    );
}

export default BasicEditor;
