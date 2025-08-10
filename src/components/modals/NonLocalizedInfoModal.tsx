'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    generalInfoSchema,
    GeneralInfoFormData,
} from '@/utils/validation/generalInfoSchema';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { GeneralInfoResponse } from '@/types/global';
import { useUpsertGeneralInfo } from '@/hooks/useUpsertGeneralInfo';

type NonLocalizedInfoModalProps = {
    isOpen: boolean;
    closeModal: () => void;
    initialData: GeneralInfoResponse | null;
};

export const NonLocalizedInfoModal = ({
    isOpen,
    closeModal,
    initialData,
}: NonLocalizedInfoModalProps) => {
    const { upsertGeneralInfo, isLoading } = useUpsertGeneralInfo();
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
    } = useForm<GeneralInfoFormData>({
        resolver: zodResolver(generalInfoSchema),
        defaultValues: {
            github: '',
            linkedin: '',
            facebook: '',
            instagram: '',
            x: '',
            email: '',
            resumeUrl: '',
            scheduleLink: '',
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                github: initialData.socialLinks.github ?? '',
                linkedin: initialData.socialLinks.linkedin ?? '',
                facebook: initialData.socialLinks.facebook ?? '',
                instagram: initialData.socialLinks.instagram ?? '',
                x: initialData.socialLinks.x ?? '',
                email: initialData.email ?? '',
                resumeUrl: initialData.resumeUrl ?? '',
                scheduleLink: initialData.scheduleLink ?? '',
            });
        }
    }, [initialData, reset]);

    const onSubmit = async (data: GeneralInfoFormData) => {
        if (!initialData?.id) return;

        try {
            await upsertGeneralInfo({ data, id: initialData.id });
            closeModal();
        } catch {}
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                reset();
                closeModal();
            }}
            className="max-w-[700px] m-4"
        >
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Edit Personal Information
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Update your details to keep your portfolio up-to-date.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col"
                >
                    <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3 space-y-8">
                        <div>
                            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                Social Links
                            </h5>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Github</Label>
                                    <Input
                                        placeholder="https://github.com/your-username"
                                        type="text"
                                        register={register('github')}
                                        error={!!errors.github}
                                        hint={
                                            errors.github
                                                ? errors.github.message
                                                : ''
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>LinkedIn</Label>
                                    <Input
                                        placeholder="https://linkedin.com/in/your-name"
                                        type="text"
                                        register={register('linkedin')}
                                        error={!!errors.linkedin}
                                        hint={errors.linkedin?.message || ''}
                                    />
                                </div>
                                <div>
                                    <Label>Facebook</Label>
                                    <Input
                                        placeholder="https://facebook.com/your-profile"
                                        type="text"
                                        register={register('facebook')}
                                        error={!!errors.facebook}
                                        hint={errors.facebook?.message || ''}
                                    />
                                </div>
                                <div>
                                    <Label>Instagram</Label>
                                    <Input
                                        placeholder="https://instagram.com/your-handle"
                                        type="text"
                                        register={register('instagram')}
                                        error={!!errors.instagram}
                                        hint={errors.instagram?.message || ''}
                                    />
                                </div>
                                <div>
                                    <Label>X.com</Label>
                                    <Input
                                        placeholder="https://x.com/your-handle"
                                        type="text"
                                        register={register('x')}
                                        error={!!errors.x}
                                        hint={errors.x?.message || ''}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                Non-Localized Info
                            </h5>
                            <div className="grid grid-cols-1 gap-y-5 lg:grid-cols-2 lg:gap-x-6">
                                <div className="lg:col-span-2">
                                    <Label>Email Address</Label>
                                    <Input
                                        placeholder="Enter your email"
                                        type="email"
                                        register={register('email')}
                                        error={!!errors.email}
                                        hint={errors.email?.message || ''}
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <Label>Resume Link</Label>
                                    <Input
                                        placeholder="Paste your resume URL"
                                        type="text"
                                        register={register('resumeUrl')}
                                        error={!!errors.resumeUrl}
                                        hint={errors.resumeUrl?.message || ''}
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <Label>Schedule Meeting Link</Label>
                                    <Input
                                        placeholder="Paste your meeting scheduler link"
                                        type="text"
                                        register={register('scheduleLink')}
                                        error={!!errors.scheduleLink}
                                        hint={
                                            errors.scheduleLink?.message || ''
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                reset();
                                closeModal();
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={!isDirty || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="text-gray-200 animate-spin stroke-brand-500 dark:text-gray-800">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <circle
                                                cx="10"
                                                cy="10"
                                                r="8.75"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                            />
                                            <mask
                                                id="path-2-inside-1_3755_26477"
                                                fill="white"
                                            >
                                                <path d="M18.2372 12.9506C18.8873 13.1835 19.6113 12.846 19.7613 12.1719C20.0138 11.0369 20.0672 9.86319 19.9156 8.70384C19.7099 7.12996 19.1325 5.62766 18.2311 4.32117C17.3297 3.01467 16.1303 1.94151 14.7319 1.19042C13.7019 0.637155 12.5858 0.270357 11.435 0.103491C10.7516 0.00440265 10.179 0.561473 10.1659 1.25187C10.1528 1.94226 10.7059 2.50202 11.3845 2.6295C12.1384 2.77112 12.8686 3.02803 13.5487 3.39333C14.5973 3.95661 15.4968 4.76141 16.1728 5.74121C16.8488 6.721 17.2819 7.84764 17.4361 9.02796C17.5362 9.79345 17.5172 10.5673 17.3819 11.3223C17.2602 12.002 17.5871 12.7178 18.2372 12.9506Z" />
                                            </mask>
                                            <path
                                                d="M18.2372 12.9506C18.8873 13.1835 19.6113 12.846 19.7613 12.1719C20.0138 11.0369 20.0672 9.86319 19.9156 8.70384C19.7099 7.12996 19.1325 5.62766 18.2311 4.32117C17.3297 3.01467 16.1303 1.94151 14.7319 1.19042C13.7019 0.637155 12.5858 0.270357 11.435 0.103491C10.7516 0.00440265 10.179 0.561473 10.1659 1.25187C10.1528 1.94226 10.7059 2.50202 11.3845 2.6295C12.1384 2.77112 12.8686 3.02803 13.5487 3.39333C14.5973 3.95661 15.4968 4.76141 16.1728 5.74121C16.8488 6.721 17.2819 7.84764 17.4361 9.02796C17.5362 9.79345 17.5172 10.5673 17.3819 11.3223C17.2602 12.002 17.5871 12.7178 18.2372 12.9506Z"
                                                stroke="currentStroke"
                                                strokeWidth="4"
                                                mask="url(#path-2-inside-1_3755_26477)"
                                            />
                                        </svg>
                                    </span>
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
