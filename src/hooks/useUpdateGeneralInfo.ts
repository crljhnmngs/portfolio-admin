import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateGeneralInfo } from '@/utils/supabase/mutations/updateGeneralInfo';
import { GeneralInfoFormData } from '@/utils/validation/generalInfoSchema';
import toast from 'react-hot-toast';

export const useUpdateGeneralInfo = () => {
    const queryClient = useQueryClient();

    const { mutateAsync, isError, isPending, isSuccess, error, ...rest } =
        useMutation({
            mutationFn: ({
                data,
                id,
            }: {
                data: GeneralInfoFormData;
                id: string;
            }) => updateGeneralInfo(data, id),
            onSuccess: () => {
                toast.success('General info updated');
                queryClient.invalidateQueries({ queryKey: ['general-info'] });
            },
            onError: () => {
                toast.error('Failed to update general info');
            },
        });

    return {
        updateGeneralInfo: mutateAsync,
        isLoading: isPending,
        isError,
        isSuccess,
        error,
        ...rest,
    };
};
