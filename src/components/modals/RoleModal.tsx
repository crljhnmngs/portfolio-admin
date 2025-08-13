'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleSchema, RoleFormData } from '@/utils/validation/roleSchema';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { useUpsertRole } from '@/hooks/useUpsertRole';
import { TranslatedRole } from '@/types/global';
import { useGeneralInfoContext } from '@/contexts/GeneralInfoContext';

type RoleModalProps = {
    isOpen: boolean;
    closeModal: () => void;
    selectedLang: string;
    initialData: TranslatedRole | null;
    isLoading?: boolean;
};

export const RoleModal = ({
    isOpen,
    closeModal,
    selectedLang,
    initialData,
}: RoleModalProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<RoleFormData>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            role_name: '',
        },
    });

    useEffect(() => {
        if (isOpen) {
            reset({
                role_name: initialData?.role_name ?? '',
            });
        }
    }, [isOpen, initialData, reset]);

    const handleClose = () => {
        reset({
            role_name: initialData?.role_name ?? '',
        });
        closeModal();
    };

    const { upsertRole, isLoading: isSaving } = useUpsertRole(handleClose);

    const { generalInfo } = useGeneralInfoContext();

    const onSubmit = async (data: RoleFormData) => {
        if (!generalInfo?.id) return;
        await upsertRole({
            id: initialData?.id ?? '',
            generalInfoId: generalInfo?.id,
            languageCode: selectedLang,
            roleName: data.role_name,
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            className="max-w-[500px] m-4"
        >
            <div className="relative w-full max-w-[500px] rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        {initialData
                            ? `Edit Role (${selectedLang.toUpperCase()})`
                            : `Add Role (${selectedLang.toUpperCase()})`}
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        {initialData
                            ? 'Update this role for the selected language.'
                            : 'Add a new role for the selected language.'}
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col"
                >
                    <div className="px-2 pb-3">
                        <Label>Role Name</Label>
                        <Input
                            type="text"
                            placeholder="Enter role name"
                            register={register('role_name')}
                            error={!!errors.role_name}
                            hint={errors.role_name?.message || ''}
                        />
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
                            disabled={!isDirty || isSaving}
                        >
                            {isSaving
                                ? 'Saving...'
                                : initialData
                                ? 'Save Changes'
                                : 'Add Role'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
