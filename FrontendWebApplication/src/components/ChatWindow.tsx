"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendMessage } from "@/store/messagesSlice";
import { RootState, AppDispatch } from "@/store";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";
import { stringifyContentWithTags } from "@/utils/tagParser";

/**
PUBLIC_INTERFACE
ChatWindow
High-level chat layout: loads messages and renders MessageList + ChatInput.
*/
export default function ChatWindow() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((s: RootState) => s.messages);

  useEffect(() => {
    dispatch(fetchMessages({ page: 1, limit: 20, since: null })).catch(() => {});
  }, [dispatch]);

  const handleSend = async (editorEl: HTMLElement) => {
    const { text, tags } = stringifyContentWithTags(editorEl);
    const payload = {
      id: crypto.randomUUID(),
      sender: "me",
      content: text,
      tags,
      timestamp: new Date().toISOString(),
      status: "sent" as const,
    };
    try {
      await dispatch(sendMessage(payload)).unwrap();
      editorEl.innerHTML = "";
    } catch (e) {
      console.error(e);
      alert("Failed to send message");
    }
  };

  return (
    <section className="card">
      <div className="message-list" role="log" aria-busy={loading}>
        {error && (
          <div className="text-red-600 text-sm" role="alert">
            {error}
          </div>
        )}
        <MessageList messages={items} />
      </div>
      <div className="chat-input">
        <ChatInput onSend={handleSend} />
      </div>
    </section>
  );
}
