import React from 'react';
import { render, screen } from '@testing-library/react';
import Providers from '@/app/Providers';

const QueryClientProviderMock: React.FC<React.PropsWithChildren> = ({
    children,
}) => <div data-testid="query-client">{children}</div>;
QueryClientProviderMock.displayName = 'QueryClientProviderMock';

const ThemeProviderMock: React.FC<React.PropsWithChildren> = ({ children }) => (
    <div data-testid="theme">{children}</div>
);
ThemeProviderMock.displayName = 'ThemeProviderMock';

const UserProviderMock: React.FC<React.PropsWithChildren> = ({ children }) => (
    <div data-testid="user">{children}</div>
);
UserProviderMock.displayName = 'UserProviderMock';

jest.mock('@tanstack/react-query', () => ({
    QueryClientProvider: QueryClientProviderMock,
    QueryClient: jest.fn(),
}));

jest.mock('@tanstack/react-query-devtools', () => ({
    ReactQueryDevtools: () => <div data-testid="devtools" />,
}));

jest.mock('react-hot-toast', () => ({
    Toaster: () => <div data-testid="toaster" />,
}));

jest.mock('@/contexts/ThemeContext', () => ({
    ThemeProvider: ThemeProviderMock,
}));

jest.mock('@/contexts/UserContext', () => ({
    UserProvider: UserProviderMock,
}));

describe('Providers', () => {
    it('should wrap children with all providers and render Toaster', () => {
        render(
            <Providers>
                <div data-testid="child">Hello</div>
            </Providers>
        );
        expect(screen.getByTestId('query-client')).toBeInTheDocument();
        expect(screen.getByTestId('user')).toBeInTheDocument();
        expect(screen.getByTestId('theme')).toBeInTheDocument();
        expect(screen.getByTestId('toaster')).toBeInTheDocument();
        expect(screen.getByTestId('child')).toHaveTextContent('Hello');
    });
});
