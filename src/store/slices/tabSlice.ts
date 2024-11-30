import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface tabState {
  tab: string
}

const initialState: tabState = {
  tab: 'dashboard',
}

const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    setTab: (state, action: PayloadAction<tabState>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { setTab } = tabSlice.actions
export default tabSlice.reducer
