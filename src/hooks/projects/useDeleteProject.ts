import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useDeleteProject = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isPending, isError, error } = useMutation({
        mutationFn: async (id: string) => {
            const response = await axios.delete(`/api/projects/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Project deleted successfully!');
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            onSuccessCallback?.();
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.error || 'Failed to delete project';
                toast.error(errorMessage);
            } else {
                toast.error('An unexpected error occurred');
            }
        },
    });

    return {
        deleteProject: mutateAsync,
        isLoading: isPending,
        isError,
        error,
    };
};
