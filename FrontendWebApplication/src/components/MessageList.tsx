"use client";

import TagChip from "@/components/TagChip";
import { Message } from "@/types";

/**
PUBLIC_INTERFACE
MessageList
Renders messages, replacing serialized tags with visual chips.
*/
export default function MessageList({ messages }: { messages: Message[] }) {
  return (
    <>
      {messages.map((m) => (
        <article key={m.id} className="message-item">
          <div className="message-bubble">
            <MessageContent content={m.content} tags={m.tags} />
          </div>
          <div className="message-meta">
            {new Date(m.timestamp).toLocaleTimeString()} • {m.status}
          </div>
        </article>
      ))}
    </>
  );
}

function MessageContent({
  content,
  tags,
}: {
  content: string;
  tags: Message["tags"];
}) {
  const parts: Array<{
    type: "text" | "tag";
    text?: string;
    tagId?: string;
    label?: string;
    symbol?: "@" | "#";
  }> = [];
  const regex = /([@#])\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content))) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", text: content.slice(lastIndex, match.index) });
    }
    const symbol = match[1] as "@" | "#";
    const label = match[2];
    const id = match[3];
    parts.push({ type: "tag", tagId: id, label, symbol });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push({ type: "text", text: content.slice(lastIndex) });
  }

  return (
    <span>
      {parts.map((p, idx) =>
        p.type === "text" ? (
          <span key={idx}>{p.text}</span>
        ) : (
          <TagChip
            key={idx}
            tag={
              tags.find((t) => t.id === p.tagId) || {
                id: p.tagId!,
                label: p.label!,
                type: p.symbol === "@" ? "user" : "topic",
                createdAt: new Date().toISOString(),
              }
            }
            symbol={p.symbol!}
          />
        )
      )}
    </span>
  );
}
