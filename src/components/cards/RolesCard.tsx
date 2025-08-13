'use client';
import React, { useEffect, useState } from 'react';
import { useModal } from '@/hooks/useModal';
import { ComponentLoader } from '../loaders/ComponentLoader';
import { useLanguageStore } from '@/stores/languageStore';
import { IoTrashOutline } from 'react-icons/io5';
import { HiOutlinePencil } from 'react-icons/hi';
import { RoleModal } from '../modals/RoleModal';
import { TranslatedRole } from '@/types/global';
import { useRoles } from '@/hooks/useRoles';
import toast from 'react-hot-toast';

export const RolesCard = () => {
    const { openModal, closeModal, isOpen } = useModal();
    const selectedLang = useLanguageStore((s) => s.selectedLang);
    const [editingRole, setEditingRole] = useState<TranslatedRole | null>(null);
    const { roles, isLoading, error, isError } = useRoles(selectedLang);
    console.log(roles);
    useEffect(() => {
        if (isError && error) {
            toast.error('Failed to load roles');
        }
    }, [isError, error]);

    const handleAdd = () => {
        setEditingRole(null);
        openModal();
    };

    const handleEdit = (role: TranslatedRole) => {
        setEditingRole(role);
        openModal();
    };

    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 ">
                {isLoading ? (
                    <div className="w-full flex justify-center">
                        <ComponentLoader />
                    </div>
                ) : (
                    <div className="flex flex-col gap-5 xl:flex-row  xl:items-start xl:justify-between">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                Roles (
                                {selectedLang
                                    ? selectedLang.toUpperCase()
                                    : 'EN'}
                                )
                            </h4>

                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5 2xl:gap-x-5">
                                {roles.length > 0 ? (
                                    roles.map((role) => (
                                        <div
                                            key={role.id}
                                            className="flex items-center gap-2 justify-between p-4 border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 hover:shadow-md transition"
                                        >
                                            <span className="text-gray-700 font-medium dark:text-white">
                                                {role.role_name}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                                                    onClick={() =>
                                                        handleEdit(role)
                                                    }
                                                >
                                                    <HiOutlinePencil className="size-5" />
                                                </button>
                                                <button className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500">
                                                    <IoTrashOutline className="size-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-600 text-center">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No roles added for this language
                                            yet.
                                        </p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500">
                                            Click the &quot;Add&quot; button to
                                            create a new role.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            disabled={isError}
                            onClick={handleAdd}
                            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
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
                            Add
                        </button>
                    </div>
                )}
            </div>
            <RoleModal
                initialData={editingRole}
                isOpen={isOpen}
                closeModal={closeModal}
                selectedLang={selectedLang}
            />
        </>
    );
};
