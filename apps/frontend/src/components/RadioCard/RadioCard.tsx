"use client"
import { RadioGroupItem } from "../ui/radio-group"
import { RadioCardProps } from "./RadioCard.types"
import styles from './RadioCard.module.css'
import Image from "next/image"
import { useRef, useState } from "react"

export const RadioCard = ({value, imgSrc, label}: RadioCardProps) => {

    return(
        <div className={styles.root} >
            <RadioGroupItem className={styles.radio} value={value} />
            <div className={styles.flexContainer}>
                <Image className={styles.image} src={imgSrc} alt={label} width={100} height={100} />
                <p className={styles.label}>{label}</p>
            </div>
        </div>
    )
}