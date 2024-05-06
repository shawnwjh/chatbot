import { createSlice } from '@reduxjs/toolkit'

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    value: {},
  },
  reducers: {
    startChat: (state, file) => {
        let currentFile = file.payload;
        state.value[currentFile] = [];
    },
    addChat: (state, saveChatlog) => {
        let currentFile = saveChatlog.payload.currentFile;
        let chat = saveChatlog.payload.chat;
        state.value[currentFile].push(chat);
    },
  },
})

export const { startChat, addChat } = chatSlice.actions;

export default chatSlice.reducer;