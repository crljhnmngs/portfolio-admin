import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import * as ThemeContext from '@/contexts/ThemeContext';
import { ThemeTogglerTwo } from '@/components/common/ThemeTogglerTwo';

describe('ThemeTogglerTwo', () => {
    it('should render button and call toggleTheme on click', () => {
        const toggleTheme = jest.fn();
        jest.spyOn(ThemeContext, 'useTheme').mockReturnValue({
            theme: 'light',
            toggleTheme,
        });
        render(<ThemeTogglerTwo />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(toggleTheme).toHaveBeenCalled();
    });
});
