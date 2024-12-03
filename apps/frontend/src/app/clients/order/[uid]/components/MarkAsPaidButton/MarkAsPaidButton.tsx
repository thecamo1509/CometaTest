"use client"
import { markAsPaid } from "@/actions/orders/markAsPaid"
import { Button } from "@/components/ui/button"
import styles from './MarkAsPaidButton.module.css'

export default function MarkAsPaidButton(props: { orderId: string }) {
    const { orderId } = props
    const pay = async () => {
        const result = await markAsPaid(orderId)
        if("error" in result){
            alert(result.error)
        }
    }
    return (
        <Button className={styles.btn} type="button" onClick={pay}>Pagar</Button>
    )
}