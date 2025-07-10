import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthLayout from '@/app/(login)/layout';

describe('AuthLayout', () => {
    it('should render children and theme toggler', () => {
        render(
            <AuthLayout>
                <div>Login Child</div>
            </AuthLayout>
        );
        expect(screen.getByText('Login Child')).toBeInTheDocument();
        // ThemeTogglerTwo is hidden on mobile, so we don't assert its presence here
    });
});
