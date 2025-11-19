import React, { ReactNode } from 'react';
import { Outfit } from 'next/font/google';
import './globals.css';
import Providers from './Providers';

const outfit = Outfit({
    subsets: ['latin'],
});

const RootLayout = ({
    children,
}: Readonly<{
    children: ReactNode;
}>) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${outfit.className} dark:bg-gray-900`}
                suppressHydrationWarning
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
};

export default RootLayout;
