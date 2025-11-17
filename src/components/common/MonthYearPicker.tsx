import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect/index.js';
import 'flatpickr/dist/plugins/monthSelect/style.css';
import Label from '../form/Label';
import { CalenderIcon } from '../../icons';
import { UseFormRegisterReturn, UseFormSetValue } from 'react-hook-form';

type MonthYearPickerProps = {
    id: string;
    register?: UseFormRegisterReturn;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue?: UseFormSetValue<any>;
    label?: string;
    placeholder?: string;
    allowPresent?: boolean;
    error?: boolean;
    hint?: string;
};

const MonthYearPicker = ({
    id,
    register,
    setValue,
    label,
    placeholder,
    allowPresent = false,
    error,
    hint,
}: MonthYearPickerProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!inputRef.current) return;

        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, '0')}`;

        let fpDefaultDate: Date | undefined;
        const isPresent =
            inputRef.current.value === currentMonth ||
            inputRef.current.value === 'Present';

        if (inputRef.current.value && inputRef.current.value !== 'Present') {
            fpDefaultDate = new Date(inputRef.current.value + '-01');
        }

        if (isPresent) {
            fpDefaultDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        const fp = flatpickr(inputRef.current, {
            dateFormat: 'Y-m',
            altInput: true,
            altFormat: 'F Y',
            allowInput: true,
            defaultDate: fpDefaultDate,
            plugins: [
                monthSelectPlugin({
                    shorthand: true,
                    dateFormat: 'Y-m',
                    altFormat: 'F Y',
                }),
            ],
            onChange: (_selectedDates, dateStr) => {
                if (setValue) setValue(id, dateStr, { shouldDirty: true });
                else
                    register?.onChange?.({
                        target: { value: dateStr },
                    } as unknown as React.ChangeEvent<HTMLInputElement>);
            },
            onReady: (_selectedDates, _dateStr, instance) => {
                if (isPresent && instance.altInput) {
                    instance.altInput.value = 'Present';
                }
            },
            onOpen: (_selectedDates, _dateStr, instance) => {
                if (!allowPresent) return;

                if (instance.calendarContainer.querySelector('.present-btn'))
                    return;

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.textContent = 'Present';
                btn.className =
                    'present-btn w-full py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded mt-2';

                btn.addEventListener('click', () => {
                    if (!inputRef.current) return;

                    const now = new Date();
                    const currentMonth = `${now.getFullYear()}-${String(
                        now.getMonth() + 1
                    ).padStart(2, '0')}`;

                    inputRef.current.value = currentMonth;

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const flatpickrInstance = (inputRef.current as any)
                        ?._flatpickr;
                    if (flatpickrInstance?.altInput)
                        flatpickrInstance.altInput.value = 'Present';

                    if (setValue)
                        setValue(id, 'Present', { shouldDirty: true });
                    else
                        register?.onChange?.({
                            target: { value: currentMonth },
                        } as unknown as React.ChangeEvent<HTMLInputElement>);

                    instance.close();
                });

                instance.calendarContainer.appendChild(btn);
            },
        });

        return () => fp.destroy();
    }, [register, setValue, id, allowPresent]);

    return (
        <div className="relative">
            {label && <Label htmlFor={id}>{label}</Label>}

            <div className="relative flex items-center">
                <input
                    id={id}
                    placeholder={placeholder}
                    {...register}
                    ref={(el) => {
                        inputRef.current = el;
                        if (register?.ref) register.ref(el);
                    }}
                    className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800 ${
                        error ? 'border-red-500' : ''
                    }`}
                />
                <CalenderIcon className="absolute right-3 text-gray-500 dark:text-gray-400 size-6" />
            </div>

            {error && hint && (
                <p className="text-red-500 text-xs mt-1">{hint}</p>
            )}
        </div>
    );
};

export default MonthYearPicker;
