import { z } from 'zod';

export const localizedInfoSchema = z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    current_company: z.string().optional(),
    current_role: z.string().optional(),
    about: z.string().optional(),
});

export type LocalizedInfoFormData = z.infer<typeof localizedInfoSchema>;
