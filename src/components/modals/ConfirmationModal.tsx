import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';

type ConfirmationModalProps = {
    isOpen: boolean;
    closeModal: () => void;
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    loading?: boolean;
};

export const ConfirmationModal = ({
    isOpen,
    closeModal,
    title = 'Confirm Action',
    description = 'Are you sure you want to proceed?',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    loading = false,
}: ConfirmationModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            showCloseButton={false}
            className="max-w-[507px] p-6 lg:p-10"
        >
            <div className="text-center">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
                    {title}
                </h4>
                <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                    {description}
                </p>

                <div className="flex items-center justify-center w-full gap-3 mt-8">
                    <Button size="sm" variant="outline" onClick={closeModal}>
                        {cancelLabel}
                    </Button>
                    <Button size="sm" onClick={onConfirm} disabled={loading}>
                        {loading ? 'Processing...' : confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
