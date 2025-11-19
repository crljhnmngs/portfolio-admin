import z from 'zod';

export const educationSchema = z.object({
    school: z.string().min(1, 'School name is required'),
    track: z.string().min(1, 'Track is required'),
    course: z.string().min(1, 'Course is required'),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
    logo_url: z.string().url(),
    tech: z
        .array(z.string().min(1, 'Tech name is required'))
        .min(1, 'At least one tech is required'),
});

export type EducationFormData = z.infer<typeof educationSchema>;
