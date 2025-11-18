import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GeneralInfoFormData } from '@/utils/validation/generalInfoSchema';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useUpsertGeneralInfo = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isError, isPending, error, ...rest } = useMutation({
        mutationFn: async ({
            data,
            id,
        }: {
            data: GeneralInfoFormData;
            id: string;
        }) => {
            const response = await axios.put(`/api/general-info/${id}`, data, {
                headers: { 'Content-Type': 'application/json' },
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success('General info updated');
            queryClient.invalidateQueries({ queryKey: ['general-info'] });
            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },
        onError: () => {
            toast.error('Failed to update general info');
        },
    });

    return {
        upsertGeneralInfo: mutateAsync,
        isLoading: isPending,
        isError,
        error,
        ...rest,
    };
};
