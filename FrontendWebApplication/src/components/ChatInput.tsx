"use client";

import { useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useTagging } from "@/hooks/useTagging";
import TagSuggestionList from "@/components/TagSuggestionList";
import { createTagChipEl } from "@/utils/tagParser";

/**
PUBLIC_INTERFACE
ChatInput
Contenteditable input supporting @ and # triggers, selection insertion, and send button.
*/
export default function ChatInput({
  onSend,
}: {
  onSend: (editorEl: HTMLElement) => void;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const { visible, suggestions, trigger, anchorPos } = useSelector(
    (s: RootState) => s.tags
  );

  const { insertTagAtCaret } = useTagging(editorRef);

  const handlePick = useCallback(
    (tag: { id: string; label: string; type: "user" | "topic"; color?: string }) => {
      const chip = createTagChipEl({
        id: tag.id,
        label: tag.label,
        symbol: trigger || "@",
        type: tag.type,
        color: tag.color,
      });
      insertTagAtCaret(chip);
    },
    [insertTagAtCaret, trigger]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace") {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        const container = range.startContainer;
        if (container.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
          const prevEl = (container.previousSibling as HTMLElement) || null;
          if (prevEl && prevEl.classList && prevEl.classList.contains("tag-chip")) {
            e.preventDefault();
            prevEl.remove();
            return;
          }
        }
        if (container.nodeType === Node.ELEMENT_NODE) {
          const el = container as HTMLElement;
          const child = el.childNodes[range.startOffset - 1] as HTMLElement | undefined;
          if (child && child.classList && child.classList.contains("tag-chip")) {
            e.preventDefault();
            child.remove();
            return;
          }
        }
      }
    }
  };

  return (
    <div className="w-full">
      <div
        ref={editorRef}
        className="input-editor"
        contentEditable
        role="textbox"
        aria-multiline="true"
        onKeyDown={onKeyDown}
      />
      <div className="mt-2 flex justify-end">
        <button
          className="send-btn"
          onClick={() => {
            if (editorRef.current) onSend(editorRef.current);
          }}
        >
          Send
        </button>
      </div>

      {visible && trigger && anchorPos && (
        <TagSuggestionList
          trigger={trigger}
          suggestions={suggestions}
          anchorPos={anchorPos}
          onPick={handlePick}
          onClose={() => {
            const evt = new KeyboardEvent("keydown", { key: "Escape" });
            document.dispatchEvent(evt);
          }}
        />
      )}
    </div>
  );
}
