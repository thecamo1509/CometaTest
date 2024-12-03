"use client"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import styles from './AddRoundModal.module.css'
import AddRoundForm from "@/components/AddRoundForm/AddRoundForm";
import { useState } from "react";

export default function AddRoundModal(props: { orderId: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const { orderId } = props

    const onSubmit = async () => {
        setIsOpen(false)
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className={styles.btn}>Nueva ronda</DialogTrigger>
            <DialogContent className={styles.dialog} >
                <DialogHeader>Crea una nueva orden de cerveza</DialogHeader>
                <AddRoundForm orderId={orderId} onSubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}