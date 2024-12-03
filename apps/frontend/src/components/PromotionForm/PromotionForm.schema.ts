import { z } from "zod";

export const PromotionFormSchema = z.object({
  name: z.string().nonempty("El nombre de la promoción es obligatorio."),
  item_name: z.enum(["Corona", "Quilmes", "Club Colombia"], {
    required_error: "El nombre del producto es obligatorio.",
    invalid_type_error: "El nombre del producto debe ser válido.",
  }),
  discount_percentage: z
    .number({
      required_error: "El porcentaje de descuento es obligatorio.",
      invalid_type_error: "El porcentaje de descuento debe ser un número.",
    })
    .min(0, "El porcentaje de descuento no puede ser negativo.")
    .max(100, "El porcentaje de descuento no puede exceder el 100%."),
  start: z.date({
    required_error: "La fecha y hora de inicio son obligatorias.",
    invalid_type_error: "La fecha y hora de inicio deben ser válidas.",
  }),
  end: z.date({
    required_error: "La fecha y hora de fin son obligatorias.",
    invalid_type_error: "La fecha y hora de fin deben ser válidas.",
  }),
}).superRefine((data, ctx) => {
  if (data.end <= data.start) {
    ctx.addIssue({
      code: "custom",
      path: ["end"],
      message: "La fecha y hora de fin deben ser posteriores a la fecha y hora de inicio.",
    });
  }
});