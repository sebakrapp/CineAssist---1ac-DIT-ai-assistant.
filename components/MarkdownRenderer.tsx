import React from 'react';
import CameraLayout from './CameraLayout';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Regex to split by code blocks (```...```)
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 leading-relaxed text-gray-200 text-sm md:text-base">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          // Remove backticks
          const inner = part.replace(/^```\w*\n?/, '').replace(/```$/, '');
          
          // Check if it's our custom layout block
          if (part.startsWith('```layout') || part.includes('"view":')) {
             // Sometimes parsing can be tricky if the model doesn't strictly follow the tag, 
             // but checking for 'view' key in JSON is a safe fallback
             let layoutData = null;
             try {
                 // Clean potential leading "layout" text if the regex didn't catch the tag perfectly
                 const jsonStr = inner.replace(/^layout\s*/, '').trim();
                 layoutData = JSON.parse(jsonStr);
             } catch(e) {
                 // Fallback to standard code block if JSON parse fails
             }

             if (layoutData && (layoutData.view || layoutData.highlight)) {
                 return <CameraLayout key={index} data={layoutData} />;
             }
          }

          // Standard code block
          return (
            <pre key={index} className="bg-gray-900/50 border border-gray-800 p-3 rounded-lg overflow-x-auto my-3">
              <code className="font-mono text-xs md:text-sm text-cinema-sony">{inner}</code>
            </pre>
          );
        }

        // Regular markdown text processing (headings, lists, bold)
        return <div key={index}>{renderTextLines(part)}</div>;
      })}
    </div>
  );
};

// Helper to render lines within a text block
const renderTextLines = (textBlock: string) => {
    const lines = textBlock.split('\n');
    return lines.map((line, idx) => {
        const key = `line-${idx}`;
        
        // Headings
        if (line.startsWith('### ')) {
            return <h3 key={key} className="text-lg font-semibold text-cinema-arri mt-4 mb-2">{processInlineStyles(line.replace('### ', ''))}</h3>
        }
        if (line.startsWith('## ')) {
            return <h2 key={key} className="text-xl font-bold text-white mt-5 mb-3 pb-1 border-b border-gray-800">{processInlineStyles(line.replace('## ', ''))}</h2>
        }

        // Lists
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            return (
            <div key={key} className="flex items-start ml-2 mb-1">
                <span className="mr-2 text-cinema-accent mt-1.5 text-[10px]">•</span>
                <span>{processInlineStyles(line.replace(/^[\-\*]\s/, ''))}</span>
            </div>
            );
        }
        
        // Numbered List
        if (/^\d+\.\s/.test(line.trim())) {
            return (
                <div key={key} className="flex items-start ml-2 mb-1">
                    <span className="mr-2 text-cinema-arri font-mono font-bold">{line.trim().split('.')[0]}.</span>
                    <span>{processInlineStyles(line.replace(/^\d+\.\s/, ''))}</span>
                </div>
            )
        }

        // Empty line
        if (!line.trim()) {
            return <div key={key} className="h-2"></div>;
        }

        return <p key={key} className="mb-1">{processInlineStyles(line)}</p>;
    });
}

// Helper to process bold (**text**) and code (`text`)
const processInlineStyles = (text: string): React.ReactNode[] => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-gray-800 px-1.5 py-0.5 rounded text-cinema-sony font-mono text-xs border border-gray-700">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

export default MarkdownRenderer;