'use client';

import React from 'react';
import { useUser } from '@/contexts/UserContext';

const Dashboard = () => {
    const { user, loading, signOut } = useUser();

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    return (
        <div className="text-white" onClick={signOut}>
            Dashboard {user?.email ?? 'No user'}
        </div>
    );
};

export default Dashboard;
