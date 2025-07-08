import SignInForm from '@/components/auth/SignInForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | Portfolio Admin Panel',
    description:
        'Sign in to manage your personal portfolio content using the admin dashboard.',
};

const SignIn = () => {
    return <SignInForm />;
};

export default SignIn;
