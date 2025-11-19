import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useDeleteEducation = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isError, isPending, error, ...rest } = useMutation({
        mutationFn: async (id: string) => {
            const response = await axios.delete(`/api/educations/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Education deleted');
            queryClient.invalidateQueries({ queryKey: ['educations'] });
            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },
        onError: () => {
            toast.error('Failed to delete education');
        },
    });

    return {
        deleteEducation: mutateAsync,
        isLoading: isPending,
        isError,
        error,
        ...rest,
    };
};
