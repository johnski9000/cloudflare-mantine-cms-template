// Define an interface for the parsed parts
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
export function ReactMarkdownElement({ children }) {
  return <ReactMarkdown rehypePlugins={[rehypeRaw]}>{children}</ReactMarkdown>;
}
export interface ParsedPart {
  type: "text" | "bold";
  content: string;
}

// Function to parse bold Markdown
export function parseMarkdownBold(text: string): ParsedPart[] {
  // Split the string by ** markers using a regex
  const parts = text.split(/\*\*(.*?)\*\*/g);
  const result: ParsedPart[] = [];

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      // Even indices are plain text (outside of **)
      if (parts[i]) {
        result.push({ type: "text", content: parts[i] });
      }
    } else {
      // Odd indices are text inside ** (bold)
      if (parts[i]) {
        result.push({ type: "bold", content: parts[i] });
      }
    }
  }
  return result;
}
