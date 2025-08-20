"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  RichTextEditor: () => RichTextEditor,
  RichTextProvider: () => RichTextProvider,
  RichTextViewer: () => RichTextViewer
});
module.exports = __toCommonJS(src_exports);

// src/providers/RichTextProvider.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var RichTextContext = (0, import_react.createContext)(void 0);
var RichTextProvider = ({
  convexSiteUrl,
  children
}) => {
  if (!convexSiteUrl) {
    throw new Error("RichTextProvider requires a convexSiteUrl prop");
  }
  const getImageUrl = (storageId) => `${convexSiteUrl}/getImage?storageId=${storageId}`;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichTextContext.Provider, { value: { convexSiteUrl, getImageUrl }, children });
};
var useRichText = () => {
  const ctx = (0, import_react.useContext)(RichTextContext);
  if (!ctx) {
    throw new Error("useRichText must be used within a RichTextProvider");
  }
  return ctx;
};

// src/richtext/components/editor.tsx
var import_novel8 = require("novel");
var import_react3 = require("react");
var import_use_debounce = require("use-debounce");

// src/richtext/extensions/defaultExtensions.ts
var import_novel = require("novel");
var import_class_variance_authority = require("class-variance-authority");
var placeholder = import_novel.Placeholder;
var tiptapLink = import_novel.TiptapLink.configure({
  HTMLAttributes: {
    class: (0, import_class_variance_authority.cx)(
      "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer"
    )
  }
});
var tiptapImage = import_novel.TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      (0, import_novel.UploadImagesPlugin)({
        imageClass: (0, import_class_variance_authority.cx)("opacity-40 rounded-lg border border-stone-200")
      })
    ];
  }
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: (0, import_class_variance_authority.cx)("rounded-lg border border-muted")
  }
});
var updatedImage = import_novel.UpdatedImage.extend({
  name: "updatedImage"
}).configure({
  HTMLAttributes: {
    class: (0, import_class_variance_authority.cx)("rounded-lg border border-muted")
  }
});
var taskList = import_novel.TaskList.configure({
  HTMLAttributes: {
    class: (0, import_class_variance_authority.cx)("not-prose pl-2 ")
  }
});
var taskItem = import_novel.TaskItem.configure({
  HTMLAttributes: {
    class: (0, import_class_variance_authority.cx)("flex gap-2 items-start my-4")
  },
  nested: true
});
var horizontalRule = import_novel.HorizontalRule.configure({
  HTMLAttributes: {
    class: (0, import_class_variance_authority.cx)("mt-4 mb-6 border-t border-muted-foreground")
  }
});
var starterKit = import_novel.StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: (0, import_class_variance_authority.cx)("list-disc list-outside leading-3 -mt-2")
    }
  },
  orderedList: {
    HTMLAttributes: {
      class: (0, import_class_variance_authority.cx)("list-decimal list-outside leading-3 -mt-2")
    }
  },
  listItem: {
    HTMLAttributes: {
      class: (0, import_class_variance_authority.cx)("leading-normal -mb-2")
    }
  },
  blockquote: {
    HTMLAttributes: {
      class: (0, import_class_variance_authority.cx)("border-l-4 border-primary")
    }
  },
  horizontalRule: false,
  dropcursor: {
    color: "#DBEAFE",
    width: 4
  },
  gapcursor: false
});
var youtube = import_novel.Youtube.configure({
  HTMLAttributes: {
    class: (0, import_class_variance_authority.cx)("rounded-lg border border-muted")
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
  import_novel.TiptapUnderline,
  import_novel.HighlightExtension,
  import_novel.TextStyle,
  import_novel.Color,
  import_novel.GlobalDragHandle
];

// src/richtext/extensions/image-upload.ts
var import_convex_file_upload = require("convex-file-upload");
var import_novel2 = require("novel");
var import_sonner = require("sonner");
var useConvexImageUpload = () => {
  const { uploadFile } = (0, import_convex_file_upload.useFileUpload)({
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
  return (0, import_novel2.createImageUpload)({
    onUpload: uploadFn,
    validateFn: (file) => {
      if (!file.type.includes("image/")) {
        import_sonner.toast.error("File type not supported.");
        return false;
      }
      if (file.size / 1024 / 1024 > 20) {
        import_sonner.toast.error("File size too big (max 20MB).");
        return false;
      }
      return true;
    }
  });
};

// src/richtext/extensions/slash-command.tsx
var import_lucide_react = require("lucide-react");
var import_novel3 = require("novel");
var import_jsx_runtime2 = require("react/jsx-runtime");
var createCustomSuggestionItems = (uploadFunction) => (0, import_novel3.createSuggestionItems)([
  {
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_lucide_react.Text, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
    }
  },
  {
    title: "To-do List",
    description: "Track tasks with a to-do list.",
    searchTerms: ["todo", "task", "list", "check", "checkbox"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_lucide_react.CheckSquare, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    }
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    searchTerms: ["title", "big", "large"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_lucide_react.Heading1, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
    }
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_lucide_react.Heading2, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    }
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_lucide_react.Heading3, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    }
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["unordered", "point"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_lucide_react.List, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    }
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering.",
    searchTerms: ["ordered"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_lucide_react.ListOrdered, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    }
  },
  {
    title: "Quote",
    description: "Capture a quote.",
    searchTerms: ["blockquote"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_lucide_react.TextQuote, { size: 18 }),
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").toggleBlockquote().run()
  },
  {
    title: "Image",
    description: "Upload an image from your computer.",
    searchTerms: ["photo", "picture", "media"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_lucide_react.ImageIcon, { size: 18 }),
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
    icon: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_lucide_react.Youtube, { size: 18 }),
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
  return import_novel3.Command.configure({
    suggestion: {
      items: () => suggestionItems2,
      render: import_novel3.renderItems
    }
  });
};
var suggestionItems = (0, import_novel3.createSuggestionItems)([
  // Add basic items without image upload for backward compatibility
  {
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_lucide_react.Text, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
    }
  }
]);
var slashCommand = import_novel3.Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: import_novel3.renderItems
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
var import_lucide_react2 = require("lucide-react");
var import_novel4 = require("novel");

// src/richtext/components/ui/button.tsx
var import_react_slot = require("@radix-ui/react-slot");
var import_class_variance_authority2 = require("class-variance-authority");

// src/richtext/lib/utils.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/richtext/components/ui/button.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var buttonVariants = (0, import_class_variance_authority2.cva)(
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
  const Comp = asChild ? import_react_slot.Slot : "button";
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

// src/richtext/components/ui/popover.tsx
var PopoverPrimitive = __toESM(require("@radix-ui/react-popover"), 1);
var import_jsx_runtime4 = require("react/jsx-runtime");
function Popover({
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PopoverPrimitive.Root, { "data-slot": "popover", ...props });
}
function PopoverTrigger({
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PopoverPrimitive.Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PopoverPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
var import_jsx_runtime5 = require("react/jsx-runtime");
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
  const { editor } = (0, import_novel4.useEditor)();
  if (!editor)
    return null;
  const activeColorItem = TEXT_COLORS.find(({ color }) => editor.isActive("textStyle", { color }));
  const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) => editor.isActive("highlight", { color }));
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(Popover, { modal: true, open, onOpenChange, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(Button, { size: "sm", className: "gap-2 rounded-none", variant: "ghost", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react2.ChevronDown, { className: "h-4 w-4" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      PopoverContent,
      {
        sideOffset: 5,
        className: "my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl ",
        align: "start",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "my-1 px-2 text-sm font-semibold text-muted-foreground", children: "Color" }),
            TEXT_COLORS.map(({ name, color }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              import_novel4.EditorBubbleItem,
              {
                onSelect: () => {
                  editor.commands.unsetColor();
                  if (name !== "Default") {
                    editor.chain().focus().setColor(color).run();
                  }
                  onOpenChange(false);
                },
                className: "flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent",
                children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "rounded-sm border px-2 py-px font-medium", style: { color }, children: "A" }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: name })
                ] })
              },
              name
            ))
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "my-1 px-2 text-sm font-semibold text-muted-foreground", children: "Background" }),
            HIGHLIGHT_COLORS.map(({ name, color }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
              import_novel4.EditorBubbleItem,
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
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "rounded-sm border px-2 py-px font-medium", style: { backgroundColor: color }, children: "A" }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: name })
                  ] }),
                  editor.isActive("highlight", { color }) && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react2.Check, { className: "h-4 w-4" })
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
var import_lucide_react3 = require("lucide-react");
var import_novel5 = require("novel");
var import_react2 = require("react");
var import_jsx_runtime6 = require("react/jsx-runtime");
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
  const inputRef = (0, import_react2.useRef)(null);
  const { editor } = (0, import_novel5.useEditor)();
  (0, import_react2.useEffect)(() => {
    inputRef.current?.focus();
  });
  if (!editor)
    return null;
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Popover, { modal: true, open, onOpenChange, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Button, { size: "sm", variant: "ghost", className: "gap-2 rounded-none border-none", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "text-base", children: "\u2197" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "p",
        {
          className: cn("underline decoration-stone-400 underline-offset-4", {
            "text-blue-500": editor.isActive("link")
          }),
          children: "Link"
        }
      )
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(PopoverContent, { align: "start", className: "w-60 p-0", sideOffset: 10, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
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
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "input",
            {
              ref: inputRef,
              type: "text",
              placeholder: "Paste a link",
              className: "flex-1 bg-background p-1 text-sm outline-none",
              defaultValue: editor.getAttributes("link").href || ""
            }
          ),
          editor.getAttributes("link").href ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
              children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react3.Trash, { className: "h-4 w-4" })
            }
          ) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Button, { size: "icon", className: "h-8", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react3.Check, { className: "h-4 w-4" }) })
        ]
      }
    ) })
  ] });
};

