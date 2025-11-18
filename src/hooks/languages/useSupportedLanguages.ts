import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SupportedLanguagesApiResponse } from '@/types/global';

export const useSupportedLanguages = () => {
    const { data, isLoading, isError, error, ...rest } = useQuery<
        SupportedLanguagesApiResponse,
        Error
    >({
        queryKey: ['supported-languages'],
        queryFn: async () => {
            const response = await axios.get<SupportedLanguagesApiResponse>(
                '/api/supported-languages'
            );
            return response.data;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
        supportedLanguages: data?.supportedLanguages ?? [],
        isLoading,
        isError,
        error,
        ...rest,
    };
};
