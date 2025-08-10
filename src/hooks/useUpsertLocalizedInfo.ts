import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpsertLocalizedInfoParams } from '@/types/global';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useUpsertLocalizedInfo = () => {
    const queryClient = useQueryClient();

    const { mutateAsync, isError, isPending, isSuccess, error, ...rest } =
        useMutation({
            mutationFn: async (params: UpsertLocalizedInfoParams) => {
                const response = await axios.put(
                    `/api/localized-info/${params.generalInfoId}`,
                    params,
                    {
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
                return response.data;
            },
            onSuccess: () => {
                toast.success('Localized info updated');
                queryClient.invalidateQueries({ queryKey: ['localized-info'] });
            },
            onError: () => {
                toast.error('Failed to update localized info');
            },
        });

    return {
        upsertLocalizedInfo: mutateAsync,
        isLoading: isPending,
        isError,
        isSuccess,
        error,
        ...rest,
    };
};
