import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from '@/components/form/input/Checkbox';

describe('Checkbox', () => {
    it('should renders with label', () => {
        render(
            <Checkbox checked={false} onChange={() => {}} label="Test Label" />
        );
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('should reflects checked state', () => {
        const { rerender } = render(
            <Checkbox checked={false} onChange={() => {}} />
        );
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
        rerender(<Checkbox checked={true} onChange={() => {}} />);
        expect(checkbox).toBeChecked();
    });

    it('should calls onChange when clicked', () => {
        const handleChange = jest.fn();
        render(<Checkbox checked={false} onChange={handleChange} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should disabled when disabled prop is true', () => {
        render(<Checkbox checked={false} onChange={() => {}} disabled />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeDisabled();
    });
});
