import {User} from "./users.ts";

export type AuthResponse = {
    accessToken: string
    refreshToken: string
    user: User
}