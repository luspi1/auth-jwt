import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError
} from "@reduxjs/toolkit/query/react";
import {User} from "../../types/users.ts";
import {AuthResponse} from "../../types/response.ts";
import {FieldValues} from "react-hook-form";
import {Mutex} from "async-mutex";
import {authActions} from "./auth.slice.ts";

const mutex = new Mutex()
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token')
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
    }
})

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock()
    let result = await baseQuery(args, api, extraOptions)
    if (result.error && result.error.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire()
            try {
                const refreshResult = await baseQuery(
                    '/refresh',
                    api,
                    extraOptions
                )
                if (refreshResult.data) {
                    const authResponse = refreshResult.data as AuthResponse
                    localStorage.setItem('token', authResponse.accessToken)
                    result = await baseQuery(args, api, extraOptions)
                } else {
                    api.dispatch(authActions.setAuth(false))
                    api.dispatch(authActions.setUser(null))
                    localStorage.removeItem('token')
                }
            } finally {
                release()
            }
        } else {
            await mutex.waitForUnlock()
            result = await baseQuery(args, api, extraOptions)
        }
    }
    return result
}

export const authApi = createApi({
    reducerPath: 'auth/api',
    tagTypes: ['Auth'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        registrationUser: build.mutation<AuthResponse, FieldValues>({
            query: (formData) => ({
                url: '/registration',
                method: 'POST',
                body: formData,
            })
        }),
        loginUser: build.mutation<AuthResponse, FieldValues>({
            query: (formData) => ({
                url: '/login',
                method: 'POST',
                body: formData,
            })
        }),
        logoutUser: build.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST',
            })
        }),
        checkAuth: build.query({
            query: () => ({
                url: '/refresh',
            }),

        }),
        getAllUsers: build.query<User[], null>({
            query: () => ({
                url: '/users',
            }),
            providesTags: ['Auth'],
        }),

    })
})
export const {
    useLoginUserMutation,
    useRegistrationUserMutation,
    useLogoutUserMutation,
    useLazyGetAllUsersQuery,
    useLazyCheckAuthQuery
} = authApi