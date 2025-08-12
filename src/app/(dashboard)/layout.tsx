'use client';

import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import AppHeader from '@/layouts/AppHeader';
import AppSidebar from '@/layouts/AppSidebar';
import Backdrop from '@/layouts/Backdrop';
import React from 'react';
import { UserProvider } from '@/contexts/UserContext';
import { GeneralInfoProvider } from '@/contexts/GeneralInfoContext';

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    const mainContentMargin = isMobileOpen
        ? 'ml-0'
        : isExpanded || isHovered
        ? 'lg:ml-[290px]'
        : 'lg:ml-[90px]';

    return (
        <div className="min-h-screen xl:flex">
            <AppSidebar />
            <Backdrop />
            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
            >
                <AppHeader />
                <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <UserProvider>
                <LayoutContent>
                    <GeneralInfoProvider>{children}</GeneralInfoProvider>
                </LayoutContent>
            </UserProvider>
        </SidebarProvider>
    );
};

export default DashboardLayout;
