import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useDeleteExperience = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isError, isPending, error, ...rest } = useMutation({
        mutationFn: async (id: string) => {
            const response = await axios.delete(`/api/experiences/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Experience deleted');
            queryClient.invalidateQueries({ queryKey: ['experiences'] });
            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },
        onError: () => {
            toast.error('Failed to delete experience');
        },
    });

    return {
        deleteExperience: mutateAsync,
        isLoading: isPending,
        isError,
        error,
        ...rest,
    };
};
