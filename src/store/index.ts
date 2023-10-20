import {configureStore} from '@reduxjs/toolkit'
import {authApi} from './auth/auth.api.js'
import {setupListeners} from '@reduxjs/toolkit/query'
import {NameSpace} from "../consts.ts";
import {authReducer} from "./auth/auth.slice.ts";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [NameSpace.Auth]: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({serializableCheck: false}).concat(authApi.middleware),
})

setupListeners(store.dispatch)