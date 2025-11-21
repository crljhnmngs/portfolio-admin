import z from 'zod';

export const projectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    image: z
        .string()
        .url('Invalid image URL')
        .min(1, 'Project image is required'),
    about: z.string().min(10, 'About must be at least 10 characters'),
    date: z.string().min(1, 'Project date is required'),
    github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
    live: z.string().url('Invalid live demo URL').optional().or(z.literal('')),
    new: z.boolean().optional(),
    dev: z.boolean().optional(),
    tech: z
        .array(z.string().min(1, 'Technology name is required'))
        .min(1, 'At least one technology is required'),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
