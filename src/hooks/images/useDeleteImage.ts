import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useDeleteImage = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isError, isPending, error, ...rest } = useMutation({
        mutationFn: async (id: string) => {
            const response = await axios.delete(`/api/images/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Image deleted');
            queryClient.invalidateQueries({ queryKey: ['images'] });
            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },
        onError: () => {
            toast.error('Failed to delete image');
        },
    });

    return {
        deleteImage: mutateAsync,
        isLoading: isPending,
        isError,
        error,
        ...rest,
    };
};
