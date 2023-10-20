import {FC} from "react";
import {useAppSelector} from "../../hooks/store";
import {authUser, isAuthUser} from "../../store/auth/auth.selectors.ts";

import styles from './index.module.scss'
import {Container} from "../../UI/container/Container.tsx";
import {useLogoutUserMutation} from "../../store/auth/auth.api.ts";
import {useActions} from "../../hooks/actions/actions.ts";

export const Header: FC = () => {
    const isAuth = useAppSelector(isAuthUser)
    const user = useAppSelector(authUser)
    const {setAuth, setUser} = useActions()
    const [logoutUser] = useLogoutUserMutation()

    const handleLogout = () => {
        try {
            logoutUser(null)
            setAuth(false)
            setUser(null)
            localStorage.removeItem('token')
        } catch (e) {
            console.log(e)
        }

    }

    return (

        <div className={styles.header}>
            <Container>
                <div className={styles.headerWrapper}>
                    <h1>{isAuth ? `Добро пожаловать, ${user?.email} ${user?.isActivated ? '(подтвержденный)' : ''}` : 'Вы не авторизованы!'}</h1>
                    {
                        isAuth && <button onClick={handleLogout}
                                          type='button'>Выйти</button>
                    }
                </div>
            </Container>
        </div>

    );
};

