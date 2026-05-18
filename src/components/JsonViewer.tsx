import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronRight, ChevronDown, Clock, Link } from 'lucide-react';

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

interface JsonViewerProps {
  data: JsonValue | unknown;
}

export function JsonViewer({ data }: JsonViewerProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-y-auto max-h-[80vh] custom-scrollbar text-left font-mono text-sm">
      <JsonNode data={data as JsonValue} label="VirtualMe" isRoot={true} />
    </div>
  );
}

interface JsonNodeProps {
  data: unknown;
  label?: string;
  isRoot?: boolean;
}

function JsonNode({ data, label, isRoot = false }: JsonNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (data === null || data === undefined) {
    return <span className="text-gray-500">null</span>;
  }

  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Helper to render value with smart actions
  const renderValue = (key: string, value: unknown) => {
    if (typeof value === 'string') {
      const lowerKey = key.toLowerCase();
      const isLocation = lowerKey.includes('location') || lowerKey.includes('place') || lowerKey.includes('city') || lowerKey.includes('country');
      const isDate = lowerKey.includes('date') || lowerKey.includes('time') || lowerKey.includes('created') || lowerKey.includes('updated') || !isNaN(Date.parse(value));
      const isUrl = value.startsWith('http://') || value.startsWith('https://');

      let renderedNode = <span className="text-green-400">"{value}"</span>;

      if (isLocation) {
        const query = encodeURIComponent(value);
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
        renderedNode = (
          <span className="flex items-center gap-2 inline-flex">
            <span className="text-green-400">"{value}"</span>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-500/10 p-1 rounded-md border border-cyan-500/20 flex items-center gap-1" title={`View map for ${value}`}>
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs uppercase tracking-wider font-bold">Map</span>
            </a>
          </span>
        );
      } else if (isDate) {
        const date = new Date(value);
        if (!isNaN(date.getTime()) && value.length > 8 && !/^\d+$/.test(value)) {
          const formattedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date).replace(', 12:00 AM', '');
          renderedNode = (
            <span className="flex items-center gap-2 inline-flex">
              <span className="text-green-400">"{value}"</span>
              <span className="text-blue-400 bg-blue-500/10 p-1 px-2 rounded-md border border-blue-500/20 flex items-center gap-1.5 cursor-default">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-sans tracking-wide">{formattedDate}</span>
              </span>
            </span>
          );
        }
      } else if (isUrl) {
         renderedNode = (
          <span className="flex items-center gap-2 inline-flex">
            <span className="text-green-400">"{value}"</span>
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 p-1 rounded-md border border-blue-500/20 flex items-center gap-1" title={`Open ${value}`}>
              <Link className="w-3.5 h-3.5" />
              <span className="text-xs uppercase tracking-wider font-bold">Open</span>
            </a>
          </span>
        );
      }
      return renderedNode;
    }

    if (typeof value === 'number') {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('price') || lowerKey.includes('cost') || lowerKey.includes('amount') || lowerKey.includes('salary') || lowerKey.includes('revenue') || lowerKey.includes('capex')) {
        return (
           <span className="flex items-center gap-2 inline-flex">
             <span className="text-orange-400">{value}</span>
             <span className="text-emerald-400 bg-emerald-500/10 p-1 px-2 rounded-md border border-emerald-500/20 text-xs font-sans tracking-wide cursor-default">
               {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value).replace('$', '≈$')}
             </span>
           </span>
        );
      }
      return <span className="text-orange-400">{value}</span>;
    }
    if (typeof value === 'boolean') {
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold font-sans uppercase tracking-wider ${value ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {value ? 'true' : 'false'}
        </span>
      );
    }
    return <span>{String(value)}</span>;
  };

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-gray-400">[]</span>;
    return (
      <div className="ml-4">
        <div className="flex items-center cursor-pointer hover:bg-white/5 rounded px-1 -ml-1 transition-colors" onClick={toggleExpand}>
          {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
          {label && <span className="text-cyan-300 mr-2">"{label}":</span>}
          <span className="text-gray-400">[</span>
          {!isExpanded && <span className="text-gray-500 mx-2">... {data.length} items</span>}
          {!isExpanded && <span className="text-gray-400">]</span>}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="ml-4 border-l border-white/10 pl-2 py-1"
            >
              {data.map((item, index) => (
                <div key={index} className="flex">
                  <JsonNode data={item} />
                  {index < data.length - 1 && <span className="text-gray-400">,</span>}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        {isExpanded && <div className="text-gray-400">]</div>}
      </div>
    );
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, JsonValue>);
    if (entries.length === 0) return <span className="text-gray-400">{}</span>;

    return (
      <div className={isRoot ? "" : "ml-4"}>
        <div className="flex items-center cursor-pointer hover:bg-white/5 rounded px-1 -ml-1 transition-colors" onClick={toggleExpand}>
          {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
          {label && <span className="text-cyan-300 mr-2">"{label}":</span>}
          <span className="text-gray-400">{'{'}</span>
          {!isExpanded && <span className="text-gray-500 mx-2">... {entries.length} keys</span>}
          {!isExpanded && <span className="text-gray-400">{'}'}</span>}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="ml-4 border-l border-white/10 pl-2 py-1"
            >
              {entries.map(([key, value], index) => {
                const isObjectOrArray = value !== null && typeof value === 'object';

                return (
                  <div key={key} className={isObjectOrArray ? "mt-1" : "flex mt-1"}>
                    {isObjectOrArray ? (
                      <JsonNode data={value} label={key} />
                    ) : (
                      <>
                        <span className="text-cyan-300 mr-2 whitespace-nowrap">"{key}":</span>
                        <span className="break-all">{renderValue(key, value)}</span>
                      </>
                    )}
                    {index < entries.length - 1 && <span className="text-gray-400">,</span>}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        {isExpanded && <div className="text-gray-400">{'}'}</div>}
      </div>
    );
  }

  return renderValue('', data);
}
