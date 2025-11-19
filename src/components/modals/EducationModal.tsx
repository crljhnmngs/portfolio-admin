'use client';

import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import {
    educationSchema,
    EducationFormData,
} from '@/utils/validation/educationSchema';
import { Education } from '@/types/global';
import MonthYearPicker from '../common/MonthYearPicker';
import { useUpsertEducation } from '@/hooks/educations/useUpsertEducation';

type EducationModalProps = {
    isOpen: boolean;
    closeModal: () => void;
    selectedLang: string;
    initialData: Education | null;
    isLoading?: boolean;
};

export const EducationModal = ({
    isOpen,
    closeModal,
    selectedLang,
    initialData,
    isLoading = false,
}: EducationModalProps) => {
    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isDirty },
    } = useForm<EducationFormData>({
        resolver: zodResolver(educationSchema),
        defaultValues: initialData || {
            school: '',
            track: '',
            course: '',
            start_date: '',
            end_date: '',
            tech: [],
        },
    });

    const techValues =
        useWatch({
            control,
            name: 'tech',
        }) || [];

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
        if (isOpen)
            reset(
                initialData || {
                    school: '',
                    track: '',
                    course: '',
                    start_date: '',
                    end_date: '',
                    tech: [],
                }
            );
    }, [isOpen, initialData, reset]);

    const handleClose = () => {
        reset({
            school: '',
            track: '',
            course: '',
            start_date: '',
            end_date: '',
            tech: [],
        });
        closeModal();
    };

    const { upsertEducation, isLoading: isSaving } =
        useUpsertEducation(handleClose);

    const onSubmit = async (data: EducationFormData) => {
        await upsertEducation({
            id: initialData?.id ?? '',
            languageCode: selectedLang,
            data,
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-3xl m-4">
            <div className="no-scrollbar relative w-full max-w-[800px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        {initialData ? 'Edit Education' : 'Add Education'}
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        {initialData
                            ? 'Update this education.'
                            : 'Add a new education to your portfolio.'}
                    </p>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 "
                >
                    <div className="custom-scrollbar h-[450px] overflow-y-auto w-full px-2 pb-3 space-y-5">
                        <div className="col-span-2 lg:col-span-1">
                            <Label>School</Label>
                            <Input
                                type="text"
                                placeholder="Your school name"
                                register={register('school')}
                                error={!!errors.school}
                                hint={errors.school?.message || ''}
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Track</Label>
                            <Input
                                type="text"
                                placeholder="e.g. College, Senior High School"
                                register={register('track')}
                                error={!!errors.track}
                                hint={errors.track?.message || ''}
                            />
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <Label>Course / Program</Label>
                            <Input
                                type="text"
                                placeholder="Your course or program"
                                register={register('course')}
                                error={!!errors.course}
                                hint={errors.course?.message || ''}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2 lg:col-span-1">
                                <Label>Start Date</Label>
                                <MonthYearPicker
                                    id="start_date"
                                    placeholder="Your Start Date"
                                    register={register('start_date')}
                                    setValue={setValue}
                                    error={!!errors.start_date}
                                    hint={errors.start_date?.message || ''}
                                />
                            </div>
                            <div className="col-span-2 lg:col-span-1">
                                <Label>End Date</Label>
                                <MonthYearPicker
                                    id="end_date"
                                    placeholder="Your End Date"
                                    register={register('end_date')}
                                    setValue={setValue}
                                    error={!!errors.end_date}
                                    hint={errors.end_date?.message || ''}
                                    allowPresent={true}
                                />
                            </div>
                        </div>
                        <div className="col-span-2 lg:col-span-1">
                            <Label>School Logo URL</Label>
                            <Input
                                type="text"
                                placeholder="Enter School Logo URL"
                                register={register('logo_url')}
                                error={!!errors.logo_url}
                                hint={errors.logo_url?.message || ''}
                            />
                        </div>
                        {/* Tech Stack */}
                        <div>
                            <Label>Technologies Learned</Label>
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
                                            placeholder="e.g. React, JavaScript"
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
                        <Button
                            size="sm"
                            type="submit"
                            disabled={!isDirty || isLoading || isSaving}
                        >
                            {isLoading || isSaving ? (
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
