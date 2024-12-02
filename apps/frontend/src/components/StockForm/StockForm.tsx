"use client"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { StockFormSchema } from "./StockForm.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { RadioGroup } from "../ui/radio-group"
import styles from './StockForm.module.css'
import { RadioCard } from "../RadioCard/RadioCard"
import { ITEM_MAPPER } from "@/app/constants"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import { addStock } from "@/actions/inventory/addStock"
import { AddStockPayload } from "@/adapters/StockApi/StockApiAdapter.types"

export const StockForm = (props:{onSubmit: () => Promise<void>}) => {
    const { onSubmit } = props
    const [error, setError] = useState<string | null>(null)
    const form = useForm<z.infer<typeof StockFormSchema>>({
        resolver: zodResolver(StockFormSchema),
        defaultValues:{
            name: "Corona",
            quantity: NaN
        },
        mode: 'onChange'
    })

    const submitForm = async (data: AddStockPayload) => {
        const result = await addStock(data)
        if("error" in result){
            setError(result.error as string)
        }
        else{
            onSubmit()
        }
        console.log("RESULT", result)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submitForm)} className={styles.formContainer}>
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
                            <Input type="number" min={1} placeholder="Cuantas unidades vas a añadir?" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                    )}/>
                    <Button className={!form.formState.isValid ? styles.disabled : styles.button} type="submit">Añadir stock</Button>
                    {error && <div className={styles.error}><p>Error: {error}</p></div>}
            </form>
        </Form>
    )
}