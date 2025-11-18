import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SkillsApiResponse } from '@/types/global';

export const useSkills = () => {
    const { data, isLoading, isError, error, ...rest } = useQuery<
        SkillsApiResponse,
        Error
    >({
        queryKey: ['skills'],
        queryFn: async () => {
            const response = await axios.get<SkillsApiResponse>('/api/skills');
            return response.data;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
        skills: data?.skills ?? [],
        isLoading,
        isError,
        error,
        ...rest,
    };
};
