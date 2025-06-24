import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from './types';
import apiService from '../services/api';

const initialState: User & {
  loading: boolean;
  error: string | null;
  monthlySalary: number;
  salaryAllocation: { needs: number; wants: number; savings: number };
} = {
  id: '',
  email: '',
  name: '',
  isAuthenticated: false,
  loading: false,
  error: null,
  monthlySalary: 0,
  salaryAllocation: { needs: 50, wants: 30, savings: 20 },
};

// Async thunks
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.login(credentials);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.register(userData);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getProfile();
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData: { name?: string; email?: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateProfile(profileData);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const updateUserSalary = createAsyncThunk(
  'user/updateSalary',
  async (salary: number, { rejectWithValue }) => {
    try {
      const response = await apiService.updateSalary(salary);
      return response.data.monthlySalary;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update salary');
    }
  }
);

export const updateSalaryAllocation = createAsyncThunk(
  'user/updateSalaryAllocation',
  async (allocation: { needs: number; wants: number; savings: number }, { rejectWithValue }) => {
    try {
      // If you want to persist to backend, call an API here. For now, just return the allocation.
      // const response = await apiService.updateSalaryAllocation(allocation);
      // return response.data.salaryAllocation;
      return allocation;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update allocation');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.id = '';
      state.email = '';
      state.name = '';
      state.isAuthenticated = false;
      state.error = null;
      apiService.removeToken();
    },
    clearError: (state) => {
      state.error = null;
    },
    setSalaryAllocation: (state, action) => {
      state.salaryAllocation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.name = action.payload.name;
        state.isAuthenticated = true;
        state.monthlySalary = action.payload.monthlySalary ?? 0;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.name = action.payload.name;
        state.isAuthenticated = true;
        state.monthlySalary = action.payload.monthlySalary ?? 0;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.name = action.payload.name;
        state.isAuthenticated = true;
        state.monthlySalary = action.payload.monthlySalary ?? 0;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Salary
      .addCase(updateUserSalary.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserSalary.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlySalary = action.payload;
      })
      .addCase(updateUserSalary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Salary Allocation
      .addCase(updateSalaryAllocation.fulfilled, (state, action) => {
        state.salaryAllocation = action.payload;
      });
  },
});

export const { logout, clearError, setSalaryAllocation } = userSlice.actions;
export default userSlice.reducer;