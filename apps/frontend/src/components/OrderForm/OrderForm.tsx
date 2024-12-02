"use client"

import {  useForm } from "react-hook-form"
import { OrderFormSchema } from "./OrderForm.schema"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import styles from './OrderForm.module.css'
import { createOrder } from "@/actions/orders/createOrder"
import { OrderPayload } from "@/adapters/backendApi/OrderApiAdapter.types"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { RadioGroup } from "../ui/radio-group"
import { RadioCard } from "../RadioCard/RadioCard"
import { ITEM_MAPPER } from "@/app/constants"

const OrderForm = () => {
    const form = useForm<z.infer<typeof OrderFormSchema>>({
        resolver: zodResolver(OrderFormSchema),
        defaultValues:{
            name: "Corona",
            quantity: NaN
        },
        mode: 'onChange'
    })
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function onSubmit(data: OrderPayload) {
        const result = await createOrder(data)
        if("error" in result){
            setError(result.error)
        }
        else{
            const redirectUrl = `/clients/order/${result.uid}`
            router.push(redirectUrl)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={styles.formContainer}>
                <FormField control={form.control} name="name" render={({field})=>(
                    <FormItem>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className={styles.flexContainer}>
                                <FormItem>
                                    <FormControl>
                                        <RadioCard value="Corona" imgSrc={ITEM_MAPPER.Corona} label="Corona" />
                                    </FormControl>
                                </FormItem>
                                <FormItem>
                                    <FormControl>
                                        <RadioCard value="Quilmes" imgSrc={ITEM_MAPPER.Quilmes} label="Quilmes" />
                                    </FormControl>
                                </FormItem>
                                <FormItem>
                                    <FormControl>
                                        <RadioCard value="Club Colombia" imgSrc={ITEM_MAPPER["Club Colombia"]} label="Club Colombia" />
                                    </FormControl>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>             
                        <FormMessage/>
                    </FormItem>
                    )}/>
                    <FormField control={form.control} name="quantity" render={({field})=>(
                    <FormItem>
                        <FormControl>
                            <Input type="number" min={1} placeholder="Cuantas te tomas?" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                    )}/>
                    <Button className={!form.formState.isValid ? styles.disabled : styles.button} type="submit">Crear orden</Button>
                    {
                        error && 
                        <div className={styles.error}>
                            <p>Error: {error}</p>
                        </div>
                    }
            </form>
            
        </Form>
    )
}

export default OrderForm