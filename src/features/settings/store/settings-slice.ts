"use client";

import type { AppSetting } from "@/shared/services/settings-services";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type SettingsState = {
  data: AppSetting | null;
  loaded: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: SettingsState = {
  data: null,
  loaded: false,
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings(state, action: PayloadAction<AppSetting | null>) {
      state.data = action.payload;
      state.loaded = true;
      state.loading = false;
      state.error = null;
    },
    clearSettings(state) {
      state.data = null;
      state.loaded = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setSettings, clearSettings } = settingsSlice.actions;
export default settingsSlice.reducer;

