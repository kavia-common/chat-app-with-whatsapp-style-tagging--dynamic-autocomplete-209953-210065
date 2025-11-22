import { configureStore } from "@reduxjs/toolkit";
import messagesReducer from "./messagesSlice";
import tagsReducer from "./tagsSlice";

/**
 * PUBLIC_INTERFACE
 * create and export the redux store instance
 */
export const store = configureStore({
  reducer: {
    messages: messagesReducer,
    tags: tagsReducer,
  },
  devTools:
    typeof window !== "undefined" &&
    (process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV) !== "production",
});

// PUBLIC_INTERFACE
export type RootState = ReturnType<typeof store.getState>;
// PUBLIC_INTERFACE
export type AppDispatch = typeof store.dispatch;
