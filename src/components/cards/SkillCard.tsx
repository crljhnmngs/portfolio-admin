'use client';

import React from 'react';
import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react';
import { Skill } from '@/types/global';

type SkillCardProps = {
    skill: Skill;
    onEdit: (skill: Skill) => void;
    onDelete: (id: string) => void;
};

export const SkillCard = ({ skill, onEdit, onDelete }: SkillCardProps) => {
    return (
        <div className="flex flex-col items-center gap-3 p-5 border rounded-xl shadow-sm dark:border-gray-700 dark:bg-white/[0.03] hover:shadow-md transition min-w-[200px] max-w-[240px]">
            <Image
                src={skill.icon_url}
                alt={skill.name}
                width={48}
                height={48}
                className="mb-1"
            />
            <div className="text-center">
                <h3 className="font-medium text-gray-800 dark:text-white text-lg">
                    {skill.name}
                </h3>
                <p className="text-sm text-gray-500">{skill.category}</p>
            </div>
            <div className="flex gap-2 mt-2">
                <button
                    onClick={() => onEdit(skill)}
                    className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                    title="Edit"
                >
                    <Pencil size={18} />
                </button>
                <button
                    onClick={() => onDelete(skill.id)}
                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                    title="Delete"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};
