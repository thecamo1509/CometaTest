"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PromotionFormSchema } from "./PromotionForm.schema";
import { Input } from "../ui/input";
import styles from "./PromotionForm.module.css";
import { AddPromotionPayload } from "@/adapters/backendApi/PromotionApiAdapter.types";
import { RadioGroup } from "../ui/radio-group";
import { RadioCard } from "../RadioCard/RadioCard";
import { ITEM_MAPPER } from "@/app/constants";
import { Button } from "../ui/button";
import { DateTimePicker } from "../ui/datetimepicker";
import { addPromotion } from "@/actions/promotions/addPromotion";
import { set } from "date-fns";
import { useState } from "react";

export const PromotionForm = (props: { onSubmit: () => Promise<void> }) => {
  const { onSubmit } = props;
  const [error, setError] = useState<string | null>(null)
  const form = useForm<z.infer<typeof PromotionFormSchema>>({
    resolver: zodResolver(PromotionFormSchema),
    defaultValues: {
      name: "",
      item_name: "Corona",
      discount_percentage: 10,
      start: new Date(),
      end: new Date(),
    },
    mode: "onChange",
  });

  const submitForm = async (data: z.infer<typeof PromotionFormSchema>) => {
    const startUTC = data.start.toISOString()
    const endUTC = data.end.toISOString()
    const payload = {
        ...data,
        start: startUTC,
        end: endUTC
    }
    const result = await addPromotion(payload)
    if("error" in result){
        setError(result.error as string)
    } else{
        onSubmit()
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitForm)}
        className={styles.formContainer}
      >
        <FormField
          control={form.control}
          name="item_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className={styles.flexContainer}
                >
                  <FormItem>
                    <FormControl>
                      <RadioCard
                        value="Corona"
                        imgSrc={ITEM_MAPPER.Corona}
                        label="Corona"
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioCard
                        value="Quilmes"
                        imgSrc={ITEM_MAPPER.Quilmes}
                        label="Quilmes"
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioCard
                        value="Club Colombia"
                        imgSrc={ITEM_MAPPER["Club Colombia"]}
                        label="Club Colombia"
                      />
                    </FormControl>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="text" placeholder="Nombre de la promo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discount_percentage"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className={styles.customInput}>
                  <Input
                    className={styles.input}
                    type="number"
                    min={1}
                    placeholder="Porcentaje de descuento"
                    {...field}
                  />
                  <div className={styles.sufix}>%</div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DateTimePicker
                  date={field.value}
                  onChange={(selectedDate) => field.onChange(selectedDate)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DateTimePicker
                  date={field.value}
                  onChange={(selectedDate) => field.onChange(selectedDate)}
                  
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className={
            !form.formState.isValid ? styles.disabled : styles.button
          }
          type="submit"
        >
          Crear promoción
        </Button>
        {error && <div className={styles.error}><p>Error: {error}</p></div>}
      </form>
    </Form>
  );
};