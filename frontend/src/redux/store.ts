import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import conversationReducer from './conversationSlice'
import messageReducer from './messageSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    conversation: conversationReducer,
    message: messageReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch