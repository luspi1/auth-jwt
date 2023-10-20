import { FC } from 'react'

import styles from './index.module.scss'

type AlertMessageProps = {
	children: string | null
}
export const AlertMessage: FC<AlertMessageProps> = ({ children }) => {
	if (!children) {
		return
	}
	return <p className={styles.message}>{children}</p>
}
