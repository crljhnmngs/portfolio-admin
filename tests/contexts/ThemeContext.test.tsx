import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

describe('ThemeContext', () => {
    it('should provide theme and toggleTheme to children', () => {
        let contextValue: ReturnType<typeof useTheme> | undefined;
        function TestComponent() {
            contextValue = useTheme();
            return <div>Test</div>;
        }
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );
        expect(contextValue).toBeDefined();
        expect(typeof contextValue!.theme).toBe('string');
        expect(typeof contextValue!.toggleTheme).toBe('function');
    });

    it('should throw if useTheme is used outside ThemeProvider', () => {
        function TestComponent() {
            return <>{useTheme().theme}</>;
        }
        // Suppress error boundary output
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<TestComponent />)).toThrow(
            'useTheme must be used within a ThemeProvider'
        );
        spy.mockRestore();
    });
});
