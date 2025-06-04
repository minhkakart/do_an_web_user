import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type Token = {
    accessToken: string;
    refreshToken: string;
}

export type UserData = {
    id: string;
    fullName: string;
    avatar: string | null;
    role: number;
}

export type AppState = {
    isLoading: boolean;
    token: Token | null;
    userData: UserData | null;
    isLoggedIn: boolean;
    isTokenValid: boolean;
    isCheckingToken: boolean;
}

const initialState: AppState = {
    isLoading: false,
    token: null,
    userData: null,
    isLoggedIn: false,
    isTokenValid: false,
    isCheckingToken: true
}

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setToken: (state, action: PayloadAction<Token | null>) => {
            state.token = action.payload;
        },
        setUserData: (state, action: PayloadAction<UserData | null>) => {
            state.userData = action.payload;
        },
        setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload;
        },
        setIsTokenValid: (state, action: PayloadAction<boolean>) => {
            state.isTokenValid = action.payload;
        },
        setIsCheckingToken: (state, action: PayloadAction<boolean>) => {
            state.isCheckingToken = action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.userData = null;
            state.isLoading = false;
        },
    },
});

export const {setLoading, setToken, setUserData, setIsLoggedIn, setIsTokenValid, setIsCheckingToken, logout} = appSlice.actions;
export default appSlice.reducer;