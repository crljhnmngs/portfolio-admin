import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useDeleteRole = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isError, isPending, error, ...rest } = useMutation({
        mutationFn: async (id: string) => {
            const response = await axios.delete(`/api/roles/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Role deleted');
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },
        onError: () => {
            toast.error('Failed to delete role');
        },
    });

    return {
        deleteRole: mutateAsync,
        isLoading: isPending,
        isError,
        error,
        ...rest,
    };
};
