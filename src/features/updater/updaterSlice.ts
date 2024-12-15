import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUpdate = createAsyncThunk(
    "updater/fetchUpdate",
    async () => {
        const response = await fetch("/jul24/storage.php");
        const result = await response.json();
        return result;
    }
);

export interface UpdaterState {
    loading: boolean;
    saving: boolean;
}

const initialState: UpdaterState = {
    loading: false,
    saving: false
};

export const updaterSlice = createSlice({
    name: "updater",
    initialState: initialState,
    reducers: {
        markForSave: (state: UpdaterState) => {
            state.saving = true;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUpdate.fulfilled, (state, payload) => {
            state.saving = false;
            state.loading = false;
        });
        builder.addCase(fetchUpdate.pending, (state) => {
            state.saving = false;
            state.loading = true;
        });
    }
});

export default updaterSlice.reducer;

export const { markForSave } = updaterSlice.actions;