import { cn } from '@/lib/utils'
import styles from './PromoContainer.module.css'
import { PromoContainerProps } from './PromoContainer.types'
import Image from 'next/image'
import { Button } from '../ui/button'
import Link from 'next/link'

export const PromoContainer = ({color='primary', contentPlacement='left', title, subtitle, imgSrc, imgAlt, btnText, btnHref}: PromoContainerProps) => {
    return(
        <div className={cn(styles.root, styles[color])}>
            <div className={cn(styles.content, styles[contentPlacement])}>
                <div>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.subtitle}>{subtitle}</p>
                </div>
                <Link href={btnHref}>
                    <Button className={cn(styles.btn, styles[`${color}-btn`])}>{btnText}</Button>
                </Link>
            </div>
            <div>
                <Image className={styles.image} src={imgSrc} alt={imgAlt} width={300} height={100} />
            </div>
        </div>
    )
}