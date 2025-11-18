import { useMutation } from '@tanstack/react-query';
import { LoginFormData } from '@/utils/validation/loginSchema';
import axios from 'axios';

export function useLogin() {
    const mutation = useMutation({
        mutationFn: async (data: LoginFormData) => {
            const response = await axios.post('/api/login', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            return response.data;
        },
    });
    return {
        userLogin: mutation.mutate,
        isLoading: mutation.isPending,
        ...mutation,
    };
}
