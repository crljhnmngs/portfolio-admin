'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    localizedInfoSchema,
    LocalizedInfoFormData,
} from '@/utils/validation/localizedInfoSchema';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import RichTextEditor from '../editor/RichTextEditor';
import { useUpsertLocalizedInfo } from '@/hooks/localizedInfo/useUpsertLocalizedInfo';
import { LocalizedInfo } from '@/types/global';
import { useGeneralInfoContext } from '@/contexts/GeneralInfoContext';

type LocalizedInfoModalProps = {
    isOpen: boolean;
    closeModal: () => void;
    selectedLang: string;
    initialData: LocalizedInfo | null;
    isLoading?: boolean;
};

export const LocalizedInfoModal = ({
    isOpen,
    closeModal,
    selectedLang,
    initialData,
    isLoading = false,
}: LocalizedInfoModalProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isDirty },
    } = useForm<LocalizedInfoFormData>({
        resolver: zodResolver(localizedInfoSchema),
        defaultValues: {
            name: '',
            address: '',
            current_company: '',
            current_role: '',
            about: '',
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.full_name ?? '',
                address: initialData.address ?? '',
                current_company: initialData.current_company ?? '',
                current_role: initialData.current_role ?? '',
                about: initialData.about_me ?? '',
            });
        }
    }, [initialData, reset]);

    const handleClose = () => {
        reset();
        closeModal();
    };

    const { upsertLocalizedInfo, isLoading: isSaving } =
        useUpsertLocalizedInfo(handleClose);

    const { generalInfo } = useGeneralInfoContext();

    const onSubmit = async (data: LocalizedInfoFormData) => {
        const generalInfoId = initialData?.general_info_id || generalInfo?.id;
        if (!generalInfoId) return;
        await upsertLocalizedInfo({
            generalInfoId,
            languageCode: selectedLang,
            data,
        });
    };

    const aboutValue = watch('about');

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            className="max-w-[700px] m-4"
        >
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Edit Localized Info ({selectedLang.toUpperCase()})
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Update localized content specific to your selected
                        language.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col"
                >
                    <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                        <div>
                            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                Localized Fields
                            </h5>

                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Name</Label>
                                    <Input
                                        type="text"
                                        placeholder="Your name"
                                        register={register('name')}
                                        error={!!errors.name}
                                        hint={errors.name?.message || ''}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Address</Label>
                                    <Input
                                        type="text"
                                        placeholder="Your address"
                                        register={register('address')}
                                        error={!!errors.address}
                                        hint={errors.address?.message || ''}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Current Company</Label>
                                    <Input
                                        type="text"
                                        placeholder="Your current company"
                                        register={register('current_company')}
                                        error={!!errors.current_company}
                                        hint={
                                            errors.current_company?.message ||
                                            ''
                                        }
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Current Role</Label>
                                    <Input
                                        type="text"
                                        placeholder="Your current role"
                                        register={register('current_role')}
                                        error={!!errors.current_role}
                                        hint={
                                            errors.current_role?.message || ''
                                        }
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label>About</Label>
                                    <RichTextEditor
                                        value={aboutValue}
                                        onChange={(val: string) =>
                                            setValue('about', val, {
                                                shouldDirty: true,
                                            })
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
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={!isDirty || isLoading || isSaving}
                        >
                            {isLoading || isSaving
                                ? 'Saving...'
                                : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
