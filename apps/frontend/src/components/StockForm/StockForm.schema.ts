import { z } from "zod";

export const StockFormSchema = z.object({
  name: z
    .union([z.enum(["Corona", "Quilmes", "Club Colombia"]), z.literal("")]) 
    .refine((value) => value !== "", { message: "Debes seleccionar una opción válida" }),
  quantity: z
    .string({ required_error: "Debes ingresar un número", message: "Debes ingresar un número" })
    .transform((value) => parseInt(value, 10))
    .refine((value) => !isNaN(value), { message: "Debes ingresar un número válido" })
    .refine((value) => value >= 1, { message: "El número debe ser al menos 1" })
    .refine((value) => value <= 10, { message: "El número no puede ser mayor a 10" }),
});