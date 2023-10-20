import {FC, useEffect} from 'react'
import {AuthForm} from "./modules/auth-form/auth-form.tsx";
import {useLazyCheckAuthQuery} from "./store/auth/auth.api.ts";

import {Header} from "./modules/header/header.tsx";
import {useActions} from "./hooks/actions/actions.ts";
import {Loader} from "./components/loader/loader.tsx";

export const App: FC = () => {
    const [checkAuth, {data: authData, isLoading}] = useLazyCheckAuthQuery()
    const {setAuth, setUser} = useActions()

    useEffect(() => {
        if (localStorage.getItem('token')) {
            checkAuth(null)
            if (authData) {
                localStorage.setItem('token', authData.accessToken)
                setAuth(true)
                setUser(authData.user)
            }
        }
    }, [authData])

    if (isLoading) {
        return <Loader/>
    }

    return (
        <>
            <Header/>
            <AuthForm/>
        </>

    )
}

