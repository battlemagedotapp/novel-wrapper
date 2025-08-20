# Novel Wrapper

A React wrapper component for the Novel editor with additional rich text functionality.

## Installation

Install directly from GitHub:

```bash
npm install github:battlemagedotapp/novel-wrapper
# or
npm install git+https://github.com/battlemagedotapp/novel-wrapper.git
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

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build
```
