import { PromoContainer } from '@/components/PromoContainer/PromoContainer';
import styles from './page.module.css'
import { DEFAULT_PROMOTION_CONTAINERS } from '@/app/constants'

export default function Home() {
  return (
    <div className={styles.root}>
      <h5 className={styles.auxTitle}>Bienvenido</h5>
      <h1 className={styles.title}>La mejor plataforma para <span className={styles.strong}>gestionar tus Cervezas favoritas</span></h1>
      <div className={styles.flexContainer}>
        {
          DEFAULT_PROMOTION_CONTAINERS.map((container, index) => {
            return(
              <PromoContainer key={index} {...container} />
            )})
        }
      </div>
    </div>
  );
}
