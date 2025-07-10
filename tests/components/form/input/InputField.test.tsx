import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '@/components/form/input/InputField';

describe('InputField', () => {
    it('should renders with placeholder', () => {
        render(<Input placeholder="Test Placeholder" />);
        expect(
            screen.getByPlaceholderText('Test Placeholder')
        ).toBeInTheDocument();
    });

    it('should renders with type', () => {
        render(<Input type="email" placeholder="Email" />);
        expect(screen.getByPlaceholderText('Email')).toHaveAttribute(
            'type',
            'email'
        );
    });

    it('should calls onChange when typing', () => {
        const handleChange = jest.fn();
        render(<Input onChange={handleChange} placeholder="Type here" />);
        fireEvent.change(screen.getByPlaceholderText('Type here'), {
            target: { value: 'abc' },
        });
        expect(handleChange).toHaveBeenCalled();
    });

    it('should disabled when disabled prop is true', () => {
        render(<Input disabled placeholder="Disabled" />);
        expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();
    });

    it('should shows error and success styles', () => {
        const { rerender } = render(<Input error placeholder="Error" />);
        expect(screen.getByPlaceholderText('Error').className).toMatch(
            /error/i
        );
        rerender(<Input success placeholder="Success" />);
        expect(screen.getByPlaceholderText('Success').className).toMatch(
            /success/i
        );
    });

    it('should shows hint text', () => {
        render(<Input hint="This is a hint" placeholder="Hint" />);
        expect(screen.getByText('This is a hint')).toBeInTheDocument();
    });
});
