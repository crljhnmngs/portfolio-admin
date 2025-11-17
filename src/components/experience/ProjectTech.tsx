'use client';

import React from 'react';
import {
    Control,
    UseFormRegister,
    useWatch,
    UseFormSetValue,
} from 'react-hook-form';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { ExperienceFormData } from '@/utils/validation/experienceSchema';

type ProjectTechProps = {
    control: Control<ExperienceFormData>;
    register: UseFormRegister<ExperienceFormData>;
    setValue: UseFormSetValue<ExperienceFormData>;
    subIndex: number;
    projIndex: number;
};

const ProjectTech = ({
    control,
    register,
    subIndex,
    projIndex,
    setValue,
}: ProjectTechProps) => {
    const techValues: string[] =
        useWatch({
            control,
            name: `sub_items.${subIndex}.projects.${projIndex}.tech` as const,
        }) || [];

    const addTech = () => {
        setValue(`sub_items.${subIndex}.projects.${projIndex}.tech` as const, [
            ...techValues,
            '',
        ]);
    };

    const removeTech = (index: number) => {
        setValue(
            `sub_items.${subIndex}.projects.${projIndex}.tech` as const,
            techValues.filter((_, i) => i !== index)
        );
    };

    return (
        <div className="mt-2">
            <Label>Project Tech</Label>
            {techValues.map((_, ptIndex) => (
                <div key={ptIndex} className="flex gap-2 mb-2">
                    <Input
                        register={register(
                            `sub_items.${subIndex}.projects.${projIndex}.tech.${ptIndex}` as const
                        )}
                        placeholder="e.g. Next.js"
                    />
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeTech(ptIndex)}
                    >
                        Remove
                    </Button>
                </div>
            ))}
            <Button type="button" size="sm" onClick={addTech}>
                + Add Tech
            </Button>
        </div>
    );
};

export default ProjectTech;
