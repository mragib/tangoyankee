import { logout } from "@/services/apiUser";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: JSON.parse(localStorage.getItem("isAuthenticated")) || false,
  token: JSON.parse(localStorage.getItem("token")) || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  status: "idle",
  role: null,
};

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  const response = await logout(); // Change this to your actual logout API endpoint
  return response.data; // You can adjust based on what the API returns
});
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const {
        isBlocked,
        createdat,
        updatedat,
        phone,
        address,
        ...remainingData
      } = action.payload.user;
      console.log(remainingData);
      localStorage.setItem("isAuthenticated", true);
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      localStorage.setItem("user", JSON.stringify(remainingData));
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        role: action.payload.user.role.name,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading"; // Optional: Set loading status
      })
      .addCase(logoutUser.fulfilled, (state) => {
        // On successful logout, clear local storage and reset state
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.role = null;
        state.status = "idle"; // Reset status
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "idle"; // Reset status
        state.error = action.error.message; // Handle error if necessary
      });
  },
});

export const { login } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
