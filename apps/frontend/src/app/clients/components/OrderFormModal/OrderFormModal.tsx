"use client"

import dynamic from "next/dynamic"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { OrderFormSkeleton } from "@/components/OrderForm/OrderFormSkeleton"
import styles from './OrderFormModal.module.css'

const OrderForm = dynamic(()=> import('@/components/OrderForm/OrderForm'), {ssr: false, loading: () => <OrderFormSkeleton />})


export const OrderFormModal = () => {

    return (
        <Dialog >
            <DialogTrigger className={styles.actionBtn}>Crear una orden de cervezas</DialogTrigger>
            <DialogContent className={styles.modalContent}>
                <DialogHeader className={styles.modalHeader} >Crea una nueva orden de cerveza</DialogHeader>
                <OrderForm />
            </DialogContent>
        </Dialog>
    )
}