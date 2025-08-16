import { PageBreadcrumb } from '@/components/common/PageBreadCrumb';
import type { Metadata } from 'next';
import { SkillsManager } from '../../../components/skills/SkillsManager';

export const metadata: Metadata = {
    title: 'Skills | Carl John Manigos Portfolio',
    description:
        'Manage and organize your skills displayed on your personal portfolio.',
};

const Skills = () => {
    return (
        <div>
            <PageBreadcrumb pageTitle="Skills" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 min-h-[75vh]">
                <SkillsManager />
            </div>
        </div>
    );
};

export default Skills;
