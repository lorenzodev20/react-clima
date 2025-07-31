import { type ReactNode } from 'react';
import style from "./Alert.module.css"

export default function Alert({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <div className={style.alert}>{children}</div>
    )
}
