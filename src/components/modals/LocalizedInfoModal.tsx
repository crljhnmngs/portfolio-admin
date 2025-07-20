'use client';

import React from 'react';

import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';

type LocalizedInfoModal = {
    isOpen: boolean;
    closeModal: () => void;
    selectedLang: string;
};

export const LocalizedInfoModal = ({
    isOpen,
    closeModal,
    selectedLang,
}: LocalizedInfoModal) => {
    const handleSave = () => {
        console.info('Saving..');
        closeModal();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            className="max-w-[700px] m-4"
        >
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Edit Localized Info ({selectedLang.toUpperCase()})
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Update localized content specific to your selected
                        language.
                    </p>
                </div>

                <form className="flex flex-col">
                    <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                        <div>
                            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                Localized Fields
                            </h5>

                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Name</Label>
                                    <Input type="text" defaultValue="Carl" />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Address</Label>
                                    <Input
                                        type="text"
                                        defaultValue="Cebu, PH"
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Current Company</Label>
                                    <Input
                                        type="text"
                                        defaultValue="Alliance Software"
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Current Role</Label>
                                    <Input
                                        type="text"
                                        defaultValue="Software Engineer"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label>About</Label>
                                    <textarea
                                        className="w-full min-h-[150px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                                        defaultValue={`Hello there! I'm Carl, a 25-year-old Front-End / Full-Stack Web Developer based in Cebu, Philippines, with 2.8 years of professional experience. My journey with computers started early in life, sparking a passion that has only grown stronger over the years. I am highly committed to continuous learning and driven by a passion for mastering new technologies and solving complex challenges. With a strong foundation in clean architecture for both frontend and backend web development, I excel at designing and delivering scalable, maintainable solutions. Known for adaptability, quick learning, and a collaborative mindset, I thrive in dynamic tech environments, lead teams effectively, and consistently ensure high-quality software delivery. Beyond coding, I find joy in online gaming and indulge in the world of anime and TV series during my downtime.`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={closeModal}
                        >
                            Close
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
