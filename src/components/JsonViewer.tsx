import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronRight, ChevronDown } from 'lucide-react';

interface JsonViewerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export function JsonViewer({ data }: JsonViewerProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-y-auto max-h-[80vh] custom-scrollbar text-left font-mono text-sm">
      <JsonNode data={data} label="VirtualMe" isRoot={true} />
    </div>
  );
}

interface JsonNodeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderValue = (key: string, value: any) => {
    if (typeof value === 'string') {
      const isLocation = key.toLowerCase().includes('location') || key.toLowerCase().includes('place') || key.toLowerCase().includes('city') || key.toLowerCase().includes('country');

      if (isLocation) {
        const query = encodeURIComponent(value);
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
        return (
          <span className="flex items-center gap-2 inline-flex">
            <span className="text-green-400">"{value}"</span>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors" title={`View map for ${value}`}>
              <MapPin className="w-4 h-4" />
            </a>
          </span>
        );
      }
      return <span className="text-green-400">"{value}"</span>;
    }
    if (typeof value === 'number') return <span className="text-orange-400">{value}</span>;
    if (typeof value === 'boolean') return <span className="text-blue-400">{value ? 'true' : 'false'}</span>;
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
    const keys = Object.keys(data);
    if (keys.length === 0) return <span className="text-gray-400">{}</span>;

    return (
      <div className={isRoot ? "" : "ml-4"}>
        <div className="flex items-center cursor-pointer hover:bg-white/5 rounded px-1 -ml-1 transition-colors" onClick={toggleExpand}>
          {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
          {label && <span className="text-cyan-300 mr-2">"{label}":</span>}
          <span className="text-gray-400">{'{'}</span>
          {!isExpanded && <span className="text-gray-500 mx-2">... {keys.length} keys</span>}
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
              {keys.map((key, index) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const value = (data as any)[key];
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
                    {index < keys.length - 1 && <span className="text-gray-400">,</span>}
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
