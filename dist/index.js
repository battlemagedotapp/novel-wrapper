// src/providers/RichTextProvider.tsx
import { createContext, useContext } from "react";
import { jsx } from "react/jsx-runtime";
var RichTextContext = createContext(void 0);
var RichTextProvider = ({
  convexSiteUrl,
  children
}) => {
  if (!convexSiteUrl) {
    throw new Error("RichTextProvider requires a convexSiteUrl prop");
  }
  const getImageUrl = (storageId) => `${convexSiteUrl}/getImage?storageId=${storageId}`;
  return /* @__PURE__ */ jsx(RichTextContext.Provider, { value: { convexSiteUrl, getImageUrl }, children });
};
var useRichText = () => {
  const ctx = useContext(RichTextContext);
  if (!ctx) {
    throw new Error("useRichText must be used within a RichTextProvider");
  }
  return ctx;
};

// src/richtext/components/editor.tsx
import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste
} from "novel";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

// src/richtext/extensions/defaultExtensions.ts
import {
  Color,
  GlobalDragHandle,
  HighlightExtension,
  HorizontalRule,
  Placeholder,
  StarterKit,
  TaskItem,
  TaskList,
  TextStyle,
  TiptapImage,
  TiptapLink,
  TiptapUnderline,
  UpdatedImage,
  UploadImagesPlugin,
  Youtube
} from "novel";
import { cx } from "class-variance-authority";
var placeholder = Placeholder;
var tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer"
    )
  }
});
var tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: cx("opacity-40 rounded-lg border border-stone-200")
      })
    ];
  }
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted")
  }
});
var updatedImage = UpdatedImage.extend({
  name: "updatedImage"
}).configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted")
  }
});
var taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx("not-prose pl-2 ")
  }
});
var taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx("flex gap-2 items-start my-4")
  },
  nested: true
});
var horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx("mt-4 mb-6 border-t border-muted-foreground")
  }
});
var starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx("list-disc list-outside leading-3 -mt-2")
    }
  },
  orderedList: {
    HTMLAttributes: {
      class: cx("list-decimal list-outside leading-3 -mt-2")
    }
  },
  listItem: {
    HTMLAttributes: {
      class: cx("leading-normal -mb-2")
    }
  },
  blockquote: {
    HTMLAttributes: {
      class: cx("border-l-4 border-primary")
    }
  },
  horizontalRule: false,
  dropcursor: {
    color: "#DBEAFE",
    width: 4
  },
  gapcursor: false
});
var youtube = Youtube.configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted")
  },
  inline: false
});
var defaultExtensions = [
  starterKit,
  placeholder,
  tiptapLink,
  tiptapImage,
  updatedImage,
  taskList,
  taskItem,
  horizontalRule,
  youtube,
  TiptapUnderline,
  HighlightExtension,
  TextStyle,
  Color,
  GlobalDragHandle
];

