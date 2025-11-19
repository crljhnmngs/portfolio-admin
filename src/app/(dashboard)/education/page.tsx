import { PageBreadcrumb } from '@/components/common/PageBreadCrumb';
import { EducationManager } from '@/components/education/EducationManager';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Education | Carl John Manigos Portfolio',
    description:
        'Manage and organize your educational background displayed on your personal portfolio.',
};

const Education = () => {
    return (
        <div>
            <PageBreadcrumb pageTitle="Education" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 min-h-[75vh] flex flex-col">
                <EducationManager />
            </div>
        </div>
    );
};

export default Education;
