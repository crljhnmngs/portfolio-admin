import { PageBreadcrumb } from '@/components/common/PageBreadCrumb';
import type { Metadata } from 'next';
import { ImagesManager } from '../../../components/images/ImagesManager';

export const metadata: Metadata = {
    title: 'Images | Carl John Manigos Portfolio',
    description:
        'Upload, manage, and organize images stored in your cloud storage for your personal portfolio.',
};

const Images = () => {
    return (
        <div>
            <PageBreadcrumb pageTitle="Images" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 min-h-[75vh]">
                <ImagesManager />
            </div>
        </div>
    );
};

export default Images;
