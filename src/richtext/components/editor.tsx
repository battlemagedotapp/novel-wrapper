import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  type JSONContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste
} from "novel";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "../extensions/defaultExtensions";
import { createConvexImageUpload, useConvexImageUpload } from "../extensions/image-upload";
import { createCustomSlashCommand, createCustomSuggestionItems } from "../extensions/slash-command";
import { defaultEditorContent } from "../lib/defaultContent";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { NodeSelector } from "./selectors/node-selector";
import { TextButtons } from "./selectors/text-buttons";
import { Separator } from "./ui/separator";

// Helper function to check if editor content is empty
const isEditorEmpty = (content: JSONContent): boolean => {
  if (!content.content || content.content.length === 0) return true;

  // Check if all content nodes are empty paragraphs or have no text
  return content.content.every((node) => {
    if (node.type === "paragraph") {
      // Empty paragraph or paragraph with no content
      return !node.content || node.content.length === 0 ||
        node.content.every((textNode) =>
          textNode.type === "text" && (!textNode.text || textNode.text.trim() === "")
        );
    }
    // For other node types, consider them as having content
    return false;
  });
};

type RichTextEditorProps = {
  /** JSON content as a string (stringified JSONContent). */
  value?: string | null;
  /** Called with a stringified JSONContent whenever the editor updates. */
  onChange?: (value: string) => void;
  className?: string;
};

export const RichTextEditor = ({ value, onChange, className }: RichTextEditorProps) => {
  // Parse incoming value or fall back to the default editor content
  const parsedInitial = (() => {
    if (!value || value.trim() === "") return defaultEditorContent;
    try {
      return JSON.parse(value) as JSONContent;
    } catch {
      return defaultEditorContent;
    }
  })();

  const [initialContent] = useState<null | JSONContent>(parsedInitial);
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  // Use the Convex image upload hook
  const { onUpload: convexUpload } = useConvexImageUpload();
  const convexUploadFn = createConvexImageUpload(convexUpload);

  // Create slash command with Convex upload
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const slashCommand = createCustomSlashCommand(convexUploadFn as any);
  const suggestionItems = createCustomSuggestionItems(convexUploadFn as any);
  const extensions = [...defaultExtensions, slashCommand];

  const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
    const json = editor.getJSON();
    try {
      // Check if the content is empty (matches default structure with no text)
      const isEmpty = isEditorEmpty(json);
      // Send empty string if content is empty, otherwise send JSON string
      onChange?.(isEmpty ? "" : JSON.stringify(json));
    } catch {
      // noop
    }
  }, 500);

  if (!initialContent) return null;

  return (
    <div className={"w-full " + (className || "")}>
      <p className="text-sm text-muted-foreground mb-2">
        Press <kbd>/</kbd> to open the palette. You can also paste or drop images directly into the editor.
      </p>
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className="w-full"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) => handleImagePaste(view, event, convexUploadFn),
            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, convexUploadFn),
            attributes: {
              class:
                "prose prose-lg p-6 dark:prose-invert max-w-full rounded-md border border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 bg-transparent shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]",
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
          }}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item?.command?.(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorBubble
            className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
          >
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />
            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};
