import { OrderFormModal } from './components/OrderFormModal/OrderFormModal'
import styles from './page.module.css'

export default function Page() {
    return (
        <div className={styles.root}>
            <h1 className={styles.title}>Aqui puedes <strong className={styles.strong}>crear</strong> una <strong className={styles.strong}>orden de cervezas</strong></h1>
            <div className={styles.flexContainer}>
                <p className={styles.description}>
                    Da click en el boton de abajo para crear una orden
                </p>
                <OrderFormModal />
            </div>
        </div>
    )
}