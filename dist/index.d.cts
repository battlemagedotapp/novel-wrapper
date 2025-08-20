import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

declare const RichTextProvider: ({ convexSiteUrl, children, }: {
    convexSiteUrl: string;
    children: ReactNode;
}) => react_jsx_runtime.JSX.Element;

type RichTextEditorProps = {
    /** JSON content as a string (stringified JSONContent). */
    value?: string | null;
    /** Called with a stringified JSONContent whenever the editor updates. */
    onChange?: (value: string) => void;
    className?: string;
};
declare const RichTextEditor: ({ value, onChange, className }: RichTextEditorProps) => react_jsx_runtime.JSX.Element | null;

type RichTextViewerProps = {
    value?: string | null;
    className?: string;
};
declare const RichTextViewer: ({ value, className }: RichTextViewerProps) => react_jsx_runtime.JSX.Element | null;

export { RichTextEditor, RichTextProvider, RichTextViewer };