// src/richtext/extensions/image-upload.ts
import { useFileUpload } from "convex-file-upload";
import { createImageUpload } from "novel";
import { toast } from "sonner";
var useConvexImageUpload = () => {
  const { uploadFile } = useFileUpload({
    maxSizeInMB: 20,
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    successMessage: "Image uploaded successfully!",
    errorMessage: "Failed to upload image"
  });
  const { getImageUrl } = useRichText();
  const onUpload = async (file) => {
    try {
      const storageId = await uploadFile(file);
      if (!storageId) {
        throw new Error("Failed to upload image");
      }
      const imageUrl = getImageUrl(storageId);
      if (!imageUrl) {
        throw new Error("Failed to get image URL");
      }
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  return { onUpload };
};
var createConvexImageUpload = (uploadFn) => {
  return createImageUpload({
    onUpload: uploadFn,
    validateFn: (file) => {
      if (!file.type.includes("image/")) {
        toast.error("File type not supported.");
        return false;
      }
      if (file.size / 1024 / 1024 > 20) {
        toast.error("File size too big (max 20MB).");
        return false;
      }
      return true;
    }
  });
};

// src/richtext/extensions/slash-command.tsx
import {
  CheckSquare,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  Text,
  TextQuote,
  Youtube as Youtube2
} from "lucide-react";
import { Command, createSuggestionItems as novelCreateSuggestionItems, renderItems } from "novel";
import { jsx as jsx2 } from "react/jsx-runtime";
var createCustomSuggestionItems = (uploadFunction) => novelCreateSuggestionItems([
  {
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: /* @__PURE__ */ jsx2(Text, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
    }
  },
  {
    title: "To-do List",
    description: "Track tasks with a to-do list.",
    searchTerms: ["todo", "task", "list", "check", "checkbox"],
    icon: /* @__PURE__ */ jsx2(CheckSquare, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    }
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    searchTerms: ["title", "big", "large"],
    icon: /* @__PURE__ */ jsx2(Heading1, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
    }
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium"],
    icon: /* @__PURE__ */ jsx2(Heading2, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    }
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small"],
    icon: /* @__PURE__ */ jsx2(Heading3, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    }
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["unordered", "point"],
    icon: /* @__PURE__ */ jsx2(List, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    }
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering.",
    searchTerms: ["ordered"],
    icon: /* @__PURE__ */ jsx2(ListOrdered, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    }
  },
  {
    title: "Quote",
    description: "Capture a quote.",
    searchTerms: ["blockquote"],
    icon: /* @__PURE__ */ jsx2(TextQuote, { size: 18 }),
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").toggleBlockquote().run()
  },
  {
    title: "Image",
    description: "Upload an image from your computer.",
    searchTerms: ["photo", "picture", "media"],
    icon: /* @__PURE__ */ jsx2(ImageIcon, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        if (input.files?.length) {
          const file = input.files[0];
          const pos = editor.view.state.selection.from;
          uploadFunction(file, editor.view, pos);
        }
      };
      input.click();
    }
  },
  {
    title: "Youtube",
    description: "Embed a Youtube video.",
    searchTerms: ["video", "youtube", "embed"],
    icon: /* @__PURE__ */ jsx2(Youtube2, { size: 18 }),
    command: ({ editor, range }) => {
      const videoLink = prompt("Please enter Youtube Video Link");
      if (!videoLink)
        return;
      const ytregex = new RegExp(
        // eslint-disable-next-line no-useless-escape
        /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
      );
      if (ytregex.test(videoLink)) {
        editor.chain().focus().deleteRange(range).setYoutubeVideo({
          src: videoLink
        }).run();
      } else {
        if (videoLink !== null) {
          alert("Please enter a correct Youtube Video Link");
        }
      }
    }
  }
]);
var createCustomSlashCommand = (uploadFunction) => {
  const suggestionItems2 = createCustomSuggestionItems(uploadFunction);
  return Command.configure({
    suggestion: {
      items: () => suggestionItems2,
      render: renderItems
    }
  });
};
var suggestionItems = novelCreateSuggestionItems([
  // Add basic items without image upload for backward compatibility
  {
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: /* @__PURE__ */ jsx2(Text, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
    }
  }
]);
var slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems
  }
});

// src/richtext/lib/defaultContent.ts
var defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "" }]
    }
  ]
};

// src/richtext/components/selectors/color-selector.tsx
import { Check, ChevronDown } from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";

// src/richtext/components/ui/button.tsx
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

// src/richtext/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/richtext/components/ui/button.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx3(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

// src/richtext/components/ui/popover.tsx
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { jsx as jsx4 } from "react/jsx-runtime";
function Popover({
  ...props
}) {
  return /* @__PURE__ */ jsx4(PopoverPrimitive.Root, { "data-slot": "popover", ...props });
}
function PopoverTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx4(PopoverPrimitive.Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx4(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx4(
    PopoverPrimitive.Content,
    {
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        className
      ),
      ...props
    }
  ) });
}

