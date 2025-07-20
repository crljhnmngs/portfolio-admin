import { useQuery } from '@tanstack/react-query';
import { getSupportedLanguages } from '@/utils/supabase/queries/getSupportedLanguages';
import { SupportedLanguagesResponse } from '@/types/global';

export const useSupportedLanguages = () => {
    const {
        data: supportedLanguages,
        isLoading,
        error,
        ...rest
    } = useQuery<SupportedLanguagesResponse, Error>({
        queryKey: ['supported-languages'],
        queryFn: getSupportedLanguages,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
        supportedLanguages,
        isLoading,
        error,
        ...rest,
    };
};
