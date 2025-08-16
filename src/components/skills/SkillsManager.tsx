'use client';

import { SkillCard } from '@/components/cards/SkillCard';
import { useSkills } from '@/hooks/useSkills';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ComponentLoader } from '../loaders/ComponentLoader';
import { useModal } from '@/hooks/useModal';
import { SkillModal } from '../modals/SkillModal';
import { Skill } from '@/types/global';
import { ConfirmationModal } from '../modals/ConfirmationModal';
import { useDeleteSkill } from '@/hooks/useDeleteSkill';

export const SkillsManager = () => {
    const { skills, isLoading, error } = useSkills();
    const { openModal, closeModal, isOpen } = useModal();
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const { deleteSkill, isLoading: isDeleting } = useDeleteSkill();

    useEffect(() => {
        if (error) {
            toast.error('Failed to load skills');
        }
    }, [error]);

    const handleAdd = () => {
        setEditingSkill(null);
        openModal('skill');
    };

    const handleEdit = (data: Skill) => {
        setEditingSkill(data);
        openModal('skill');
    };

    const handleDelete = (id: string) => {
        openModal('confirm');
        setDeleteTargetId(id);
    };

    const confirmDelete = async () => {
        if (deleteTargetId) {
            await deleteSkill(deleteTargetId);
        }
        setDeleteTargetId(null);
        closeModal();
    };

    return (
        <>
            <div className="w-full flex justify-end">
                <button
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                    disabled={isLoading}
                    onClick={() => handleAdd()}
                >
                    <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9 1.5C9.27614 1.5 9.5 1.72386 9.5 2V8.5H16C16.2761 8.5 16.5 8.72386 16.5 9C16.5 9.27614 16.2761 9.5 16 9.5H9.5V16C9.5 16.2761 9.27614 16.5 9 16.5C8.72386 16.5 8.5 16.2761 8.5 16V9.5H2C1.72386 9.5 1.5 9.27614 1.5 9C1.5 8.72386 1.72386 8.5 2 8.5H8.5V2C8.5 1.72386 8.72386 1.5 9 1.5Z"
                            fill="currentColor"
                        />
                    </svg>
                    Add New Skill
                </button>
            </div>
            <div className="flex gap-6 flex-wrap justify-center w-full pt-5">
                {isLoading ? (
                    <div className="w-full flex justify-center">
                        <ComponentLoader />
                    </div>
                ) : skills.length > 0 ? (
                    skills.map((skill) => (
                        <SkillCard
                            key={skill.id}
                            skill={skill}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center w-full py-10 border-2 border-dashed border-gray-300 rounded-xl dark:border-gray-700">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-12 h-12 text-gray-400 mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            No skills added yet
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            Click the &quot;Add New Skill&quot; button to create
                            one.
                        </p>
                    </div>
                )}
            </div>
            <SkillModal
                initialData={editingSkill}
                isOpen={isOpen('skill')}
                closeModal={closeModal}
            />
            <ConfirmationModal
                isOpen={isOpen('confirm')}
                closeModal={() => {
                    setDeleteTargetId(null);
                    closeModal();
                }}
                title="Delete Item"
                description="Are you sure you want to delete this item? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={confirmDelete}
                loading={isDeleting}
            />
        </>
    );
};