// src/richtext/components/selectors/color-selector.tsx
import { jsx as jsx5, jsxs } from "react/jsx-runtime";
var TEXT_COLORS = [
  {
    name: "Default",
    color: "var(--novel-black)"
  },
  {
    name: "Purple",
    color: "#9333EA"
  },
  {
    name: "Red",
    color: "#E00000"
  },
  {
    name: "Yellow",
    color: "#EAB308"
  },
  {
    name: "Blue",
    color: "#2563EB"
  },
  {
    name: "Green",
    color: "#008A00"
  },
  {
    name: "Orange",
    color: "#FFA500"
  },
  {
    name: "Pink",
    color: "#BA4081"
  },
  {
    name: "Gray",
    color: "#A8A29E"
  }
];
var HIGHLIGHT_COLORS = [
  {
    name: "Default",
    color: "var(--novel-highlight-default)"
  },
  {
    name: "Purple",
    color: "var(--novel-highlight-purple)"
  },
  {
    name: "Red",
    color: "var(--novel-highlight-red)"
  },
  {
    name: "Yellow",
    color: "var(--novel-highlight-yellow)"
  },
  {
    name: "Blue",
    color: "var(--novel-highlight-blue)"
  },
  {
    name: "Green",
    color: "var(--novel-highlight-green)"
  },
  {
    name: "Orange",
    color: "var(--novel-highlight-orange)"
  },
  {
    name: "Pink",
    color: "var(--novel-highlight-pink)"
  },
  {
    name: "Gray",
    color: "var(--novel-highlight-gray)"
  }
];
var ColorSelector = ({ open, onOpenChange }) => {
  const { editor } = useEditor();
  if (!editor)
    return null;
  const activeColorItem = TEXT_COLORS.find(({ color }) => editor.isActive("textStyle", { color }));
  const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) => editor.isActive("highlight", { color }));
  return /* @__PURE__ */ jsxs(Popover, { modal: true, open, onOpenChange, children: [
    /* @__PURE__ */ jsx5(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { size: "sm", className: "gap-2 rounded-none", variant: "ghost", children: [
      /* @__PURE__ */ jsx5(
        "span",
        {
          className: "rounded-sm px-1",
          style: {
            color: activeColorItem?.color,
            backgroundColor: activeHighlightItem?.color
          },
          children: "A"
        }
      ),
      /* @__PURE__ */ jsx5(ChevronDown, { className: "h-4 w-4" })
    ] }) }),
    /* @__PURE__ */ jsxs(
      PopoverContent,
      {
        sideOffset: 5,
        className: "my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl ",
        align: "start",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx5("div", { className: "my-1 px-2 text-sm font-semibold text-muted-foreground", children: "Color" }),
            TEXT_COLORS.map(({ name, color }) => /* @__PURE__ */ jsx5(
              EditorBubbleItem,
              {
                onSelect: () => {
                  editor.commands.unsetColor();
                  if (name !== "Default") {
                    editor.chain().focus().setColor(color).run();
                  }
                  onOpenChange(false);
                },
                className: "flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent",
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx5("div", { className: "rounded-sm border px-2 py-px font-medium", style: { color }, children: "A" }),
                  /* @__PURE__ */ jsx5("span", { children: name })
                ] })
              },
              name
            ))
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx5("div", { className: "my-1 px-2 text-sm font-semibold text-muted-foreground", children: "Background" }),
            HIGHLIGHT_COLORS.map(({ name, color }) => /* @__PURE__ */ jsxs(
              EditorBubbleItem,
              {
                onSelect: () => {
                  editor.commands.unsetHighlight();
                  if (name !== "Default") {
                    editor.chain().focus().setHighlight({ color }).run();
                  }
                  onOpenChange(false);
                },
                className: "flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx5("div", { className: "rounded-sm border px-2 py-px font-medium", style: { backgroundColor: color }, children: "A" }),
                    /* @__PURE__ */ jsx5("span", { children: name })
                  ] }),
                  editor.isActive("highlight", { color }) && /* @__PURE__ */ jsx5(Check, { className: "h-4 w-4" })
                ]
              },
              name
            ))
          ] })
        ]
      }
    )
  ] });
};

