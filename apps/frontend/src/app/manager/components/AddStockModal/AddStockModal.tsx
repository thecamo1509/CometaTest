"use client"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import styles from './AddStockModal.module.css'
import { StockForm } from "@/components/StockForm/StockForm"
import { useState } from "react"

export const AddStockModal = () => {
    const [isOpen, setIsOpen] = useState(false)

    const onSubmit = async () => {
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className={styles.btn}>Añadir stock</DialogTrigger>
            <DialogContent>
                <DialogHeader className={styles.title}>Añadir stock</DialogHeader>
                <StockForm onSubmit={onSubmit}/>
            </DialogContent>
        </Dialog>
    )
}