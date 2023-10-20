import {FC, useState} from 'react'
import {useForm} from 'react-hook-form'

import cnBind from 'classnames/bind'

import styles from './index.module.scss'

import {AlertMessage} from "../../components/alert-message/alert-message.tsx";
import {useAuthForm} from "./useAuthForm.tsx";
import {Container} from "../../UI/container/Container.tsx";
import {useAppSelector} from "../../hooks/store";
import {isAuthUser} from "../../store/auth/auth.selectors.ts";
import {Loader} from "../../components/loader/loader.tsx";
import {useLazyGetAllUsersQuery} from "../../store/auth/auth.api.ts";


export const AuthForm: FC = () => {
    const [isAuth, setIsAuth] = useState<boolean>(true)

    const [alert, setAlert] = useState<string>('')

    const [handleRegister, isLoading] = useAuthForm()

    const [handleGetUsers, {data: usersList}] = useLazyGetAllUsersQuery()

    const isAuthGlobal = useAppSelector(isAuthUser)

    const cx = cnBind.bind(styles)
    const {
        register,
        handleSubmit,
        reset,
    } = useForm()

    const toggleFormType = (isReg: boolean) => {
        setIsAuth(isReg)
        setAlert('')
        reset()
    }

    const onSubmit = handleSubmit(async (data) => {
        setAlert('')
        handleRegister(data, isAuth)

    })

    if (isLoading) {
        return <Loader/>
    }

    if (isAuthGlobal) {
        return <Container>
            <button onClick={() => handleGetUsers(null)} type='button'>
                Получить пользователей
            </button>
            <ul>
                {
                    usersList?.map((user) => (
                        <li key={user.email}>{user.email}</li>
                    ))
                }
            </ul>

        </Container>
    }

    return (
        <Container>
            <div className={styles.authForm}>
                <div className={styles.formSwitch}>
                    <button
                        className={cx({_active: isAuth})}
                        type='button'
                        onClick={() => toggleFormType(true)}
                    >
                        Авторизация
                    </button>
                    <button
                        className={cx({_active: !isAuth})}
                        type='button'
                        onClick={() => toggleFormType(false)}
                    >
                        Регистрация
                    </button>
                </div>
                <form noValidate onSubmit={onSubmit}>
                    {isAuth ? (
                        <>
                            <input {...register('email')} type='email'
                                   placeholder='Email'/>

                            <input {...register('password')} type='password'
                                   placeholder='Пароль'/>
                            <AlertMessage>{alert}</AlertMessage>
                            <button className={styles.submitBtn} type='submit'>
                                Войти
                            </button>
                        </>
                    ) : (
                        <>
                            <input {...register('email')} type='email'
                                   placeholder='Email'/>
                            <input {...register('password')} type='password'
                                   placeholder='Пароль'/>
                            <input {...register('name')} type='text'
                                   placeholder='Имя'/>
                            <input {...register('lastname')} type='text'
                                   placeholder='Фамилия'/>

                            <AlertMessage>{alert}</AlertMessage>
                            <button className={styles.submitBtn} type='submit'>
                                Зарегистрироваться
                            </button>
                        </>
                    )}
                </form>
            </div>
        </Container>
    )
}