// src/richtext/components/selectors/link-selector.tsx
import { Check as Check2, Trash } from "lucide-react";
import { useEditor as useEditor2 } from "novel";
import { useEffect, useRef } from "react";
import { jsx as jsx6, jsxs as jsxs2 } from "react/jsx-runtime";
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
function getUrlFromString(str) {
  if (isValidUrl(str))
    return str;
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString();
    }
  } catch {
    return null;
  }
}
var LinkSelector = ({ open, onOpenChange }) => {
  const inputRef = useRef(null);
  const { editor } = useEditor2();
  useEffect(() => {
    inputRef.current?.focus();
  });
  if (!editor)
    return null;
  return /* @__PURE__ */ jsxs2(Popover, { modal: true, open, onOpenChange, children: [
    /* @__PURE__ */ jsx6(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs2(Button, { size: "sm", variant: "ghost", className: "gap-2 rounded-none border-none", children: [
      /* @__PURE__ */ jsx6("p", { className: "text-base", children: "\u2197" }),
      /* @__PURE__ */ jsx6(
        "p",
        {
          className: cn("underline decoration-stone-400 underline-offset-4", {
            "text-blue-500": editor.isActive("link")
          }),
          children: "Link"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx6(PopoverContent, { align: "start", className: "w-60 p-0", sideOffset: 10, children: /* @__PURE__ */ jsxs2(
      "form",
      {
        onSubmit: (e) => {
          const target = e.currentTarget;
          e.preventDefault();
          const input = target[0];
          const url = getUrlFromString(input.value);
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
            onOpenChange(false);
          }
        },
        className: "flex  p-1 ",
        children: [
          /* @__PURE__ */ jsx6(
            "input",
            {
              ref: inputRef,
              type: "text",
              placeholder: "Paste a link",
              className: "flex-1 bg-background p-1 text-sm outline-none",
              defaultValue: editor.getAttributes("link").href || ""
            }
          ),
          editor.getAttributes("link").href ? /* @__PURE__ */ jsx6(
            Button,
            {
              size: "icon",
              variant: "outline",
              type: "button",
              className: "flex h-8 items-center rounded-sm p-1 text-red-600 transition-all hover:bg-red-100 dark:hover:bg-red-800",
              onClick: () => {
                editor.chain().focus().unsetLink().run();
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
                onOpenChange(false);
              },
              children: /* @__PURE__ */ jsx6(Trash, { className: "h-4 w-4" })
            }
          ) : /* @__PURE__ */ jsx6(Button, { size: "icon", className: "h-8", children: /* @__PURE__ */ jsx6(Check2, { className: "h-4 w-4" }) })
        ]
      }
    ) })
  ] });
};

// src/richtext/components/selectors/node-selector.tsx
import {
  Check as Check3,
  CheckSquare as CheckSquare2,
  ChevronDown as ChevronDown2,
  Heading1 as Heading12,
  Heading2 as Heading22,
  Heading3 as Heading32,
  ListOrdered as ListOrdered2,
  TextIcon,
  TextQuote as TextQuote2
} from "lucide-react";
import { EditorBubbleItem as EditorBubbleItem2, useEditor as useEditor3 } from "novel";
import { jsx as jsx7, jsxs as jsxs3 } from "react/jsx-runtime";
var items = [
  {
    name: "Text",
    icon: TextIcon,
    command: (editor) => editor.chain().focus().clearNodes().run(),
    isActive: (editor) => editor.isActive("paragraph") && !editor.isActive("bulletList") && !editor.isActive("orderedList")
  },
  {
    name: "Heading 1",
    icon: Heading12,
    command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 1 })
  },
  {
    name: "Heading 2",
    icon: Heading22,
    command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 2 })
  },
  {
    name: "Heading 3",
    icon: Heading32,
    command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 3 })
  },
  {
    name: "To-do List",
    icon: CheckSquare2,
    command: (editor) => editor.chain().focus().clearNodes().toggleTaskList().run(),
    isActive: (editor) => editor.isActive("taskItem")
  },
  {
    name: "Bullet List",
    icon: ListOrdered2,
    command: (editor) => editor.chain().focus().clearNodes().toggleBulletList().run(),
    isActive: (editor) => editor.isActive("bulletList")
  },
  {
    name: "Numbered List",
    icon: ListOrdered2,
    command: (editor) => editor.chain().focus().clearNodes().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive("orderedList")
  },
  {
    name: "Quote",
    icon: TextQuote2,
    command: (editor) => editor.chain().focus().clearNodes().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive("blockquote")
  }
];
var NodeSelector = ({ open, onOpenChange }) => {
  const { editor } = useEditor3();
  if (!editor)
    return null;
  const activeItem = items.filter((item) => item.isActive(editor)).pop() ?? {
    name: "Multiple"
  };
  return /* @__PURE__ */ jsxs3(Popover, { modal: true, open, onOpenChange, children: [
    /* @__PURE__ */ jsx7(PopoverTrigger, { asChild: true, className: "gap-2 rounded-none border-none hover:bg-accent focus:ring-0", children: /* @__PURE__ */ jsxs3(Button, { size: "sm", variant: "ghost", className: "gap-2", children: [
      /* @__PURE__ */ jsx7("span", { className: "whitespace-nowrap text-sm", children: activeItem.name }),
      /* @__PURE__ */ jsx7(ChevronDown2, { className: "h-4 w-4" })
    ] }) }),
    /* @__PURE__ */ jsx7(PopoverContent, { sideOffset: 5, align: "start", className: "w-48 p-1", children: items.map((item) => /* @__PURE__ */ jsxs3(
      EditorBubbleItem2,
      {
        onSelect: (editor2) => {
          item.command(editor2);
          onOpenChange(false);
        },
        className: "flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-accent",
        children: [
          /* @__PURE__ */ jsxs3("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx7("div", { className: "rounded-sm border p-1", children: /* @__PURE__ */ jsx7(item.icon, { className: "h-3 w-3" }) }),
            /* @__PURE__ */ jsx7("span", { children: item.name })
          ] }),
          activeItem.name === item.name && /* @__PURE__ */ jsx7(Check3, { className: "h-4 w-4" })
        ]
      },
      item.name
    )) })
  ] });
};

