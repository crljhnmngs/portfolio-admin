'use client';

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { useUploadImages } from '@/hooks/images/useUploadImages';

type ImageModalProps = {
    isOpen: boolean;
    closeModal: () => void;
    isLoading?: boolean;
};

export const ImageModal = ({ isOpen, closeModal }: ImageModalProps) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const onDrop = (acceptedFiles: File[]) => {
        setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/png': [],
            'image/jpeg': [],
            'image/webp': [],
            'image/svg+xml': [],
            'image/gif': [],
        },
        multiple: true,
    });

    const removeFile = (indexToRemove: number) => {
        setSelectedFiles((prev) =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleClose = () => {
        setSelectedFiles([]);
        closeModal();
    };

    const { uploadImages, isLoading } = useUploadImages(handleClose);

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error('Please select at least one image');
            return;
        }

        await uploadImages({ files: selectedFiles });
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-150 m-4">
            <div className="relative w-full max-w-150 rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Upload Images
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Upload images to your portfolio.
                    </p>
                </div>

                <div className="px-2 pb-3">
                    <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
                        <div
                            {...getRootProps()}
                            className={`dropzone rounded-xl border-dashed p-7 lg:p-10 transition-colors
                                ${
                                    isDragActive
                                        ? 'border-brand-500 bg-gray-100 dark:bg-gray-800'
                                        : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
                                }
                            `}
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center m-0">
                                <div className="mb-5.5 flex justify-center">
                                    <div className="flex h-17 w-17 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                        <svg
                                            className="fill-current"
                                            width="29"
                                            height="28"
                                            viewBox="0 0 29 28"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                                    {isDragActive
                                        ? 'Drop Files Here'
                                        : 'Drag & Drop Files Here'}
                                </h4>
                                <span className="text-center mb-5 block w-full max-w-72.5 text-sm text-gray-700 dark:text-gray-400">
                                    Drag and drop your PNG, JPG, WebP, SVG
                                    images here or browse
                                </span>
                                <span className="font-medium underline text-theme-sm text-brand-500">
                                    Browse File
                                </span>
                            </div>
                        </div>
                    </div>

                    {selectedFiles.length > 0 && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Selected Files ({selectedFiles.length})
                            </p>
                            <ul className="space-y-2">
                                {selectedFiles.map((file, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 p-2 rounded"
                                    >
                                        <span className="truncate flex-1">
                                            {file.name} (
                                            {(file.size / 1024).toFixed(2)} KB)
                                        </span>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                            title="Remove file"
                                        >
                                            <X
                                                size={16}
                                                className="text-red-500"
                                            />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button size="sm" variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        type="button"
                        onClick={handleUpload}
                        disabled={selectedFiles.length === 0 || isLoading}
                    >
                        {isLoading ? 'Uploading...' : 'Upload Images'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
