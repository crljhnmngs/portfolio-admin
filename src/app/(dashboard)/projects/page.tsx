import { PageBreadcrumb } from '@/components/common/PageBreadCrumb';
import { ProjectManager } from '@/components/projects/ProjectManager';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Projects | Carl John Manigos Portfolio',
    description:
        'Manage and showcase your projects displayed on your personal portfolio.',
};

const Projects = () => {
    return (
        <div>
            <PageBreadcrumb pageTitle="Projects" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 min-h-[75vh] flex flex-col">
                <ProjectManager />
            </div>
        </div>
    );
};

export default Projects;
