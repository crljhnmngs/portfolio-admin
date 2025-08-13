import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RolesApiResponse } from '@/types/global';

export const useRoles = (languageCode: string) => {
    const { data, isLoading, isError, error, ...rest } = useQuery<
        RolesApiResponse,
        Error
    >({
        queryKey: ['roles', languageCode],
        queryFn: async () => {
            const response = await axios.get<RolesApiResponse>('/api/roles', {
                params: { languageCode },
            });
            return response.data;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
        roles: data?.roles ?? [],
        isLoading,
        isError,
        error,
        ...rest,
    };
};
