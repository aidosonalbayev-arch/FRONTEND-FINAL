import { createSlice } from "@reduxjs/toolkit";

const totalSlice = createSlice({
  name: "total",
  initialState: {
    allTime: 0,
    thisMonth: 0,
    count: 0,
  },
  reducers: {
    recalculate: (state, action) => {
      const expenses = action.payload;
      const curMonth = new Date().toISOString().slice(0, 7);

      state.count = expenses.length;
      state.allTime = expenses.reduce((sum, e) => sum + e.amount, 0);
      state.thisMonth = expenses
        .filter((e) => e.date.startsWith(curMonth))
        .reduce((sum, e) => sum + e.amount, 0);
    },
    resetTotal: (state) => {
      state.allTime = 0;
      state.thisMonth = 0;
      state.count = 0;
    },
  },
});

export const { recalculate, resetTotal } = totalSlice.actions;
export default totalSlice.reducer;

export const selectAllTime = (state) => state.total.allTime;
export const selectThisMonth = (state) => state.total.thisMonth;
export const selectCount = (state) => state.total.count;
