import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GeneralInfoApiResponse } from '@/types/global';

export const useGeneralInfo = () => {
    const { data, isLoading, error, ...rest } = useQuery<
        GeneralInfoApiResponse,
        Error
    >({
        queryKey: ['general-info'],
        queryFn: async () => {
            const response = await axios.get<GeneralInfoApiResponse>(
                '/api/general-info'
            );
            return response.data;
        },
        staleTime: 10 * 60 * 1000,
    });

    return {
        generalInfo: data?.generalInfo ?? null,
        isLoading,
        error,
        ...rest,
    };
};
