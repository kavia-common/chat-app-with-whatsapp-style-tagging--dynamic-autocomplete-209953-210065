import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api";
import { Tag, TagTrigger } from "@/types";

export interface TagsState {
  suggestions: Tag[];
  loading: boolean;
  error: string | null;
  trigger: TagTrigger | null;
  query: string;
  visible: boolean;
  anchorPos: { x: number; y: number } | null;
}

const initialState: TagsState = {
  suggestions: [],
  loading: false,
  error: null,
  trigger: null,
  query: "",
  visible: false,
  anchorPos: null,
};

// PUBLIC_INTERFACE
export const fetchTags = createAsyncThunk<
  Tag[],
  { trigger: TagTrigger; search?: string }
>("tags/fetch", async ({ trigger, search }) => {
  const res = await api.get<Tag[]>("/api/tags", {
    params: { trigger, search: search ?? "" },
  });
  return res;
});

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setTrigger(state, action: PayloadAction<TagTrigger | null>) {
      state.trigger = action.payload;
    },
    setVisible(state, action: PayloadAction<boolean>) {
      state.visible = action.payload;
    },
    setAnchorPos(state, action: PayloadAction<{ x: number; y: number } | null>) {
      state.anchorPos = action.payload;
    },
    hide(state) {
      state.visible = false;
      state.trigger = null;
      state.query = "";
      state.anchorPos = null;
    },
    show(
      state,
      action: PayloadAction<{
        trigger: TagTrigger;
        query: string;
        anchorPos: { x: number; y: number };
      }>
    ) {
      state.trigger = action.payload.trigger;
      state.query = action.payload.query;
      state.anchorPos = action.payload.anchorPos;
      state.visible = true;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tags";
      });
  },
});

export const { setQuery, setTrigger, setVisible, setAnchorPos, hide, show } =
  tagsSlice.actions;
export default tagsSlice.reducer;
