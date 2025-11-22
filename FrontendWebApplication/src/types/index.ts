export type TagTrigger = "@" | "#";

export interface Tag {
  id: string;
  label: string;
  type: "user" | "topic";
  color?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  tags: Tag[];
  timestamp: string;
  status: "sent" | "delivered" | "read";
}
