'use client';

import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    projectSchema,
    ProjectFormData,
} from '@/utils/validation/projectSchema';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { Projects } from '@/types/global';
import MonthYearPicker from '../common/MonthYearPicker';
import Checkbox from '../form/input/Checkbox';
import TextArea from '../form/input/TextArea';

type ProjectModalProps = {
    isOpen: boolean;
    closeModal: () => void;
    initialData: Projects | null;
    isLoading?: boolean;
};

export const ProjectModal = ({
    isOpen,
    closeModal,
    initialData,
}: ProjectModalProps) => {
    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isDirty },
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: '',
            image: '',
            about: '',
            date: '',
            github: '',
            live: '',
            new: false,
            dev: false,
            tech: [],
        },
    });

    const techValues =
        useWatch({
            control,
            name: 'tech',
        }) || [];

    const isNew = watch('new') ?? false;
    const isDev = watch('dev') ?? false;

    const addTech = () => {
        setValue('tech', [...techValues, '']);
    };

    const removeTech = (index: number) => {
        setValue(
            'tech',
            techValues.filter((_, i) => i !== index)
        );
    };

    useEffect(() => {
        if (isOpen) {
            reset({
                name: initialData?.name ?? '',
                image: initialData?.image_url ?? '',
                about: initialData?.about ?? '',
                date: initialData?.date ?? '',
                github: initialData?.links?.github ?? '',
                live: initialData?.links?.live ?? '',
                new: initialData?.new ?? false,
                dev: initialData?.dev ?? false,
                tech: initialData?.tech ?? [],
            });
        }
    }, [isOpen, initialData, reset]);

    const handleClose = () => {
        reset({
            name: '',
            image: '',
            about: '',
            date: '',
            github: '',
            live: '',
            new: false,
            dev: false,
            tech: [],
        });
        closeModal();
    };

    const onSubmit = async (data: ProjectFormData) => {
        console.log('Project data:', data);
        // Will add upsert logic later
        handleClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-3xl m-4">
            <div className="no-scrollbar relative w-full max-w-[800px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        {initialData ? 'Edit Project' : 'Add Project'}
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        {initialData
                            ? 'Update this project.'
                            : 'Add a new project to your portfolio.'}
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <div className="custom-scrollbar h-[450px] overflow-y-auto w-full px-2 pb-3 space-y-5">
                        <div className="col-span-2 lg:col-span-1">
                            <Label>Project Name</Label>
                            <Input
                                type="text"
                                placeholder="Enter project name"
                                register={register('name')}
                                error={!!errors.name}
                                hint={errors.name?.message || ''}
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Project Image URL</Label>
                            <Input
                                type="text"
                                placeholder="Enter project image URL"
                                register={register('image')}
                                error={!!errors.image}
                                hint={errors.image?.message || ''}
                            />
                        </div>

                        <div className="col-span-2">
                            <Label>About Project</Label>
                            <TextArea
                                placeholder="Enter project description"
                                rows={4}
                                register={register('about')}
                                error={!!errors.about}
                                hint={errors.about?.message || ''}
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Project Date</Label>
                            <MonthYearPicker
                                id="date"
                                placeholder="Select project date"
                                register={register('date')}
                                setValue={setValue}
                                error={!!errors.date}
                                hint={errors.date?.message || ''}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            <div>
                                <Label>GitHub URL (Optional)</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter GitHub repository URL"
                                    register={register('github')}
                                    error={!!errors.github}
                                    hint={errors.github?.message || ''}
                                />
                            </div>
                            <div>
                                <Label>Live Demo URL (Optional)</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter live demo URL"
                                    register={register('live')}
                                    error={!!errors.live}
                                    hint={errors.live?.message || ''}
                                />
                            </div>
                        </div>

                        <div className="col-span-2">
                            <Label>Project Status</Label>
                            <div className="flex gap-6 mt-2">
                                <Checkbox
                                    id="new"
                                    label="Mark as New"
                                    checked={isNew}
                                    onChange={(checked) =>
                                        setValue('new', checked, {
                                            shouldDirty: true,
                                        })
                                    }
                                />
                                <Checkbox
                                    id="dev"
                                    label="In Development"
                                    checked={isDev}
                                    onChange={(checked) =>
                                        setValue('dev', checked, {
                                            shouldDirty: true,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Technologies Used</Label>
                            {techValues.length > 0 ? (
                                techValues.map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-2 mb-2"
                                    >
                                        <Input
                                            register={register(
                                                `tech.${index}` as const
                                            )}
                                            placeholder="e.g. React, Node.js"
                                            error={!!errors?.tech?.[index]}
                                            hint={
                                                errors?.tech?.[index]
                                                    ?.message || ''
                                            }
                                        />
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() => removeTech(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    No technologies added yet
                                </p>
                            )}
                            {errors?.tech &&
                                'message' in errors.tech &&
                                errors.tech.message && (
                                    <p className="text-red-500 text-xs mt-1 mb-2">
                                        {errors.tech.message}
                                    </p>
                                )}
                            <Button type="button" onClick={addTech}>
                                + Add Technology
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end h-0">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                        <Button size="sm" type="submit" disabled={!isDirty}>
                            {initialData ? 'Save Changes' : 'Add Project'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
