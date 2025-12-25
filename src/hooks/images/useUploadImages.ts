import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

type UploadImagesParams = {
    files: File[];
};

export const useUploadImages = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isError, isPending, error, ...rest } = useMutation({
        mutationFn: async (params: UploadImagesParams) => {
            const formData = new FormData();

            params.files.forEach((file) => {
                formData.append('images', file);
            });

            const response = await axios.post('/api/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        },
        onSuccess: (data) => {
            const count = data.images?.length || 0;
            toast.success(
                count === 1 ? 'Image uploaded!' : `${count} images uploaded!`
            );
            queryClient.invalidateQueries({ queryKey: ['images'] });
            onSuccessCallback?.();
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.error || 'Failed to upload images';
                toast.error(errorMessage);
            } else {
                toast.error('Something went wrong');
            }
        },
    });

    return {
        uploadImages: mutateAsync,
        isLoading: isPending,
        isError,
        error,
        ...rest,
    };
};
