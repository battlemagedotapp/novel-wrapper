import {
    EditorContent,
    EditorRoot,
    type JSONContent
} from "novel";
import { useState } from "react";
import { defaultExtensions } from "../extensions/defaultExtensions";
import { defaultEditorContent } from "../lib/defaultContent";
import { cn } from "../lib/utils";

type RichTextViewerProps = {
    value?: string | null;
    className?: string;
};

export const RichTextViewer = ({ value, className }: RichTextViewerProps) => {
    const parsedInitial = (() => {
        if (!value || value.trim() === "") return defaultEditorContent;
        try {
            return JSON.parse(value) as JSONContent;
        } catch {
            return defaultEditorContent;
        }
    })();

    const [initialContent] = useState<null | JSONContent>(parsedInitial);
    const extensions = [...defaultExtensions];

    if (!initialContent) return null;

    return (
        <div className="w-full">
            <EditorRoot>
                <EditorContent
                    initialContent={initialContent}
                    extensions={extensions}
                    className="w-full"
                    editorProps={{
                        editable: () => false,
                        attributes: {
                            class:
                                (cn("bg-transparent outline-none", className)),
                        },
                    }}
                >
                </EditorContent>
            </EditorRoot>
        </div>
    );
};