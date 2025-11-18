'use client';
import React, { createContext, useContext } from 'react';
import { useGeneralInfo } from '@/hooks/generalInfo/useGeneralInfo';

type GeneralInfoContextType = ReturnType<typeof useGeneralInfo>;

const GeneralInfoContext = createContext<GeneralInfoContextType | undefined>(
    undefined
);

export const GeneralInfoProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const generalInfoQuery = useGeneralInfo();

    return (
        <GeneralInfoContext.Provider value={generalInfoQuery}>
            {children}
        </GeneralInfoContext.Provider>
    );
};

export const useGeneralInfoContext = () => {
    const context = useContext(GeneralInfoContext);
    if (!context) {
        throw new Error(
            'useGeneralInfoContext must be used within a GeneralInfoProvider'
        );
    }
    return context;
};
