import { z } from 'zod';

export const generalInfoSchema = z.object({
    github: z.string().url('Invalid Link').optional(),
    linkedin: z.string().url('Invalid Link').optional(),
    facebook: z.string().url('Invalid Link').optional(),
    instagram: z.string().url('Invalid Link').optional(),
    x: z.string().url('Invalid Link').optional(),
    email: z.string().email('Invalid email address'),
    resumeUrl: z.string().url('Invalid Link').optional(),
    scheduleLink: z.string().url('Invalid Link').optional(),
});

export type GeneralInfoFormData = z.infer<typeof generalInfoSchema>;
