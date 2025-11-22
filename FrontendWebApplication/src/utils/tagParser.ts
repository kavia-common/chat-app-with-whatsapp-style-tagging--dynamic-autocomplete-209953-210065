import { Tag } from "@/types";

/**
PUBLIC_INTERFACE
parseSerializedContent
Parses the serialized string with tags in @[label](id) or #[label](id) format,
returning the original text and locations of serialized tag tokens.
*/
export function parseSerializedContent(content: string): {
  text: string;
  tags: { id: string; label: string; start: number; end: number; symbol: "@" | "#" }[];
} {
  const tagRegex = /([@#])\[(.+?)\]\((.+?)\)/g;
  const tags: { id: string; label: string; start: number; end: number; symbol: "@" | "#" }[] = [];
  let match: RegExpExecArray | null;
  while ((match = tagRegex.exec(content))) {
    const symbol = match[1] as "@" | "#";
    const label = match[2];
    const id = match[3];
    const start = match.index;
    const end = match.index + match[0].length;
    tags.push({ id, label, start, end, symbol });
  }
  return { text: content, tags };
}

/**
PUBLIC_INTERFACE
stringifyContentWithTags
Given the DOM content of the editor, produce the serialized text expected by API.
It detects nodes with data-tag-* attributes (chips).
*/
export function stringifyContentWithTags(root: HTMLElement): {
  text: string;
  tags: Tag[];
} {
  let text = "";
  const tags: Tag[] = [];

  const traverse = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      // If this element represents a tag chip, serialize it and skip its children
      if (el.dataset && el.dataset.tagId && el.dataset.tagLabel) {
        const symbol = (el.dataset.tagSymbol as "@" | "#") || "@";
        const label = el.dataset.tagLabel!;
        const id = el.dataset.tagId!;
        const type = (el.dataset.tagType as Tag["type"]) || "user";
        const color = el.dataset.tagColor;
        const createdAt = el.dataset.tagCreatedAt || new Date().toISOString();
        tags.push({ id, label, type, color, createdAt });
        text += `${symbol}[${label}](${id})`;
        return; // skip chip children
      }
      // Otherwise traverse children
      for (let i = 0; i < el.childNodes.length; i++) {
        traverse(el.childNodes[i]);
      }
      return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      text += (node as Text).data;
      return;
    }
  };

  traverse(root);

  // Fallback if empty
  if (!text && root.textContent) {
    text = root.textContent;
  }

  return { text, tags };
}

/**
PUBLIC_INTERFACE
createTagChipEl
Create a span element representing a tag chip to be inserted in contenteditable.
*/
export function createTagChipEl(opts: {
  id: string;
  label: string;
  symbol: "@" | "#";
  type: "user" | "topic";
  color?: string;
}): HTMLSpanElement {
  const el = document.createElement("span");
  el.className = "tag-chip";
  el.setAttribute("contenteditable", "false");
  el.dataset.tagId = opts.id;
  el.dataset.tagLabel = opts.label;
  el.dataset.tagType = opts.type;
  el.dataset.tagSymbol = opts.symbol;
  if (opts.color) el.dataset.tagColor = opts.color;
  el.dataset.tagCreatedAt = new Date().toISOString();

  const labelNode = document.createTextNode(`${opts.symbol}${opts.label}`);
  el.appendChild(labelNode);

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "remove";
  remove.setAttribute("aria-label", `Remove tag ${opts.label}`);
  remove.textContent = "×";
  remove.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    el.remove();
  };

  el.appendChild(document.createTextNode(" "));
  el.appendChild(remove);
  el.appendChild(document.createTextNode(" "));

  return el;
}
