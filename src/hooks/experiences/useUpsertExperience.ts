import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UpsertExperienceParams } from '@/types/global';

export const useUpsertExperience = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isError, isPending, error, ...rest } = useMutation({
        mutationFn: async (params: UpsertExperienceParams) => {
            const response = await axios.put(
                `/api/experiences/${params.id || 'add'}`,
                params,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data;
        },
        onSuccess: (_data, params) => {
            toast.success(
                params.id ? 'Experience updated!' : 'Experience added!'
            );
            queryClient.invalidateQueries({ queryKey: ['experiences'] });
            onSuccessCallback?.();
        },
        onError: (_data, params) => {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.error ||
                    (params.id
                        ? 'Failed to update experience'
                        : 'Failed to add experience');
                toast.error(errorMessage);
            } else {
                toast.error('Something went wrong');
            }
        },
    });

    return {
        upsertExperience: mutateAsync,
        isLoading: isPending,
        isError,
        error,
        ...rest,
    };
};
