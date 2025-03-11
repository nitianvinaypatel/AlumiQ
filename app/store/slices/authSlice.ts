import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { router } from 'expo-router';

interface User {
  id: string;
  email: string;
  fullName: string;
  university?: string;
  graduationYear?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }) => {
    try {
      // TODO: Implement actual API call
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: '1',
        email,
        fullName: 'John Doe',
      };
      
      return user;
    } catch (error) {
      throw new Error('Failed to sign in');
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (userData: {
    email: string;
    password: string;
    fullName: string;
    university?: string;
    graduationYear?: string;
  }) => {
    try {
      // TODO: Implement actual API call
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: '1',
        email: userData.email,
        fullName: userData.fullName,
        university: userData.university,
        graduationYear: userData.graduationYear,
      };
      
      return user;
    } catch (error) {
      throw new Error('Failed to sign up');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string) => {
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return email;
    } catch (error) {
      throw new Error('Failed to reset password');
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  try {
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return null;
  } catch (error) {
    throw new Error('Failed to sign out');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Sign In
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
        router.replace('/(tabs)/home');
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to sign in';
      });

    // Sign Up
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
        router.replace('/(tabs)/home');
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to sign up';
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to reset password';
      });

    // Sign Out
    builder
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.error = null;
        router.replace('/');
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to sign out';
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 