// src/richtext/components/selectors/node-selector.tsx
var import_lucide_react4 = require("lucide-react");
var import_novel6 = require("novel");
var import_jsx_runtime7 = require("react/jsx-runtime");
var items = [
  {
    name: "Text",
    icon: import_lucide_react4.TextIcon,
    command: (editor) => editor.chain().focus().clearNodes().run(),
    isActive: (editor) => editor.isActive("paragraph") && !editor.isActive("bulletList") && !editor.isActive("orderedList")
  },
  {
    name: "Heading 1",
    icon: import_lucide_react4.Heading1,
    command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 1 })
  },
  {
    name: "Heading 2",
    icon: import_lucide_react4.Heading2,
    command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 2 })
  },
  {
    name: "Heading 3",
    icon: import_lucide_react4.Heading3,
    command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 3 })
  },
  {
    name: "To-do List",
    icon: import_lucide_react4.CheckSquare,
    command: (editor) => editor.chain().focus().clearNodes().toggleTaskList().run(),
    isActive: (editor) => editor.isActive("taskItem")
  },
  {
    name: "Bullet List",
    icon: import_lucide_react4.ListOrdered,
    command: (editor) => editor.chain().focus().clearNodes().toggleBulletList().run(),
    isActive: (editor) => editor.isActive("bulletList")
  },
  {
    name: "Numbered List",
    icon: import_lucide_react4.ListOrdered,
    command: (editor) => editor.chain().focus().clearNodes().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive("orderedList")
  },
  {
    name: "Quote",
    icon: import_lucide_react4.TextQuote,
    command: (editor) => editor.chain().focus().clearNodes().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive("blockquote")
  }
];
var NodeSelector = ({ open, onOpenChange }) => {
  const { editor } = (0, import_novel6.useEditor)();
  if (!editor)
    return null;
  const activeItem = items.filter((item) => item.isActive(editor)).pop() ?? {
    name: "Multiple"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Popover, { modal: true, open, onOpenChange, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(PopoverTrigger, { asChild: true, className: "gap-2 rounded-none border-none hover:bg-accent focus:ring-0", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Button, { size: "sm", variant: "ghost", className: "gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "whitespace-nowrap text-sm", children: activeItem.name }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react4.ChevronDown, { className: "h-4 w-4" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(PopoverContent, { sideOffset: 5, align: "start", className: "w-48 p-1", children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      import_novel6.EditorBubbleItem,
      {
        onSelect: (editor2) => {
          item.command(editor2);
          onOpenChange(false);
        },
        className: "flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-accent",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "rounded-sm border p-1", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(item.icon, { className: "h-3 w-3" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: item.name })
          ] }),
          activeItem.name === item.name && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react4.Check, { className: "h-4 w-4" })
        ]
      },
      item.name
    )) })
  ] });
};

