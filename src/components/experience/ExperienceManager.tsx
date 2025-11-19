'use client';

import React, { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import { ExperienceModal } from '../modals/ExperienceModal';
import { Experience } from '@/types/global';
import { useLanguageStore } from '@/stores/languageStore';
import { ComponentLoader } from '../loaders/ComponentLoader';
import { useExperiences } from '@/hooks/experiences/useExperiences';
import toast from 'react-hot-toast';
import draftToHtml from 'draftjs-to-html';
import { ConfirmationModal } from '../modals/ConfirmationModal';
import { useDeleteExperience } from '@/hooks/experiences/useDeleteExperience';
import { formatMonthYear } from '@/utils/helpers';
import Image from 'next/image';

export const ExperienceManager = () => {
    const { openModal, closeModal, isOpen } = useModal();
    const [editingExperience, setEditingExperience] =
        useState<Experience | null>(null);
    const selectedLang = useLanguageStore((s) => s.selectedLang);
    const { experiences, isLoading, error, isError } =
        useExperiences(selectedLang);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const { deleteExperience, isLoading: isDeleting } = useDeleteExperience();

    useEffect(() => {
        if (isError && error) {
            toast.error('Failed to load experiences');
        }
    }, [isError, error]);

    const handleAdd = () => {
        setEditingExperience(null);
        openModal('experience');
    };

    const handleEdit = (experiences: Experience) => {
        setEditingExperience(experiences);
        openModal('experience');
    };

    const handleDelete = (id: string) => {
        openModal('confirm');
        setDeleteTargetId(id);
    };

    const confirmDelete = async () => {
        if (deleteTargetId) {
            await deleteExperience(deleteTargetId);
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
                    Add New Experience
                </button>
            </div>
            {isLoading ? (
                <div className="w-full flex justify-center flex-1">
                    <ComponentLoader />
                </div>
            ) : experiences.length > 0 ? (
                <>
                    <div className="space-y-6 mt-2">
                        {experiences.map((exp) => (
                            <div
                                key={exp.id}
                                className="relative group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                {/* Action Buttons */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button
                                        className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm"
                                        title="Edit"
                                        aria-label="Edit experience"
                                        onClick={() => handleEdit(exp)}
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
                                        title="Delete"
                                        aria-label="Delete experience"
                                        onClick={() => handleDelete(exp.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="p-6">
                                    {/* Company Header */}
                                    <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                                        {exp.logo && (
                                            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700 p-2">
                                                <Image
                                                    src={exp.logo}
                                                    alt={exp.company}
                                                    width={64}
                                                    height={64}
                                                    sizes="64px"
                                                    className="object-contain"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-baseline gap-2 mb-1">
                                                {exp.link ? (
                                                    <a
                                                        href={exp.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                    >
                                                        {exp.company}
                                                    </a>
                                                ) : (
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {exp.company}
                                                    </h3>
                                                )}
                                            </div>
                                            <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                                                {exp.role}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {formatMonthYear(
                                                    exp.start_date
                                                )}{' '}
                                                –{' '}
                                                {formatMonthYear(exp.end_date)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {exp.description && (
                                        <div className="mb-6">
                                            <div
                                                className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                                                dangerouslySetInnerHTML={{
                                                    __html: draftToHtml(
                                                        typeof exp.description ===
                                                            'string'
                                                            ? JSON.parse(
                                                                  exp.description
                                                              )
                                                            : exp.description
                                                    ),
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Tech Stack */}
                                    {exp.tech?.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                                Technologies
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {exp.tech.map((t) => (
                                                    <span
                                                        key={t}
                                                        className="px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-800"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Sub Items (Positions/Projects) */}
                                    {exp.sub_items?.map((sub, index) => (
                                        <div
                                            key={sub.id}
                                            className={`${
                                                index > 0 ? 'mt-6' : ''
                                            } pt-6 border-t border-gray-100 dark:border-gray-700`}
                                        >
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                        {sub.position}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {sub.setup}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {formatMonthYear(
                                                            sub.start_date
                                                        )}{' '}
                                                        -{' '}
                                                        {formatMonthYear(
                                                            sub.end_date
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {sub.projects?.map((proj) => (
                                                <div
                                                    key={proj.id}
                                                    className="ml-6 pl-4 border-l-2 border-gray-200 dark:border-gray-700 mb-4 last:mb-0"
                                                >
                                                    <div
                                                        className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2"
                                                        dangerouslySetInnerHTML={{
                                                            __html: draftToHtml(
                                                                typeof proj.description ===
                                                                    'string'
                                                                    ? JSON.parse(
                                                                          proj.description
                                                                      )
                                                                    : proj.description
                                                            ),
                                                        }}
                                                    />
                                                    {Array.isArray(proj.tech) &&
                                                        proj.tech.length >
                                                            0 && (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {proj.tech.map(
                                                                    (pt) => (
                                                                        <span
                                                                            key={
                                                                                pt
                                                                            }
                                                                            className="px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-800"
                                                                        >
                                                                            {pt}
                                                                        </span>
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
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
                        No experiences added yet for (
                        {selectedLang ? selectedLang.toUpperCase() : 'EN'})
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        Click the &quot;Add New Experience&quot; button to
                        create one.
                    </p>
                </div>
            )}
            <ExperienceModal
                initialData={editingExperience}
                isOpen={isOpen('experience')}
                selectedLang={selectedLang}
                closeModal={closeModal}
            />
            <ConfirmationModal
                isOpen={isOpen('confirm')}
                closeModal={() => {
                    setDeleteTargetId(null);
                    closeModal();
                }}
                title="Delete Experience"
                description="Are you sure you want to delete this experience? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={confirmDelete}
                loading={isDeleting}
            />
        </>
    );
};
