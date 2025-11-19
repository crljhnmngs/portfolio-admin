'use client';

import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, GraduationCap } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import { EducationModal } from '../modals/EducationModal';
import { Education } from '@/types/global';
import { useLanguageStore } from '@/stores/languageStore';
import { ComponentLoader } from '../loaders/ComponentLoader';
import { useEducations } from '@/hooks/educations/useEducations';
import toast from 'react-hot-toast';
import { ConfirmationModal } from '../modals/ConfirmationModal';
import { useDeleteEducation } from '@/hooks/educations/useDeleteEducation';
import { formatMonthYear } from '@/utils/helpers';
import Image from 'next/image';

export const EducationManager = () => {
    const { openModal, closeModal, isOpen } = useModal();
    const [editingEducation, setEditingEducation] = useState<Education | null>(
        null
    );
    const selectedLang = useLanguageStore((s) => s.selectedLang);
    const { educations, isLoading, error, isError } =
        useEducations(selectedLang);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const { deleteEducation, isLoading: isDeleting } = useDeleteEducation();

    useEffect(() => {
        if (isError && error) {
            toast.error('Failed to load educations');
        }
    }, [isError, error]);

    const handleAdd = () => {
        setEditingEducation(null);
        openModal('education');
    };

    const handleEdit = (education: Education) => {
        setEditingEducation(education);
        openModal('education');
    };

    const handleDelete = (id: string) => {
        openModal('confirm');
        setDeleteTargetId(id);
    };

    const confirmDelete = async () => {
        if (deleteTargetId) {
            await deleteEducation(deleteTargetId);
        }
        setDeleteTargetId(null);
        closeModal();
    };

    return (
        <>
            <div className="w-full flex justify-end">
                <button
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                    onClick={() => handleAdd()}
                    disabled={isLoading}
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
                    Add New Education
                </button>
            </div>
            {isLoading ? (
                <div className="w-full flex justify-center flex-1">
                    <ComponentLoader />
                </div>
            ) : educations.length > 0 ? (
                <>
                    <div className="space-y-6 mt-2">
                        {educations.map((edu) => (
                            <div
                                key={edu.id}
                                className="relative group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                {/* Action Buttons */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button
                                        className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm"
                                        title="Edit"
                                        aria-label="Edit education"
                                        onClick={() => handleEdit(edu)}
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
                                        title="Delete"
                                        aria-label="Delete education"
                                        onClick={() => handleDelete(edu.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="p-6">
                                    {/* Education Header */}
                                    <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                                        {edu.logo_url ? (
                                            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700 p-2 relative">
                                                <Image
                                                    src={edu.logo_url}
                                                    alt={edu.school}
                                                    fill
                                                    sizes="64px"
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <GraduationCap
                                                    className="w-8 h-8 text-blue-600 dark:text-blue-400"
                                                    strokeWidth={1.5}
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                {edu.school}
                                            </h3>
                                            <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                                                {edu.course}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {edu.track}
                                                </span>
                                                <span className="text-gray-400">
                                                    •
                                                </span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {formatMonthYear(
                                                        edu.start_date
                                                    )}{' '}
                                                    –{' '}
                                                    {formatMonthYear(
                                                        edu.end_date
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tech Stack */}
                                    {edu.tech?.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                                Technologies Learned
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {edu.tech.map((t) => (
                                                    <span
                                                        key={t}
                                                        className="px-3 py-1 text-xs font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-1 flex-col items-center justify-center w-full py-10 border-2 border-dashed border-gray-300 rounded-xl dark:border-gray-700 mt-3">
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
                        No education added yet for (
                        {selectedLang ? selectedLang.toUpperCase() : 'EN'})
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        Click the &quot;Add New Education&quot; button to create
                        one.
                    </p>
                </div>
            )}
            <EducationModal
                initialData={editingEducation}
                isOpen={isOpen('education')}
                selectedLang={selectedLang}
                closeModal={closeModal}
            />
            <ConfirmationModal
                isOpen={isOpen('confirm')}
                closeModal={() => {
                    setDeleteTargetId(null);
                    closeModal();
                }}
                title="Delete Education"
                description="Are you sure you want to delete this education? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={confirmDelete}
                loading={isDeleting}
            />
        </>
    );
};
