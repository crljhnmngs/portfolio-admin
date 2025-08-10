import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SupportedLanguagesResponse } from '@/types/global';

export const useSupportedLanguages = () => {
    const {
        data: supportedLanguages,
        isLoading,
        error,
        ...rest
    } = useQuery<SupportedLanguagesResponse, Error>({
        queryKey: ['supported-languages'],
        queryFn: async () => {
            const response = await axios.get('/api/supported-languages');
            return response.data
                .supportedLanguages as SupportedLanguagesResponse;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
        supportedLanguages,
        isLoading,
        error,
        ...rest,
    };
};
