import { UpsertSkillParams } from '@/types/global';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useUpsertSkill = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isError, isPending, error, ...rest } = useMutation({
        mutationFn: async (params: UpsertSkillParams) => {
            const response = await axios.put(
                `/api/skills/${params.id || 'add'}`,
                params,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data;
        },
        onSuccess: (_data, params) => {
            if (params.id) {
                toast.success('Skill updated');
            } else {
                toast.success('Skill added');
            }
            queryClient.invalidateQueries({ queryKey: ['skills'] });
            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },
        onError: (_data, params) => {
            if (params.id) {
                toast.error('Failed to update skill');
            } else {
                toast.error('Failed to add skill');
            }
        },
    });

    return {
        upsertSkill: mutateAsync,
        isLoading: isPending,
        isError,
        error,
        ...rest,
    };
};
