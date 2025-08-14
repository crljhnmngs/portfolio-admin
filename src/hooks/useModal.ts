'use client';
import { useState, useCallback } from 'react';

export const useModal = (initialModalId: string | null = null) => {
    const [activeModal, setActiveModal] = useState<string | null>(
        initialModalId
    );

    const openModal = useCallback((id?: string) => {
        setActiveModal(id ?? 'default');
    }, []);

    const closeModal = useCallback(() => setActiveModal(null), []);

    const isOpen = useCallback(
        (id?: string) => activeModal === (id ?? 'default'),
        [activeModal]
    );

    return { activeModal, isOpen, openModal, closeModal };
};
