'use client';

import { ProjectCard } from '@/components/cards/ProjectCard';
import { useState } from 'react';
import { useModal } from '@/hooks/useModal';
import { Projects } from '@/types/global';
import { ConfirmationModal } from '../modals/ConfirmationModal';
import { ComponentLoader } from '../loaders/ComponentLoader';
import { useLanguageStore } from '@/stores/languageStore';
import { ProjectModal } from '../modals/ProjectModal';

// Dummy data
const dummyProjects: Projects[] = [
    {
        id: '1',
        name: 'E-Commerce Platform',
        image_url:
            'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
        about: 'A full-stack e-commerce platform with real-time inventory management, payment integration, and order tracking.A full-stack e-commerce platform with real-time inventory management, payment integration, and order tracking.',
        tech: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
        date: '2024-03',
        new: true,
        dev: true,
        links: {
            github: 'https://github.com/username/ecommerce',
            live: 'https://ecommerce-demo.com',
        },
    },
    {
        id: '2',
        name: 'Task Management Dashboard',
        image_url:
            'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
        about: 'Collaborative task management tool with drag-and-drop interface, team collaboration features, and analytics.',
        tech: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'TailwindCSS'],
        date: '2024-01',
        new: false,
        dev: true,
        links: {
            github: 'https://github.com/username/task-manager',
            live: 'https://tasks-demo.com',
        },
    },
    {
        id: '3',
        name: 'Weather Forecast App',
        image_url:
            'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop',
        about: 'Real-time weather application with 7-day forecast, location search, and beautiful UI animations.',
        tech: ['React', 'OpenWeather API', 'Chart.js', 'CSS3'],
        date: '2023-11',
        new: false,
        dev: false,
        links: {
            github: 'https://github.com/username/weather-app',
            live: 'https://weather-demo.com',
        },
    },
    {
        id: '4',
        name: 'Social Media Analytics',
        image_url:
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        about: 'Analytics dashboard for social media metrics with data visualization and export features.',
        tech: ['Vue.js', 'Python', 'FastAPI', 'D3.js', 'Redis'],
        date: '2023-09',
        new: false,
        dev: false,
        links: {
            github: 'https://github.com/username/analytics',
        },
    },
];

export const ProjectManager = () => {
    const { openModal, closeModal, isOpen } = useModal();
    const selectedLang = useLanguageStore((s) => s.selectedLang);
    const [editingProject, setEditingProject] = useState<Projects | null>(null);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const isLoading = false;
    const isDeleting = false;

    const handleAdd = () => {
        setEditingProject(null);
        openModal('project');
    };

    const handleEdit = (data: Projects) => {
        setEditingProject(data);
        openModal('project');
    };

    const handleDelete = (id: string) => {
        openModal('confirm');
        setDeleteTargetId(id);
    };

    console.log(editingProject);

    const confirmDelete = async () => {
        if (deleteTargetId) {
            console.log('Deleting project:', deleteTargetId);
            // Will add delete logic later
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
                    Add New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pt-5">
                {isLoading ? (
                    <div className="col-span-full flex justify-center py-10">
                        <ComponentLoader />
                    </div>
                ) : dummyProjects.length > 0 ? (
                    dummyProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
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
                            No projects added yet for (
                            {selectedLang ? selectedLang.toUpperCase() : 'EN'})
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            Click the &quot;Add New Project&quot; button to
                            create one.
                        </p>
                    </div>
                )}
            </div>

            <ProjectModal
                initialData={editingProject}
                isOpen={isOpen('project')}
                closeModal={closeModal}
            />

            <ConfirmationModal
                isOpen={isOpen('confirm')}
                closeModal={() => {
                    setDeleteTargetId(null);
                    closeModal();
                }}
                title="Delete Project"
                description="Are you sure you want to delete this project? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={confirmDelete}
                loading={isDeleting}
            />
        </>
    );
};
