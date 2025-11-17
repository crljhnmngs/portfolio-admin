import z from 'zod';

export const experienceSchema = z.object({
    company: z.string().min(1),
    role: z.string().min(1),
    start_date: z.string().min(1),
    end_date: z.string().min(1),
    logo: z.string().url(),
    link: z.string().url(),
    description: z.string().min(1),
    tech: z
        .array(z.string().min(1, 'Tech name is required'))
        .min(1, 'At least one tech stack is required'),
    sub_items: z
        .array(
            z.object({
                id: z.string().optional(),
                position: z.string(),
                setup: z.string(),
                start_date: z.string(),
                end_date: z.string(),
                projects: z.array(
                    z.object({
                        id: z.string().optional(),
                        description: z.string(),
                        tech: z.array(z.string()).optional(),
                    })
                ),
            })
        )
        .optional(),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;
