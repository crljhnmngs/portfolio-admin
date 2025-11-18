import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ExperiencesApiResponse } from '@/types/global';

export const useExperiences = (languageCode: string) => {
    const { data, isLoading, isError, error, ...rest } = useQuery<
        ExperiencesApiResponse,
        Error
    >({
        queryKey: ['experiences', languageCode],
        queryFn: async () => {
            const response = await axios.get<ExperiencesApiResponse>(
                '/api/experiences',
                {
                    params: { languageCode },
                }
            );
            return response.data;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
    return {
        experiences: data?.experiences ?? [],
        isLoading,
        isError,
        error,
        ...rest,
    };
};
