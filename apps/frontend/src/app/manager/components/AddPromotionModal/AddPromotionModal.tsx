"use client"
import { Dialog, DialogHeader, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import styles from './AddPromotionModal.module.css'
import { PromotionForm } from "@/components/PromotionForm/PromotionForm"
import { useState } from "react"

export const AddPromotionModal = () => {
    const [isOpen, setIsOpen] = useState(false)

    const onSubmit = async () => {
        setIsOpen(false)
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className={styles.btn}>Crear una promoción</DialogTrigger>
            <DialogContent>
                <DialogHeader>Crea una nueva promoción</DialogHeader>
                <PromotionForm onSubmit={onSubmit}/>
            </DialogContent>
        </Dialog>
    )
}