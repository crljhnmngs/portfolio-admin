'use client';
import React from 'react';
import { DownloadIcon, EnvelopeIcon, GroupIcon } from '@/icons';

const metrics = [
    {
        icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
        label: 'Total Visitors',
        value: '3,782',
    },
    {
        icon: <DownloadIcon className="text-gray-800 dark:text-white/90" />,
        label: 'Total Resume Downloads',
        value: '5,359',
    },
    {
        icon: <EnvelopeIcon className="text-gray-800 dark:text-white/90" />,
        label: 'Total Emails Received',
        value: '100',
    },
];

export const MetricCard = () => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
            {metrics.map((metric, index) => (
                <div
                    key={index}
                    className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
                >
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                        {metric.icon}
                    </div>

                    <div className="flex items-end justify-between mt-5">
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {metric.label}
                            </span>
                            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                                {metric.value}
                            </h4>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
