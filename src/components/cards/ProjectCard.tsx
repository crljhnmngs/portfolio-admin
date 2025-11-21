'use client';

import React from 'react';
import Image from 'next/image';
import {
    Pencil,
    Trash2,
    Github,
    ExternalLink,
    Calendar,
    Sparkles,
    Wrench,
} from 'lucide-react';
import { Projects } from '@/types/global';
import { formatMonthYear } from '@/utils/helpers';

type ProjectCardProps = {
    project: Projects;
    onEdit: (project: Projects) => void;
    onDelete: (id: string) => void;
};

export const ProjectCard = ({
    project,
    onEdit,
    onDelete,
}: ProjectCardProps) => {
    return (
        <div className="group relative flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden">
            <div className="absolute top-3 left-3 z-10 flex gap-2">
                {project.new && (
                    <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-sm">
                        <Sparkles size={12} />
                        New
                    </span>
                )}
                {project.dev && (
                    <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-sm">
                        <Wrench size={12} />
                        In Dev
                    </span>
                )}
            </div>

            <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                    onClick={() => onEdit(project)}
                    className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md backdrop-blur-sm"
                    title="Edit"
                >
                    <Pencil size={16} />
                </button>
                <button
                    onClick={() => onDelete(project.id!)}
                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md backdrop-blur-sm"
                    title="Delete"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <Image
                    src={project.image_url}
                    alt={project.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            <div className="flex flex-col flex-1 p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {project.name}
                </h3>

                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <Calendar size={14} />
                    <span>{formatMonthYear(project.date)}</span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
                    {project.about}
                </p>

                <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        {project.tech.slice(0, 4).map((tech, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 rounded-md border border-purple-200 dark:border-purple-800"
                            >
                                {tech}
                            </span>
                        ))}
                        {project.tech.length > 4 && (
                            <span className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-md">
                                +{project.tech.length - 4} more
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    {project.links.github && (
                        <a
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex-1 justify-center"
                        >
                            <Github size={16} />
                            Code
                        </a>
                    )}
                    {project.links.live && (
                        <a
                            href={project.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex-1 justify-center"
                        >
                            <ExternalLink size={16} />
                            Live
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};
