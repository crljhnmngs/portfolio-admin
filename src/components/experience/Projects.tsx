'use client';

import React from 'react';
import {
    useFieldArray,
    Control,
    UseFormRegister,
    useWatch,
    UseFormSetValue,
    FieldErrors,
} from 'react-hook-form';
import { ExperienceFormData } from '@/utils/validation/experienceSchema';
import RichTextEditor from '../editor/RichTextEditor';
import Button from '../ui/button/Button';
import Label from '../form/Label';
import ProjectTech from './ProjectTech';

type ProjectsProps = {
    control: Control<ExperienceFormData>;
    register: UseFormRegister<ExperienceFormData>;
    setValue: UseFormSetValue<ExperienceFormData>;
    subIndex: number;
    errors: FieldErrors<ExperienceFormData>;
};

const Projects = ({
    control,
    register,
    subIndex,
    setValue,
    errors,
}: ProjectsProps) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `sub_items.${subIndex}.projects`,
    });

    const projects =
        useWatch({
            control,
            name: `sub_items.${subIndex}.projects`,
        }) || [];

    return (
        <div className="ml-3 space-y-2">
            <Label>Projects</Label>

            {fields.map((project, projIndex) => {
                const descriptionValue =
                    projects?.[projIndex]?.description || '';

                return (
                    <div key={project.id} className="p-2 border rounded-lg">
                        <div className="col-span-2">
                            <Label>Description</Label>
                            <RichTextEditor
                                value={descriptionValue}
                                onChange={(val) =>
                                    setValue(
                                        `sub_items.${subIndex}.projects.${projIndex}.description`,
                                        val,
                                        { shouldDirty: true }
                                    )
                                }
                            />
                            {!!errors?.sub_items?.[subIndex]?.projects?.[
                                projIndex
                            ]?.description && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors?.sub_items?.[subIndex]?.projects?.[
                                        projIndex
                                    ]?.description?.message || ''}
                                </p>
                            )}
                        </div>

                        <ProjectTech
                            control={control}
                            register={register}
                            subIndex={subIndex}
                            projIndex={projIndex}
                            setValue={setValue}
                        />

                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => remove(projIndex)}
                        >
                            Remove Project
                        </Button>
                    </div>
                );
            })}

            <Button
                type="button"
                size="sm"
                onClick={() =>
                    append({
                        description: '',
                        created_at: new Date().toISOString(),
                        tech: [],
                    })
                }
            >
                + Add Project
            </Button>
        </div>
    );
};

export default Projects;
