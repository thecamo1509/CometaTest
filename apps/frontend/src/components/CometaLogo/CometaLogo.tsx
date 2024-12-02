import Image from 'next/image'

import type { CometaLogoProps } from './CometaLogo.types'
import styles from './CometaLogo.module.css'

export const CometaLogo = ({width=40, height=40, alt=""}: CometaLogoProps) => {
    return (
        <div className={styles.root}>
            <Image src={'https://cdn.prod.website-files.com/6323af3a160e0a067e91428a/6408f24bd32c4d7acb3f5010_Frame.svg'} alt={alt} width={width} height={height} />
            
        </div>
    )}