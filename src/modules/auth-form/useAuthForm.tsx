import {useActions} from "../../hooks/actions/actions.ts";
import {
    useLoginUserMutation,
    useRegistrationUserMutation
} from "../../store/auth/auth.api.ts";
import {FieldValues} from "react-hook-form";

export const useAuthForm = (): [(data: FieldValues, isAuth: boolean) => Promise<void>, boolean] => {
    const {setAuth, setUser} = useActions()
    const [loginUser, {isLoading}] = useLoginUserMutation()
    const [registrationUser] = useRegistrationUserMutation()
    const handleRegister = async (data: FieldValues, isAuth: boolean) => {
        try {
            const resServer = isAuth ? await loginUser(data) : await registrationUser(data)
            if ("data" in resServer) {
                localStorage.setItem('token', resServer.data.accessToken)
                setAuth(true)
                setUser(resServer.data.user)
            }

        } catch (e) {
            console.log(e)
        }
    }
    return [handleRegister, isLoading]
}