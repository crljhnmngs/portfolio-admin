import { useQuery } from '@tanstack/react-query';
import { getLocalizedInfo } from '@/utils/supabase/queries/getlocalizedInfo';
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
        queryFn: () => getLocalizedInfo({ generalInfoId, languageCode }),
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
