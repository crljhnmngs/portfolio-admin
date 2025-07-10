import React from 'react';
import { render, screen } from '@testing-library/react';
jest.mock('next/navigation', () => ({
    useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}));
import NotFound from '@/app/not-found';

describe('NotFound', () => {
    it('should render error message and back button', () => {
        render(<NotFound />);
        expect(screen.getByText(/ERROR/i)).toBeInTheDocument();
        expect(
            screen.getByText(
                /We can’t seem to find the page you are looking for!/i
            )
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /back/i })
        ).toBeInTheDocument();
        expect(screen.getAllByAltText('404').length).toBeGreaterThanOrEqual(1);
    });
});