// src/richtext/components/selectors/text-buttons.tsx
var import_lucide_react5 = require("lucide-react");
var import_novel7 = require("novel");
var import_jsx_runtime8 = require("react/jsx-runtime");
var TextButtons = () => {
  const { editor } = (0, import_novel7.useEditor)();
  if (!editor)
    return null;
  const items2 = [
    {
      name: "bold",
      isActive: (editor2) => editor2.isActive("bold"),
      command: (editor2) => editor2.chain().focus().toggleBold().run(),
      icon: import_lucide_react5.BoldIcon
    },
    {
      name: "italic",
      isActive: (editor2) => editor2.isActive("italic"),
      command: (editor2) => editor2.chain().focus().toggleItalic().run(),
      icon: import_lucide_react5.ItalicIcon
    },
    {
      name: "underline",
      isActive: (editor2) => editor2.isActive("underline"),
      command: (editor2) => editor2.chain().focus().toggleUnderline().run(),
      icon: import_lucide_react5.UnderlineIcon
    },
    {
      name: "strike",
      isActive: (editor2) => editor2.isActive("strike"),
      command: (editor2) => editor2.chain().focus().toggleStrike().run(),
      icon: import_lucide_react5.StrikethroughIcon
    }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "flex", children: items2.map((item) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    import_novel7.EditorBubbleItem,
    {
      onSelect: (editor2) => {
        item.command(editor2);
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Button, { size: "sm", className: "rounded-none", variant: "ghost", type: "button", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
var SeparatorPrimitive = __toESM(require("@radix-ui/react-separator"), 1);
var import_jsx_runtime9 = require("react/jsx-runtime");
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
var import_jsx_runtime10 = require("react/jsx-runtime");
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
  const [initialContent] = (0, import_react3.useState)(parsedInitial);
  const [openNode, setOpenNode] = (0, import_react3.useState)(false);
  const [openColor, setOpenColor] = (0, import_react3.useState)(false);
  const [openLink, setOpenLink] = (0, import_react3.useState)(false);
  const { onUpload: convexUpload } = useConvexImageUpload();
  const convexUploadFn = createConvexImageUpload(convexUpload);
  const slashCommand2 = createCustomSlashCommand(convexUploadFn);
  const suggestionItems2 = createCustomSuggestionItems(convexUploadFn);
  const extensions = [...defaultExtensions, slashCommand2];
  const debouncedUpdates = (0, import_use_debounce.useDebouncedCallback)(async (editor) => {
    const json = editor.getJSON();
    try {
      const isEmpty = isEditorEmpty(json);
      onChange?.(isEmpty ? "" : JSON.stringify(json));
    } catch {
    }
  }, 500);
  if (!initialContent)
    return null;
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "w-full ", children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("p", { className: "text-sm text-muted-foreground mb-2", children: [
      "Press ",
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("kbd", { children: "/" }),
      " to open the palette. You can also paste or drop images directly into the editor."
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_novel8.EditorRoot, { children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
      import_novel8.EditorContent,
      {
        initialContent,
        extensions,
        className: "w-full",
        editorProps: {
          handleDOMEvents: {
            keydown: (_view, event) => (0, import_novel8.handleCommandNavigation)(event)
          },
          handlePaste: (view, event) => (0, import_novel8.handleImagePaste)(view, event, convexUploadFn),
          handleDrop: (view, event, _slice, moved) => (0, import_novel8.handleImageDrop)(view, event, moved, convexUploadFn),
          attributes: {
            class: cn("p-6 max-w-full rounded-md border border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 bg-transparent shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]", className)
          }
        },
        onUpdate: ({ editor }) => {
          debouncedUpdates(editor);
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_novel8.EditorCommand, { className: "z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all", children: [
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_novel8.EditorCommandEmpty, { className: "px-2 text-muted-foreground", children: "No results" }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_novel8.EditorCommandList, { children: suggestionItems2.map((item) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
              import_novel8.EditorCommandItem,
              {
                value: item.title,
                onCommand: (val) => item?.command?.(val),
                className: "flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background", children: item.icon }),
                  /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "font-medium", children: item.title }),
                    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "text-xs text-muted-foreground", children: item.description })
                  ] })
                ]
              },
              item.title
            )) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
            import_novel8.EditorBubble,
            {
              className: "flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Separator, { orientation: "vertical" }),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(NodeSelector, { open: openNode, onOpenChange: setOpenNode }),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Separator, { orientation: "vertical" }),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(LinkSelector, { open: openLink, onOpenChange: setOpenLink }),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Separator, { orientation: "vertical" }),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(TextButtons, {}),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Separator, { orientation: "vertical" }),
                /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(ColorSelector, { open: openColor, onOpenChange: setOpenColor })
              ]
            }
          )
        ]
      }
    ) })
  ] });
};

// src/richtext/components/viewer.tsx
var import_novel9 = require("novel");
var import_react4 = require("react");
var import_jsx_runtime11 = require("react/jsx-runtime");
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
  const [initialContent] = (0, import_react4.useState)(parsedInitial);
  const extensions = [...defaultExtensions];
  if (!initialContent)
    return null;
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "w-full", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_novel9.EditorRoot, { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    import_novel9.EditorContent,
    {
      initialContent,
      extensions,
      className: "w-full",
      editorProps: {
        editable: () => false,
        attributes: {
          class: cn("bg-transparent outline-none", className)
        }
      }
    }
  ) }) });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RichTextEditor,
  RichTextProvider,
  RichTextViewer
});
