import { z } from 'zod';

export const roleSchema = z.object({
    role_name: z
        .string()
        .min(1, 'Role name is required')
        .max(100, 'Role name must be less than 100 characters'),
});

export type RoleFormData = z.infer<typeof roleSchema>;
