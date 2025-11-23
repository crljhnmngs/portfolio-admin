import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpsertRoleParams } from '@/types/global';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useUpsertRole = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isError, isPending, error, ...rest } = useMutation({
        mutationFn: async (params: UpsertRoleParams) => {
            const response = await axios.put(
                `/api/roles/${params.generalInfoId}`,
                params
            );
            return response.data;
        },
        onSuccess: (_data, params) => {
            if (params.id) {
                toast.success('Role updated');
            } else {
                toast.success('Role added');
            }
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },
        onError: (_data, params) => {
            if (params.id) {
                toast.error('Failed to update role');
            } else {
                toast.error('Failed to add role');
            }
        },
    });

    return {
        upsertRole: mutateAsync,
        isLoading: isPending,
        isError,
        error,
        ...rest,
    };
};
