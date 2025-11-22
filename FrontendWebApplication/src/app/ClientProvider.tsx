"use client";

import { Provider } from "react-redux";
import { store } from "@/store";

/**
PUBLIC_INTERFACE
ClientProvider
Wraps children with Redux Provider on the client.
*/
export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
