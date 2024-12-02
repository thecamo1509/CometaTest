import { Skeleton } from "../ui/skeleton"
import styles from './OrderForm.module.css'

export const OrderFormSkeleton = () => {
    return (
        <div className={styles.formContainer}>
            <Skeleton className={styles.skeletonInput}  />
            <Skeleton className={styles.skeletonInput}  />
        </div>
    )
}