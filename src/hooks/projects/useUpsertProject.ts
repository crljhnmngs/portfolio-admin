import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UpsertProjectParams } from '@/types/global';

export const useUpsertProject = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isError, isPending, error, ...rest } = useMutation({
        mutationFn: async (params: UpsertProjectParams) => {
            const response = await axios.put(
                `/api/projects/${params.id || 'add'}`,
                params
            );
            return response.data;
        },
        onSuccess: (_data, params) => {
            const message = params.id
                ? 'Project updated successfully!'
                : 'Project added successfully!';
            toast.success(message);

            queryClient.invalidateQueries({ queryKey: ['projects'] });
            onSuccessCallback?.();
        },
        onError: (error, params) => {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.error ||
                    (params.id
                        ? 'Failed to update project'
                        : 'Failed to add project');
                toast.error(errorMessage);
            } else {
                toast.error('An unexpected error occurred');
            }
        },
    });

    return {
        upsertProject: mutateAsync,
        isLoading: isPending,
        isError,
        error,
        ...rest,
    };
};
