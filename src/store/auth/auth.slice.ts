import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {NameSpace} from "../../consts.ts";
import {User} from "../../types/users.ts";

type AuthSliceState = {
    currentUser: User | null
    isAuth: boolean
}

const initialState: AuthSliceState = {
    currentUser: null,
    isAuth: false,
}

export const authSlice = createSlice({
    name: NameSpace.Auth,
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<boolean>) => {
            state.isAuth = action.payload
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            state.currentUser = action.payload
        }
    },
})

export const authActions = authSlice.actions

export const authReducer = authSlice.reducer
