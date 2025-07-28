import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upsertLocalizedInfo } from '@/utils/supabase/mutations/localizedInfo';
import toast from 'react-hot-toast';
import { UpsertLocalizedInfoParams } from '@/types/global';

export const useUpsertLocalizedInfo = () => {
    const queryClient = useQueryClient();

    const { mutateAsync, isError, isPending, isSuccess, error, ...rest } =
        useMutation({
            mutationFn: (params: UpsertLocalizedInfoParams) =>
                upsertLocalizedInfo(params),
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
