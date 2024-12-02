import Link from 'next/link'
import styles from './NavMenu.module.css'
import { NavMenuProps } from './NavMenu.types'

export const NavMenu = ({MenuItems}: NavMenuProps) => {
    return(
        <ul className={styles.root}>
            {
                MenuItems.map((item, index) => {
                    return(
                        <Link key={index} href={item.href}>
                            <li className={styles.item}>{item.name}</li>
                        </Link>
                    )})
            }
        </ul>
    )
}