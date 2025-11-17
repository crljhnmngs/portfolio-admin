import { PageBreadcrumb } from '@/components/common/PageBreadCrumb';
import { ExperienceManager } from '@/components/experience/ExperienceManager';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Experience | Carl John Manigos Portfolio',
    description:
        'Manage and organize your professional experiences displayed on your personal portfolio.',
};

const Experience = () => {
    return (
        <div>
            <PageBreadcrumb pageTitle="Experience" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 min-h-[75vh]">
                <ExperienceManager />
            </div>
        </div>
    );
};

export default Experience;
