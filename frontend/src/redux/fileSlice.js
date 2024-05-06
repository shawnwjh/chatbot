import { createSlice } from '@reduxjs/toolkit'

export const fileSlice = createSlice({
  name: 'files',
  initialState: {
    value: [],
    current: '',
  },
  reducers: {
    addFile: (state, file) => {
        state.value.push(file);
    },
    deleteFile: (state, file) => {
        for (let i = 0; i < state.value.length; i++) {
            if (state.value[i] == file) {
                state.value.splice(i);
            }
        }
    },
    updateCurrent: (state, file) => {
        state.current = file;
    }
  },
})

export const { addFile, deleteFile, updateCurrent } = fileSlice.actions;

export default fileSlice.reducer;