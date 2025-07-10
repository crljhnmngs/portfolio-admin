import React from 'react';
import { render, screen } from '@testing-library/react';
import Label from '@/components/form/Label';

describe('Label', () => {
    it('should render children', () => {
        render(<Label>Test Label</Label>);
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('should apply htmlFor prop', () => {
        render(<Label htmlFor="input-id">Label</Label>);
        expect(screen.getByText('Label').closest('label')).toHaveAttribute(
            'for',
            'input-id'
        );
    });

    it('should apply className prop', () => {
        render(<Label className="custom-class">Label</Label>);
        expect(screen.getByText('Label')).toHaveClass('custom-class');
    });
});
