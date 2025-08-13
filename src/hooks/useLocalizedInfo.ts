import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LocalizedInfoApiResponse } from '@/types/global';

export const useLocalizedInfo = (
    generalInfoId: string,
    languageCode: string
) => {
    const { data, isLoading, isError, error, ...rest } = useQuery<
        LocalizedInfoApiResponse,
        Error
    >({
        queryKey: ['localized-info', generalInfoId, languageCode],
        queryFn: async () => {
            const response = await axios.get<LocalizedInfoApiResponse>(
                '/api/localized-info',
                { params: { generalInfoId, languageCode } }
            );
            return response.data;
        },
        enabled: Boolean(generalInfoId && languageCode),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
        localizedInfo: data?.localizedInfo ?? null,
        isLoading,
        isError,
        error,
        ...rest,
    };
};
