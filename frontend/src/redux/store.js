import { configureStore } from '@reduxjs/toolkit'
import fileReducer from './fileSlice'
import chatReducer from './chatSlice'

export const store = configureStore({
  reducer: {
    file: fileReducer,
    chat: chatReducer
  },
})