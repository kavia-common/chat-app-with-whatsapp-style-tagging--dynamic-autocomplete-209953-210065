import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api";
import { Message } from "@/types";

export interface MessagesState {
  items: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  items: [],
  loading: false,
  error: null,
};

// PUBLIC_INTERFACE
export const fetchMessages = createAsyncThunk<
  Message[],
  { page?: number; limit?: number; since?: string | null }
>("messages/fetch", async (params = {}) => {
  const res = await api.get<Message[]>("/api/messages", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      since: params.since ?? undefined,
    },
  });
  return res;
});

// PUBLIC_INTERFACE
export const sendMessage = createAsyncThunk<Message, Partial<Message>>(
  "messages/send",
  async (payload) => {
    const res = await api.post<Message>("/api/messages", payload);
    return res;
  }
);

// PUBLIC_INTERFACE
export const updateMessage = createAsyncThunk<
  Message,
  { id: string; data: Partial<Message> }
>("messages/update", async ({ id, data }) => {
  const res = await api.put<Message>(`/api/messages/${id}`, data);
  return res;
});

// PUBLIC_INTERFACE
export const deleteMessage = createAsyncThunk<string, string>(
  "messages/delete",
  async (id) => {
    await api.delete<void>(`/api/messages/${id}`);
    return id;
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    // optimistic local add if needed
    addLocalMessage(state, action: PayloadAction<Message>) {
      state.items.push(action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch messages";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateMessage.fulfilled, (state, action) => {
        const idx = state.items.findIndex((m) => m.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.items = state.items.filter((m) => m.id !== action.payload);
      });
  },
});

export const { addLocalMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
