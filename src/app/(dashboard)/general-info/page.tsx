import { LocalizedInfoCard } from '@/components/cards/LocalizedInfoCard';
import { NonLocalizedInfoCard } from '@/components/cards/NonLocalizedInfoCard';
import { RolesCard } from '@/components/cards/RolesCard';
import { PageBreadcrumb } from '@/components/common/PageBreadCrumb';

const GeneralInfo = () => {
    return (
        <div>
            <PageBreadcrumb pageTitle="General Info" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="space-y-6">
                    <RolesCard />
                    <NonLocalizedInfoCard />
                    <LocalizedInfoCard />
                </div>
            </div>
        </div>
    );
};

export default GeneralInfo;
