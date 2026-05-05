import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Check, X } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  isEditing: boolean;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
  placeholder?: string;
}

export function EditableText({
  value,
  onSave,
  isEditing,
  className = '',
  inputClassName = '',
  multiline = false,
  placeholder = 'Click to edit...',
}: EditableTextProps) {
  const [editValue, setEditValue] = useState(value);
  const [isLocalEditing, setIsLocalEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isLocalEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isLocalEditing]);

  const handleSave = () => {
    onSave(editValue);
    setIsLocalEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsLocalEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditing) {
    return <span className={className}>{value || placeholder}</span>;
  }

  if (isLocalEditing) {
    return (
      <motion.div
        className="flex items-center gap-2"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`bg-slate-800/80 border border-cyan-500/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none ${inputClassName}`}
            rows={3}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={`bg-slate-800/80 border border-cyan-500/50 rounded-lg px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${inputClassName}`}
          />
        )}
        <motion.button
          onClick={handleSave}
          className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Check className="w-4 h-4" />
        </motion.button>
        <motion.button
          onClick={handleCancel}
          className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.button
      className={`group flex items-center gap-2 ${className}`}
      onClick={() => setIsLocalEditing(true)}
      whileHover={{ scale: 1.02 }}
    >
      <span>{value || placeholder}</span>
      <Pencil className="w-3.5 h-3.5 text-cyan-400/0 group-hover:text-cyan-400/70 transition-colors" />
    </motion.button>
  );
}
