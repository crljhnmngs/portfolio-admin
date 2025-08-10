import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LocalizedInfoResponse } from '@/types/global';

export const useLocalizedInfo = (
    generalInfoId: string,
    languageCode: string
) => {
    const {
        data: localizedInfo,
        isLoading,
        error,
        ...rest
    } = useQuery<LocalizedInfoResponse | null, Error>({
        queryKey: ['localized-info', generalInfoId, languageCode],
        queryFn: async () => {
            const response = await axios.get('/api/localized-info', {
                params: { generalInfoId, languageCode },
            });
            return response.data.localizedInfo as LocalizedInfoResponse | null;
        },
        enabled: !!generalInfoId && !!languageCode,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
        localizedInfo,
        isLoading,
        error,
        ...rest,
    };
};
