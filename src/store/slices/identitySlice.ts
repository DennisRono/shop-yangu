import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface User {
  full_name: string | null | undefined
  user_id: string | null | undefined
  email: string | null | undefined
  client_state: string | null | undefined
  [key: string]: any
}

interface LoggedState {
  islogged: boolean
  user: User
}

const initialState: LoggedState = {
  islogged: false,
  user: { full_name: '', user_id: null, email: null, client_state: null },
}

const identitySlice = createSlice({
  name: 'identity',
  initialState,
  reducers: {
    setIdentity: (
      state,
      action: PayloadAction<{
        islogged: boolean
        user: User
      }>
    ) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { setIdentity } = identitySlice.actions
export default identitySlice.reducer
