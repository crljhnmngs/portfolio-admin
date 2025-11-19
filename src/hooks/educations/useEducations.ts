import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { EducationsApiResponse } from '@/types/global';

export const useEducations = (languageCode: string) => {
    const { data, isLoading, isError, error, ...rest } = useQuery<
        EducationsApiResponse,
        Error
    >({
        queryKey: ['educations', languageCode],
        queryFn: async () => {
            const response = await axios.get<EducationsApiResponse>(
                '/api/educations',
                {
                    params: { languageCode },
                }
            );
            return response.data;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
    return {
        educations: data?.educations ?? [],
        isLoading,
        isError,
        error,
        ...rest,
    };
};
