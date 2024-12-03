"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddRoundFormSchema, AddRoundFormValues } from "./AddRoundForm.schema";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import styles from "./AddRoundForm.module.css";
import { ITEM_MAPPER } from "@/app/constants";
import Image from "next/image";
import { useState } from "react";
import { addRoundToOrder } from "@/actions/orders/addRoundToOrder";

export default function AddRoundForm(props: { orderId: string, onSubmit: () => Promise<void> }) {
  const { orderId } = props
  const { onSubmit } = props
  const [error, setError] = useState<string | null>(null)
  const form = useForm<AddRoundFormValues>({
    resolver: zodResolver(AddRoundFormSchema),
    defaultValues: {
      items: [
        { name: "Corona", quantity: 0 },
        { name: "Quilmes", quantity: 0 },
        { name: "Club Colombia", quantity: 0 },
      ],
    },
    mode: "onChange",
  });

  const { fields, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  async function submitForm(data: AddRoundFormValues) {
    const filteredItems = data.items.filter((item) => item.quantity > 0);
    const result = await addRoundToOrder(orderId, filteredItems);
    if ("error" in result) {
      setError(result.error as string);
    } else{
        onSubmit()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)} className={styles.formContainer}>
        <div className={styles.flexContainer}>
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={form.control}
            name={`items.${index}.quantity`}
            render={({ field: quantityField }) => (
              <FormItem>
                <div>
                    <div className={styles.cardContainer}>
                        <Image className={styles.image} src={ITEM_MAPPER[field.name as keyof typeof ITEM_MAPPER]} alt={field.name} width={100} height={100} />
                        <p>{field.name}</p>
                    </div>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Cantidad"
                      className={styles.input}
                      value={quantityField.value || ""}
                      onChange={(e) =>
                        update(index, {
                          ...field,
                          quantity: parseInt(e.target.value, 10) || 0,
                        })
                      }
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        </div>
        <Button
          className={!form.formState.isValid ? styles.disabled : styles.button}
          type="submit"
        >
          Añadir Ronda
        </Button>
        {error && <div className={styles.error}><p>Error: {error}</p></div>}
      </form>
    </Form>
  );
}