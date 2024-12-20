import { KeyboardEvent, ChangeEvent, useRef } from 'react';

interface ExpandableFormProps {
    // mutateAsync: UseMutateAsyncFunction<string, Error, string, unknown>
    handleSubmit(): Promise<void>
    content: string
    setContent: React.Dispatch<React.SetStateAction<string>>
    isPending: boolean

}

export function ExpandableForm({ handleSubmit, content, setContent, isPending }: ExpandableFormProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const defaultRows = 1;
    const maxRows = undefined; // You can set a max number of rows

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        const textarea = e.target;
        textarea.style.height = "auto";
        const style = window.getComputedStyle(textarea);
        const borderHeight = parseInt(style.borderTopWidth) + parseInt(style.borderBottomWidth);
        const paddingHeight = parseInt(style.paddingTop) + parseInt(style.paddingBottom);
        const lineHeight = parseInt(style.lineHeight);
        const maxHeight = maxRows ? lineHeight * maxRows + borderHeight + paddingHeight : Infinity;
        const newHeight = Math.min(textarea.scrollHeight + borderHeight, maxHeight);
        textarea.style.height = `${newHeight}px`;
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
            textareaRef.current?.style.setProperty('height', 'auto');
        }
    };

    return (
        <form className="input__form">
            <div className="text__input__container">
                <textarea
                    value={content}
                    ref={textareaRef}
                    rows={defaultRows}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="text__input"
                    style={{ maxHeight: '100px' }}
                    disabled={isPending}
                    placeholder="Type your message... (Press Enter to submit, Shift+Enter for new line)"
                />
                {/* <div className="absolute bottom-3 right-3 text-sm text-gray-500">
          Press Enter ↵ to submit
        </div> */}
            </div>
        </form>
    );
}