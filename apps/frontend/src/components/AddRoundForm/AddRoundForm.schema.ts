import { z } from "zod";

export const AddRoundFormSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.enum(["Corona", "Quilmes", "Club Colombia"], {
          required_error: "El nombre es obligatorio",
          invalid_type_error: "Debe seleccionar un nombre válido",
        }),
        quantity: z
          .number({
            invalid_type_error: "Debe ser un número",
          })
          .min(0, "La cantidad no puede ser negativa"), // Permite 0 para no seleccionados
      })
    )
    .nonempty("Debes seleccionar al menos un producto.")
    .refine(
      (items) => items.some((item) => item.quantity > 0), // Al menos un ítem debe tener quantity > 0
      {
        message: "Debes seleccionar al menos un ítem con cantidad mayor a 0.",
        path: ["items"],
      }
    ),
});

export type AddRoundFormValues = z.infer<typeof AddRoundFormSchema>;