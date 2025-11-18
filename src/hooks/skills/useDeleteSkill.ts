import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useDeleteSkill = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isError, isPending, error, ...rest } = useMutation({
        mutationFn: async (id: string) => {
            const response = await axios.delete(`/api/skills/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Skill deleted');
            queryClient.invalidateQueries({ queryKey: ['skills'] });
            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },
        onError: () => {
            toast.error('Failed to delete skill');
        },
    });

    return {
        deleteSkill: mutateAsync,
        isLoading: isPending,
        isError,
        error,
        ...rest,
    };
};
