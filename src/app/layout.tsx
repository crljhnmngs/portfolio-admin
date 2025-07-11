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
        <html lang="en">
            <body className={`${outfit.className} dark:bg-gray-900`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
};

export default RootLayout;
