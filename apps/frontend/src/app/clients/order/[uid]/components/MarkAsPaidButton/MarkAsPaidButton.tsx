"use client"
import { markAsPaid } from "@/actions/orders/markAsPaid"
import { Button } from "@/components/ui/button"


export default function MarkAsPaidButton(props: { orderId: string }) {
    const { orderId } = props
    const pay = async () => {
        const result = await markAsPaid(orderId)
        if("error" in result){
            alert(result.error)
        }
    }
    return (
        <Button type="button" onClick={pay}>Pagar</Button>
    )
}