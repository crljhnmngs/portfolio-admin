import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ImagesApiResponse } from '@/types/global';

export const useImages = () => {
    const { data, isLoading, isError, error, ...rest } = useQuery<
        ImagesApiResponse,
        Error
    >({
        queryKey: ['images'],
        queryFn: async () => {
            const response = await axios.get<ImagesApiResponse>('/api/images');
            return response.data;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
        images: data?.images ?? [],
        isLoading,
        isError,
        error,
        ...rest,
    };
};
