'use client';

import React from 'react';
import {
    Control,
    UseFormRegister,
    UseFormSetValue,
    useFieldArray,
    FieldErrors,
} from 'react-hook-form';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { ExperienceFormData } from '@/utils/validation/experienceSchema';
import MonthYearPicker from '../common/MonthYearPicker';
import Projects from './Projects';

type SubItemsProps = {
    control: Control<ExperienceFormData>;
    register: UseFormRegister<ExperienceFormData>;
    setValue: UseFormSetValue<ExperienceFormData>;
    errors: FieldErrors<ExperienceFormData>;
};

const SubItems = ({ control, register, setValue, errors }: SubItemsProps) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'sub_items',
    });

    return (
        <div>
            <Label>Sub Items</Label>
            {fields.map((subItem, subIndex) => (
                <div
                    key={subItem.id}
                    className="p-3 border rounded-xl space-y-3 mb-2"
                >
                    <div className="col-span-2 lg:col-span-1">
                        <Label>Position/Role</Label>
                        <Input
                            type="text"
                            register={register(
                                `sub_items.${subIndex}.position`
                            )}
                            placeholder="Enter Position/Role"
                            error={!!errors?.sub_items?.[subIndex]?.position}
                            hint={
                                errors?.sub_items?.[subIndex]?.position
                                    ?.message || ''
                            }
                        />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                        <Label>Work Setup</Label>
                        <Input
                            type="text"
                            register={register(`sub_items.${subIndex}.setup`)}
                            placeholder="Enter Work Setup"
                            error={!!errors?.sub_items?.[subIndex]?.setup}
                            hint={
                                errors?.sub_items?.[subIndex]?.setup?.message ||
                                ''
                            }
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 lg:col-span-1">
                            <Label>Start Date</Label>
                            <MonthYearPicker
                                id={`sub_items.${subIndex}.start_date`}
                                placeholder="Your Start Date"
                                register={register(
                                    `sub_items.${subIndex}.start_date`
                                )}
                                setValue={setValue}
                                error={
                                    !!errors?.sub_items?.[subIndex]?.start_date
                                }
                                hint={
                                    errors?.sub_items?.[subIndex]?.start_date
                                        ?.message || ''
                                }
                            />
                        </div>
                        <div className="col-span-2 lg:col-span-1">
                            <Label>End Date</Label>
                            <MonthYearPicker
                                id={`sub_items.${subIndex}.end_date`}
                                placeholder="Your End Date"
                                register={register(
                                    `sub_items.${subIndex}.end_date`
                                )}
                                setValue={setValue}
                                error={
                                    !!errors?.sub_items?.[subIndex]?.end_date
                                }
                                hint={
                                    errors?.sub_items?.[subIndex]?.end_date
                                        ?.message || ''
                                }
                                allowPresent={true}
                            />
                        </div>
                    </div>

                    {/* Projects inside subItem */}
                    <Projects
                        control={control}
                        register={register}
                        subIndex={subIndex}
                        setValue={setValue}
                        errors={errors}
                    />

                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => remove(subIndex)}
                    >
                        Remove Sub Item
                    </Button>
                </div>
            ))}

            <Button
                type="button"
                className="mt-2"
                onClick={() =>
                    append({
                        position: '',
                        setup: '',
                        start_date: '',
                        end_date: '',
                        projects: [],
                    })
                }
            >
                + Add Sub Item
            </Button>
        </div>
    );
};

export default SubItems;
