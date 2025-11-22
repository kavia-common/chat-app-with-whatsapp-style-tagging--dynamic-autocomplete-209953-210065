"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Tag, TagTrigger } from "@/types";

/**
PUBLIC_INTERFACE
TagSuggestionList
Floating suggestions near caret with keyboard navigation and ARIA roles.
*/
export default function TagSuggestionList({
  trigger,
  suggestions,
  anchorPos,
  onPick,
  onClose,
}: {
  trigger: TagTrigger;
  suggestions: Tag[];
  anchorPos: { x: number; y: number };
  onPick: (tag: Tag) => void;
  onClose: () => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const listId = useMemo(() => `tag-list-${Math.random().toString(36).slice(2)}`, []);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveIdx(0);
  }, [suggestions]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!suggestions.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => (i + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => (i - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        onPick(suggestions[activeIdx]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [suggestions, activeIdx, onPick, onClose]);

  return (
    <div
      ref={containerRef}
      className="tag-suggestions"
      style={{ left: anchorPos.x, top: anchorPos.y }}
      role="listbox"
      id={listId}
      aria-activedescendant={`${listId}-opt-${activeIdx}`}
    >
      {suggestions.length === 0 ? (
        <div className="text-sm text-gray-500 px-2 py-1">No suggestions</div>
      ) : (
        suggestions.map((s, idx) => (
          <div
            key={s.id}
            id={`${listId}-opt-${idx}`}
            role="option"
            aria-selected={idx === activeIdx}
            className={idx === activeIdx ? "active" : undefined}
            onMouseDown={(e) => {
              e.preventDefault();
              onPick(s);
            }}
          >
            <span className="font-medium">
              {trigger}
              {s.label}
            </span>
            <span className="text-xs text-gray-500">· {s.type}</span>
          </div>
        ))
      )}
    </div>
  );
}
