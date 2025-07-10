import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/ui/button/Button';

describe('Button', () => {
    it('should renders children', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should applies size and variant classes', () => {
        const { rerender } = render(
            <Button size="sm" variant="outline">
                Small Outline
            </Button>
        );
        expect(screen.getByText('Small Outline')).toHaveClass('px-4');
        rerender(
            <Button size="md" variant="primary">
                Medium Primary
            </Button>
        );
        expect(screen.getByText('Medium Primary')).toHaveClass('px-5');
    });

    it('should renders start and end icons', () => {
        render(
            <Button
                startIcon={<span data-testid="start-icon">S</span>}
                endIcon={<span data-testid="end-icon">E</span>}
            >
                With Icons
            </Button>
        );
        expect(screen.getByTestId('start-icon')).toBeInTheDocument();
        expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    it('should calls onClick when clicked', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click</Button>);
        fireEvent.click(screen.getByText('Click'));
        expect(handleClick).toHaveBeenCalled();
    });

    it('should disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByText('Disabled')).toBeDisabled();
    });
});
