import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required." })
    .email({ message: "Enter a valid email address." }),

  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(64, { message: "Password must be at most 64 characters." })
    .regex(/[a-z]/, { message: "Password must include a lowercase letter (a-z)." })
    .regex(/[A-Z]/, { message: "Password must include an uppercase letter (A-Z)." })
    .regex(/\d/,   { message: "Password must include a digit (0-9)." })
    .regex(/[^\w\s]/, { message: "Password must include a special character (e.g. !@#$%)." })
    .refine((v) => !/\s/.test(v), { message: "Password must not contain spaces." }),
});

export type LoginInput = z.infer<typeof loginSchema>;
