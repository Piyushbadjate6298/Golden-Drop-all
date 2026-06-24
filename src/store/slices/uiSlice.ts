import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UiState = {
  isSidebarOpen: boolean;
  theme: "light" | "dark";
};

const initialState: UiState = {
  isSidebarOpen: false,
  theme: "light"
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.isSidebarOpen = action.payload;
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setTheme(state, action: PayloadAction<UiState["theme"]>) {
      state.theme = action.payload;
    }
  }
});

export const { setSidebarOpen, setTheme, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
