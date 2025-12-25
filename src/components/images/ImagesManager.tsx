'use client';
import { useEffect, useState } from 'react';
import { ComponentLoader } from '../loaders/ComponentLoader';
import { Copy, Check, Trash2 } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { ConfirmationModal } from '../modals/ConfirmationModal';
import { useModal } from '@/hooks/useModal';
import { ImageModal } from '../modals/ImageModal';
import { useImages } from '@/hooks/images/useImages';
import { useDeleteImage } from '@/hooks/images/useDeleteImage';

export const ImagesManager = () => {
    const { openModal, closeModal, isOpen } = useModal();
    const { images, isLoading, error, isError } = useImages();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const { deleteImage, isLoading: isDeleting } = useDeleteImage();

    useEffect(() => {
        if (error || isError) {
            toast.error('Failed to load images');
        }
    }, [error, isError]);

    const handleAdd = () => {
        openModal('images');
    };

    const handleDelete = (id: string) => {
        openModal('confirm');
        setDeleteTargetId(id);
    };

    const confirmDelete = async () => {
        if (deleteTargetId) {
            await deleteImage(deleteTargetId);
        }
        setDeleteTargetId(null);
        closeModal();
    };

    const copyToClipboard = async (url: string, id: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedId(id);
            toast.success('URL copied to clipboard!');
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy URL');
        }
    };

    return (
        <>
            <div className="w-full flex justify-end">
                <button
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                    disabled={isLoading}
                    onClick={() => handleAdd()}
                >
                    <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9 1.5C9.27614 1.5 9.5 1.72386 9.5 2V8.5H16C16.2761 8.5 16.5 8.72386 16.5 9C16.5 9.27614 16.2761 9.5 16 9.5H9.5V16C9.5 16.2761 9.27614 16.5 9 16.5C8.72386 16.5 8.5 16.2761 8.5 16V9.5H2C1.72386 9.5 1.5 9.27614 1.5 9C1.5 8.72386 1.72386 8.5 2 8.5H8.5V2C8.5 1.72386 8.72386 1.5 9 1.5Z"
                            fill="currentColor"
                        />
                    </svg>
                    Add New Image
                </button>
            </div>
            <div className="flex gap-6 flex-wrap justify-center w-full pt-5">
                {isLoading ? (
                    <div className="w-full flex justify-center">
                        <ComponentLoader />
                    </div>
                ) : images.length > 0 ? (
                    images.map((image) => (
                        <div
                            key={image.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative group"
                        >
                            <div className="aspect-video w-full overflow-hidden bg-gray-100 relative h-64">
                                <Image
                                    src={image.url}
                                    alt={`Image ${image.id}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover"
                                />
                            </div>
                            <button
                                onClick={() =>
                                    copyToClipboard(image.url, image.id)
                                }
                                className="absolute top-3 right-3 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white transition-all shadow-md"
                            >
                                {copiedId === image.id ? (
                                    <>
                                        <Check size={16} />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} />
                                        Copy URL
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => handleDelete(image.id)}
                                className="absolute top-3 left-3 p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow-md"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center w-full py-10 border-2 border-dashed border-gray-300 rounded-xl dark:border-gray-700">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-12 h-12 text-gray-400 mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            No images added yet
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            Click the &quot;Add New Image&quot; button to add
                            one.
                        </p>
                    </div>
                )}
            </div>
            <ImageModal isOpen={isOpen('images')} closeModal={closeModal} />

            <ConfirmationModal
                isOpen={isOpen('confirm')}
                closeModal={() => {
                    setDeleteTargetId(null);
                    closeModal();
                }}
                title="Delete Image"
                description="Are you sure you want to delete this Image? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={confirmDelete}
                loading={isDeleting}
            />
        </>
    );
};
