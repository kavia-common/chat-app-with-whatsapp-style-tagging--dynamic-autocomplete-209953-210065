"use client";

import { Tag } from "@/types";

/**
PUBLIC_INTERFACE
TagChip
Renders a tag chip. If onRemove is provided, shows a remove button.
*/
export default function TagChip({
  tag,
  symbol = "@",
  onRemove,
}: {
  tag: Tag;
  symbol?: "@" | "#";
  onRemove?: () => void;
}) {
  return (
    <span className="tag-chip" aria-label={`${symbol}${tag.label}`}>
      {symbol}
      {tag.label}
      {onRemove && (
        <button
          type="button"
          className="remove"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove tag ${tag.label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
