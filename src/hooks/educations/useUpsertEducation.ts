import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UpsertEducationParams } from '@/types/global';

export const useUpsertEducation = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isError, isPending, error, ...rest } = useMutation({
        mutationFn: async (params: UpsertEducationParams) => {
            const response = await axios.put(
                `/api/educations/${params.id || 'add'}`,
                params
            );
            return response.data;
        },
        onSuccess: (_data, params) => {
            toast.success(
                params.id ? 'Education updated!' : 'Education added!'
            );
            queryClient.invalidateQueries({ queryKey: ['educations'] });
            onSuccessCallback?.();
        },
        onError: (_data, params) => {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.error ||
                    (params.id
                        ? 'Failed to update education'
                        : 'Failed to add education');
                toast.error(errorMessage);
            } else {
                toast.error('Something went wrong');
            }
        },
    });

    return {
        upsertEducation: mutateAsync,
        isLoading: isPending,
        isError,
        error,
        ...rest,
    };
};
