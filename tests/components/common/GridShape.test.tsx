import React from 'react';
import { render, screen } from '@testing-library/react';
import GridShape from '@/components/common/GridShape';

describe('GridShape', () => {
    it('should render two grid images', () => {
        render(<GridShape />);
        const images = screen.getAllByAltText('grid');
        expect(images.length).toBe(2);
        images.forEach((img) => {
            expect(img).toHaveAttribute(
                'src',
                expect.stringContaining('grid-01.svg')
            );
        });
    });
});
