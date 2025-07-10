import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignInForm from '@/components/auth/SignInForm';

describe('SignInForm', () => {
    it('should renders the form with all fields and buttons', () => {
        render(<SignInForm />);
        expect(screen.getAllByRole('button', { name: /Sign in/i }).length).toBeGreaterThan(0);
        expect(
            screen.getByPlaceholderText(/info@gmail.com/i)
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText(/Enter your password/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/Keep me logged in/i)).toBeInTheDocument();
        expect(screen.getByText(/Forgot password/i)).toBeInTheDocument();
    });

    it('should toggles password visibility', () => {
        render(<SignInForm />);
        const passwordInput =
            screen.getByPlaceholderText(/Enter your password/i);
        const toggleButton = passwordInput.parentElement?.querySelector('span');
        expect(passwordInput).toHaveAttribute('type', 'password');
        if (toggleButton) {
            fireEvent.click(toggleButton);
            expect(passwordInput).toHaveAttribute('type', 'text');
            fireEvent.click(toggleButton);
            expect(passwordInput).toHaveAttribute('type', 'password');
        }
    });

    it('should checks and unchecks the checkbox', () => {
        render(<SignInForm />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
        fireEvent.click(checkbox);
        expect(checkbox).not.toBeChecked();
    });

    it('should renders social sign-in buttons', () => {
        render(<SignInForm />);
        expect(screen.getByText(/Sign in with Google/i)).toBeInTheDocument();
        expect(screen.getByText(/Sign in with X/i)).toBeInTheDocument();
    });
});
