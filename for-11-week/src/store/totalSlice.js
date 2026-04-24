// store/totalSlice.js
// Редьюсер 2 — хранит и пересчитывает общую сумму расходов
// Зачем Redux для этого? Чтобы любой компонент мог читать сумму
// без передачи пропсов через цепочку компонентов
import { createSlice } from "@reduxjs/toolkit";

const totalSlice = createSlice({
  name: "total",
  initialState: {
    allTime: 0, // общая сумма всех расходов
    thisMonth: 0, // сумма за текущий месяц
    count: 0, // количество расходов
  },
  reducers: {
    // Пересчитываем все значения когда меняется список расходов
    recalculate: (state, action) => {
      const expenses = action.payload; // передаём весь массив расходов
      const curMonth = new Date().toISOString().slice(0, 7); // "2025-04"

      state.count = expenses.length;
      state.allTime = expenses.reduce((sum, e) => sum + e.amount, 0);
      state.thisMonth = expenses
        .filter((e) => e.date.startsWith(curMonth))
        .reduce((sum, e) => sum + e.amount, 0);
    },
    // Сброс при logout
    resetTotal: (state) => {
      state.allTime = 0;
      state.thisMonth = 0;
      state.count = 0;
    },
  },
});

export const { recalculate, resetTotal } = totalSlice.actions;
export default totalSlice.reducer;

// Селекторы
export const selectAllTime = (state) => state.total.allTime;
export const selectThisMonth = (state) => state.total.thisMonth;
export const selectCount = (state) => state.total.count;
