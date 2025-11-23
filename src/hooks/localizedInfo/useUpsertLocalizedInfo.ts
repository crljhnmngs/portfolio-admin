import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpsertLocalizedInfoParams } from '@/types/global';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useUpsertLocalizedInfo = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isError, isPending, error, ...rest } = useMutation({
        mutationFn: async (params: UpsertLocalizedInfoParams) => {
            const response = await axios.put(
                `/api/localized-info/${params.generalInfoId}`,
                params
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success('Localized info updated');
            queryClient.invalidateQueries({ queryKey: ['localized-info'] });
            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },
        onError: () => {
            toast.error('Failed to update localized info');
        },
    });

    return {
        upsertLocalizedInfo: mutateAsync,
        isLoading: isPending,
        isError,
        error,
        ...rest,
    };
};
