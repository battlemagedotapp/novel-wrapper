# Novel Wrapper

A React wrapper component for the Novel editor with additional rich text functionality.

## Installation

Install directly from GitHub:

```bash
npm install git+https://github.com/yourusername/novel-wrapper.git
```

## Usage

### Basic Setup

First, import the CSS styles in your main application file:

```tsx
import "novel-wrapper/styles";
```

### Using the Rich Text Editor

```tsx
import { RichTextProvider, RichTextEditor } from "novel-wrapper";

function MyApp() {
  return (
    <RichTextProvider>
      <RichTextEditor
        initialContent="<p>Hello world!</p>"
        onChange={(content) => console.log(content)}
      />
    </RichTextProvider>
  );
}
```

### Using the Rich Text Viewer

```tsx
import { RichTextViewer } from "novel-wrapper";

function MyViewer() {
  return <RichTextViewer content="<p>Hello world!</p>" />;
}
```

## Components

### RichTextProvider

Context provider that wraps your application to provide rich text functionality.

### RichTextEditor

A full-featured rich text editor component based on Novel.

**Props:**

- `initialContent?: string` - Initial HTML content
- `onChange?: (content: string) => void` - Callback when content changes

### RichTextViewer

A read-only component for displaying rich text content.

**Props:**

- `content: string` - HTML content to display

## Peer Dependencies

This package requires the following peer dependencies:

- `react` ^19.1.0
- `react-dom` ^19.1.0
- `novel` ^1.0.2
- `lucide-react` ^0.536.0
- `clsx` ^2.1.1
- `tailwind-merge` ^3.3.1
- `@radix-ui/react-popover` ^1.1.14
- `@radix-ui/react-separator` ^1.1.7
- `@radix-ui/react-slot` ^1.2.3
- `sonner` ^2.0.7
- `use-debounce` ^10.0.5
- `class-variance-authority` ^0.7.1
- `@tailwindcss/typography` ^0.5.16

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build
```

## License

MIT
