'use client';

import React from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { GeneralInfoResponse } from '@/types/global';

type NonLocalizedInfoModalProps = {
    isOpen: boolean;
    closeModal: () => void;
    initialData: GeneralInfoResponse | null;
};

export const NonLocalizedInfoModal = (props: NonLocalizedInfoModalProps) => {
    const handleSave = () => {
        console.log('Saving changes...');
        props.closeModal();
    };

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={props.closeModal}
            className="max-w-[700px] m-4"
        >
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Edit Personal Information
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Update your details to keep your portfolio up-to-date.
                    </p>
                </div>

                <form className="flex flex-col">
                    <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3 space-y-8">
                        <div>
                            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                Social Links
                            </h5>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Github</Label>
                                    <Input
                                        type="url"
                                        defaultValue="https://github.com/"
                                        placeholder="https://github.com/your-username"
                                    />
                                </div>
                                <div>
                                    <Label>LinkedIn</Label>
                                    <Input
                                        type="url"
                                        defaultValue="https://www.linkedin.com"
                                        placeholder="https://linkedin.com/in/your-name"
                                    />
                                </div>
                                <div>
                                    <Label>Facebook</Label>
                                    <Input
                                        type="url"
                                        defaultValue="https://www.facebook.com"
                                        placeholder="https://facebook.com/your-profile"
                                    />
                                </div>
                                <div>
                                    <Label>Instagram</Label>
                                    <Input
                                        type="url"
                                        defaultValue="https://instagram.com"
                                        placeholder="https://instagram.com/your-handle"
                                    />
                                </div>
                                <div>
                                    <Label>X.com</Label>
                                    <Input
                                        type="url"
                                        defaultValue="https://x.com"
                                        placeholder="https://x.com/your-handle"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                Non-Localized Info
                            </h5>
                            <div className="grid grid-cols-1 gap-y-5 lg:grid-cols-2 lg:gap-x-6">
                                <div className="lg:col-span-2">
                                    <Label>Email Address</Label>
                                    <Input
                                        type="email"
                                        defaultValue="manigoscarljohn@gmail.com"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <Label>Resume Link</Label>
                                    <Input
                                        type="url"
                                        defaultValue="https://drive.google.com/file/d/1dpKex3ZumzxstHFyibMFnQ-aqIpqQHdy/view?usp=sharing"
                                        placeholder="Paste your resume URL"
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <Label>Schedule Meeting Link</Label>
                                    <Input
                                        type="url"
                                        defaultValue="https://calendly.com/manigoscarljohn/interview-meeting"
                                        placeholder="Paste your meeting scheduler link"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={props.closeModal}
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
