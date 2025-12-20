import { z } from 'zod';

export const skillSchema = z.object({
    name: z
        .string()
        .min(2, 'Skill name must be at least 2 characters')
        .max(100, 'Skill name must be less than 100 characters'),
    icon_url: z
        .string()
        .max(255, 'Icon URL must be less than 255 characters')
        .optional()
        .refine((val) => !val || /^https?:\/\/.+/.test(val), {
            message: 'Icon URL must be a valid URL',
        }),
    category: z
        .string()
        .min(2, 'Category must be at least 2 characters')
        .max(50, 'Category must be less than 50 characters'),
});

export type SkillFormData = z.infer<typeof skillSchema>;
