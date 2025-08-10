import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GeneralInfoResponse } from '@/types/global';

export const useGeneralInfo = () => {
    const {
        data: generalInfo,
        isLoading,
        error,
        ...rest
    } = useQuery<GeneralInfoResponse, Error>({
        queryKey: ['general-info'],
        queryFn: async () => {
            const response = await axios.get('/api/general-info');
            return response.data.generalInfo as GeneralInfoResponse;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
        generalInfo,
        isLoading,
        error,
        ...rest,
    };
};