// src/richtext/components/selectors/text-buttons.tsx
import { BoldIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from "lucide-react";
import { EditorBubbleItem as EditorBubbleItem3, useEditor as useEditor4 } from "novel";
import { jsx as jsx8 } from "react/jsx-runtime";
var TextButtons = () => {
  const { editor } = useEditor4();
  if (!editor)
    return null;
  const items2 = [
    {
      name: "bold",
      isActive: (editor2) => editor2.isActive("bold"),
      command: (editor2) => editor2.chain().focus().toggleBold().run(),
      icon: BoldIcon
    },
    {
      name: "italic",
      isActive: (editor2) => editor2.isActive("italic"),
      command: (editor2) => editor2.chain().focus().toggleItalic().run(),
      icon: ItalicIcon
    },
    {
      name: "underline",
      isActive: (editor2) => editor2.isActive("underline"),
      command: (editor2) => editor2.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon
    },
    {
      name: "strike",
      isActive: (editor2) => editor2.isActive("strike"),
      command: (editor2) => editor2.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon
    }
  ];
  return /* @__PURE__ */ jsx8("div", { className: "flex", children: items2.map((item) => /* @__PURE__ */ jsx8(
    EditorBubbleItem3,
    {
      onSelect: (editor2) => {
        item.command(editor2);
      },
      children: /* @__PURE__ */ jsx8(Button, { size: "sm", className: "rounded-none", variant: "ghost", type: "button", children: /* @__PURE__ */ jsx8(
        item.icon,
        {
          className: cn("h-4 w-4", {
            "text-blue-500": item.isActive(editor)
          })
        }
      ) })
    },
    item.name
  )) });
};

// src/richtext/components/ui/separator.tsx
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { jsx as jsx9 } from "react/jsx-runtime";
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx9(
    SeparatorPrimitive.Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}

// src/richtext/components/editor.tsx
import { jsx as jsx10, jsxs as jsxs4 } from "react/jsx-runtime";
var isEditorEmpty = (content) => {
  if (!content.content || content.content.length === 0)
    return true;
  return content.content.every((node) => {
    if (node.type === "paragraph") {
      return !node.content || node.content.length === 0 || node.content.every(
        (textNode) => textNode.type === "text" && (!textNode.text || textNode.text.trim() === "")
      );
    }
    return false;
  });
};
var RichTextEditor = ({ value, onChange, className }) => {
  const parsedInitial = (() => {
    if (!value || value.trim() === "")
      return defaultEditorContent;
    try {
      return JSON.parse(value);
    } catch {
      return defaultEditorContent;
    }
  })();
  const [initialContent] = useState(parsedInitial);
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const { onUpload: convexUpload } = useConvexImageUpload();
  const convexUploadFn = createConvexImageUpload(convexUpload);
  const slashCommand2 = createCustomSlashCommand(convexUploadFn);
  const suggestionItems2 = createCustomSuggestionItems(convexUploadFn);
  const extensions = [...defaultExtensions, slashCommand2];
  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    const json = editor.getJSON();
    try {
      const isEmpty = isEditorEmpty(json);
      onChange?.(isEmpty ? "" : JSON.stringify(json));
    } catch {
    }
  }, 500);
  if (!initialContent)
    return null;
  return /* @__PURE__ */ jsxs4("div", { className: "w-full " + (className || ""), children: [
    /* @__PURE__ */ jsxs4("p", { className: "text-sm text-muted-foreground mb-2", children: [
      "Press ",
      /* @__PURE__ */ jsx10("kbd", { children: "/" }),
      " to open the palette. You can also paste or drop images directly into the editor."
    ] }),
    /* @__PURE__ */ jsx10(EditorRoot, { children: /* @__PURE__ */ jsxs4(
      EditorContent,
      {
        initialContent,
        extensions,
        className: "w-full",
        editorProps: {
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event)
          },
          handlePaste: (view, event) => handleImagePaste(view, event, convexUploadFn),
          handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, convexUploadFn),
          attributes: {
            class: "prose prose-lg p-6 dark:prose-invert max-w-full rounded-md border border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 bg-transparent shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
          }
        },
        onUpdate: ({ editor }) => {
          debouncedUpdates(editor);
        },
        children: [
          /* @__PURE__ */ jsxs4(EditorCommand, { className: "z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all", children: [
            /* @__PURE__ */ jsx10(EditorCommandEmpty, { className: "px-2 text-muted-foreground", children: "No results" }),
            /* @__PURE__ */ jsx10(EditorCommandList, { children: suggestionItems2.map((item) => /* @__PURE__ */ jsxs4(
              EditorCommandItem,
              {
                value: item.title,
                onCommand: (val) => item?.command?.(val),
                className: "flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent",
                children: [
                  /* @__PURE__ */ jsx10("div", { className: "flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background", children: item.icon }),
                  /* @__PURE__ */ jsxs4("div", { children: [
                    /* @__PURE__ */ jsx10("p", { className: "font-medium", children: item.title }),
                    /* @__PURE__ */ jsx10("p", { className: "text-xs text-muted-foreground", children: item.description })
                  ] })
                ]
              },
              item.title
            )) })
          ] }),
          /* @__PURE__ */ jsxs4(
            EditorBubble,
            {
              className: "flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl",
              children: [
                /* @__PURE__ */ jsx10(Separator, { orientation: "vertical" }),
                /* @__PURE__ */ jsx10(NodeSelector, { open: openNode, onOpenChange: setOpenNode }),
                /* @__PURE__ */ jsx10(Separator, { orientation: "vertical" }),
                /* @__PURE__ */ jsx10(LinkSelector, { open: openLink, onOpenChange: setOpenLink }),
                /* @__PURE__ */ jsx10(Separator, { orientation: "vertical" }),
                /* @__PURE__ */ jsx10(TextButtons, {}),
                /* @__PURE__ */ jsx10(Separator, { orientation: "vertical" }),
                /* @__PURE__ */ jsx10(ColorSelector, { open: openColor, onOpenChange: setOpenColor })
              ]
            }
          )
        ]
      }
    ) })
  ] });
};

// src/richtext/components/viewer.tsx
import {
  EditorContent as EditorContent2,
  EditorRoot as EditorRoot2
} from "novel";
import { useState as useState2 } from "react";
import { jsx as jsx11 } from "react/jsx-runtime";
var RichTextViewer = ({ value, className }) => {
  const parsedInitial = (() => {
    if (!value || value.trim() === "")
      return defaultEditorContent;
    try {
      return JSON.parse(value);
    } catch {
      return defaultEditorContent;
    }
  })();
  const [initialContent] = useState2(parsedInitial);
  const extensions = [...defaultExtensions];
  if (!initialContent)
    return null;
  return /* @__PURE__ */ jsx11("div", { className: "w-full " + (className || ""), children: /* @__PURE__ */ jsx11(EditorRoot2, { children: /* @__PURE__ */ jsx11(
    EditorContent2,
    {
      initialContent,
      extensions,
      className: "w-full",
      editorProps: {
        editable: () => false,
        attributes: {
          class: "prose prose-lg dark:prose-invert bg-transparent outline-none"
        }
      }
    }
  ) }) });
};
export {
  RichTextEditor,
  RichTextProvider,
  RichTextViewer
};
