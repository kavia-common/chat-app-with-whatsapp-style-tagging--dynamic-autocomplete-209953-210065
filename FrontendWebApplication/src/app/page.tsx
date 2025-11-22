"use client";

import ChatWindow from "@/components/ChatWindow";

// Instruct Next.js that this page is dynamic and should not be statically prerendered.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="chat-container">
      <ChatWindow />
    </main>
  );
}
