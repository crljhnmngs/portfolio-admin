import { useQuery } from '@tanstack/react-query';
import { getGeneralInfo } from '@/utils/supabase/queries/getGeneralInfo';
import { GeneralInfoResponse } from '@/types/global';

export const useGeneralInfo = () => {
    const {
        data: generalInfo,
        isLoading,
        error,
        ...rest
    } = useQuery<GeneralInfoResponse, Error>({
        queryKey: ['general-info'],
        queryFn: getGeneralInfo,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
        generalInfo,
        isLoading,
        error,
        ...rest,
    };
};
