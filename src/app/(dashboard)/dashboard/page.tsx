import type { Metadata } from 'next';
import React from 'react';
import { StatisticsChart } from '@/components/charts/StatisticsChart';
import { MetricCard } from '@/components/cards/MetricCard';
import { MonthlyVisitorsChart } from '@/components/charts/MonthlyVisitorsChart';

export const metadata: Metadata = {
    title: 'Admin Dashboard | Carl John Manigos Portfolio',
    description: 'Manage your personal portfolio content from this dashboard.',
};

const Dashboard = () => {
    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-6 ">
                <MetricCard />
                <MonthlyVisitorsChart />
            </div>

            <div className="col-span-12">
                <StatisticsChart />
            </div>
        </div>
    );
};

export default Dashboard;
