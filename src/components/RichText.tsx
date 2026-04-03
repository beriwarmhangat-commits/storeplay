import React from 'react';

/**
 * A simple utility to render text with professional formatting features:
 * - **bold** or __bold__
 * - *italic* or _italic_
 * - ~~strikethrough~~
 * - [blue text](blue) or [primary text](primary)
 * - `-` list markers (bullet points)
 * - `#` and `##` for title-like formatting
 */
export default function RichText({ text, className }: { text?: string; className?: string }) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {lines.map((line, idx) => {
        // Bullet Point Detection
        if (line.trim().startsWith('- ')) {
           return (
             <div key={idx} style={{ display: 'flex', gap: '0.75rem', paddingLeft: '0.25rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 800 }}>•</span>
                <div style={{ flex: 1 }}>{parseLineParts(line.trim().slice(2))}</div>
             </div>
           );
        }

        // Header Detection
        if (line.trim().startsWith('# ')) {
          return <h3 key={idx} style={{ fontSize: '1.2rem', fontWeight: 800, margin: '1rem 0 0.5rem', color: 'var(--text-main)' }}>{parseLineParts(line.trim().slice(2))}</h3>;
        }
        if (line.trim().startsWith('## ')) {
          return <h4 key={idx} style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0.75rem 0 0.25rem', color: 'var(--text-main)', opacity: 0.9 }}>{parseLineParts(line.trim().slice(3))}</h4>;
        }

        return (
          <div key={idx} style={{ minHeight: line.trim() === '' ? '0.75rem' : 'auto' }}>
            {parseLineParts(line)}
          </div>
        );
      })}
    </div>
  );
}

function parseLineParts(line: string) {
  // Enhanced split pattern to catch multiple types of markers including colors
  // Markers: **bold**, *italic*, ~~strike~~, [text](color)
  const regex = /(\*\*.*?\*\*|__.*?__|(?<!\*)\*.*?\*(?!\*)|(?<!_)_.*?_(?!_)|~~.*?~~|\[.*?\]\(.*?\))/g;
  const parts = line.split(regex);

  return parts.map((part, index) => {
    // Bold: **text** or __text__
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
      return <strong key={index} style={{ fontWeight: 800, color: 'var(--text-main)' }}>{part.slice(2, -2)}</strong>;
    }
    
    // Italic: *text* or _text_
    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      return <em key={index} style={{ fontStyle: 'italic', opacity: 0.9 }}>{part.slice(1, -1)}</em>;
    }

    // Strikethrough: ~~text~~
    if (part.startsWith('~~') && part.endsWith('~~')) {
      return <del key={index} style={{ textDecoration: 'line-through', opacity: 0.5 }}>{part.slice(2, -2)}</del>;
    }

    // Color Links: [text](color)
    const colorMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (colorMatch) {
       const [_, label, color] = colorMatch;
       const colorMap: any = { 
         'blue': '#3b82f6', 
         'primary': 'var(--primary)', 
         'green': '#10b981', 
         'red': '#ef4444', 
         'gold': '#fbbf24' 
       };
       return <span key={index} style={{ color: colorMap[color] || 'var(--primary)', fontWeight: 600 }}>{label}</span>;
    }

    return part;
  });
}
