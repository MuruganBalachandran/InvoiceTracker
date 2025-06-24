import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { Expense } from './types';

export const fetchExpenses = createAsyncThunk<Expense[]>('expenses/fetchExpenses', async () => {
  const response = await api.getExpenses();
  let data: Expense[] = [];
  if (response.data && typeof response.data === 'object' && 'expenses' in response.data && Array.isArray((response.data as any).expenses)) {
    data = (response.data as any).expenses;
  } else {
    data = (response.data as Expense[]) || [];
  }
  // Normalize: ensure every expense has a string 'id'
  return data.map(exp => ({ ...exp, id: typeof exp.id === 'string' ? exp.id : (typeof exp._id === 'string' ? exp._id : Math.random().toString(36).slice(2)) }));
});

export const createExpense = createAsyncThunk<Expense, Parameters<typeof api.createExpense>[0], { rejectValue: string }>(
  'expenses/createExpense',
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await api.createExpense(expenseData);
      return response.data as Expense;
    } catch (err) {
      let message = 'Unknown error';
      if (typeof err === 'object' && err !== null && 'message' in err) {
        message = (err as any).message;
      }
      return rejectWithValue(message);
    }
  }
);

export const updateExpenseAsync = createAsyncThunk<Expense, { id: string; expenseData: Partial<Expense> }, { rejectValue: string }>(
  'expenses/updateExpense',
  async ({ id, expenseData }, { rejectWithValue }) => {
    try {
      const response = await api.updateExpense(id, expenseData);
      return response.data as Expense;
    } catch (err) {
      let message = 'Unknown error';
      if (typeof err === 'object' && err !== null && 'message' in err) {
        message = (err as any).message;
      }
      return rejectWithValue(message);
    }
  }
);

export const deleteExpenseAsync = createAsyncThunk<string, string, { rejectValue: string }>(
  'expenses/deleteExpense',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.deleteExpense(id);
      if (response.success) return id;
      return rejectWithValue(response.message || 'Delete failed');
    } catch (err) {
      let message = 'Unknown error';
      if (typeof err === 'object' && err !== null && 'message' in err) {
        message = (err as any).message;
      }
      return rejectWithValue(message);
    }
  }
);

interface ExpenseState {
  expenses: Expense[];
  monthlySalary: number;
}

const initialState: ExpenseState = {
  expenses: [],
  monthlySalary: 5000, // Default salary for demo
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.push(action.payload);
    },
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex(exp => exp.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter(exp => exp.id !== action.payload);
    },
    updateMonthlySalary: (state, action: PayloadAction<number>) => {
      state.monthlySalary = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.expenses = action.payload || [];
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        if (action.payload) state.expenses.push({ ...action.payload, id: typeof action.payload.id === 'string' ? action.payload.id : (typeof action.payload._id === 'string' ? action.payload._id : Math.random().toString(36).slice(2)) });
      })
      .addCase(updateExpenseAsync.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(exp => exp.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(deleteExpenseAsync.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(exp => exp.id !== action.payload);
      });
  },
});

export const {
  addExpense,
  updateExpense,
  deleteExpense,
  updateMonthlySalary,
} = expenseSlice.actions;

export default expenseSlice.reducer;