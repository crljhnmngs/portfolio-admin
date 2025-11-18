'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skillSchema, SkillFormData } from '@/utils/validation/skillSchema';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { useUpsertSkill } from '@/hooks/skills/useUpsertSkill';
import { Skill } from '@/types/global';

type SkillModalProps = {
    isOpen: boolean;
    closeModal: () => void;
    initialData: Skill | null;
    isLoading?: boolean;
};

export const SkillModal = ({
    isOpen,
    closeModal,
    initialData,
}: SkillModalProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<SkillFormData>({
        resolver: zodResolver(skillSchema),
        defaultValues: {
            name: '',
            icon_url: '',
            category: '',
        },
    });

    useEffect(() => {
        if (isOpen) {
            reset({
                name: initialData?.name ?? '',
                icon_url: initialData?.icon_url ?? '',
                category: initialData?.category ?? '',
            });
        }
    }, [isOpen, initialData, reset]);

    const handleClose = () => {
        reset({
            name: initialData?.name ?? '',
            icon_url: initialData?.icon_url ?? '',
            category: initialData?.category ?? '',
        });
        closeModal();
    };

    const { upsertSkill, isLoading: isSaving } = useUpsertSkill(handleClose);

    const onSubmit = async (data: SkillFormData) => {
        await upsertSkill({
            id: initialData?.id ?? '',
            name: data.name,
            icon_url: data.icon_url,
            category: data.category,
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
                        {initialData ? `Edit Skill` : `Add Skill`}
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        {initialData
                            ? 'Update this skill.'
                            : 'Add a new skill to your portfolio.'}
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col"
                >
                    <div className="px-2 pb-3 space-y-3">
                        <div>
                            <Label>Skill Name</Label>
                            <Input
                                type="text"
                                placeholder="Enter skill name"
                                register={register('name')}
                                error={!!errors.name}
                                hint={errors.name?.message || ''}
                            />
                        </div>

                        <div>
                            <Label>Icon URL</Label>
                            <Input
                                type="text"
                                placeholder="Enter icon URL"
                                register={register('icon_url')}
                                error={!!errors.icon_url}
                                hint={errors.icon_url?.message || ''}
                            />
                        </div>

                        <div>
                            <Label>Category</Label>
                            <Input
                                type="text"
                                placeholder="Enter category (e.g. Frontend, Backend)"
                                register={register('category')}
                                error={!!errors.category}
                                hint={errors.category?.message || ''}
                            />
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
                            disabled={!isDirty || isSaving}
                        >
                            {isSaving
                                ? 'Saving...'
                                : initialData
                                ? 'Save Changes'
                                : 'Add Skill'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
