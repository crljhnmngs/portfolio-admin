'use-client';

export const getLoginErrorMessage = (error: unknown): string => {
    if (
        error &&
        typeof error === 'object' &&
        'details' in error &&
        'message' in error
    ) {
        const errorDetails = String(error.details).toLowerCase();

        if (errorDetails.includes('invalid login credentials')) {
            return 'Invalid email or password. Please check your credentials and try again.';
        }
        if (errorDetails.includes('email not confirmed')) {
            return 'Please verify your email address before logging in.';
        }
        if (errorDetails.includes('too many requests')) {
            return 'Too many login attempts. Please wait a few minutes before trying again.';
        }
        if (errorDetails.includes('user not found')) {
            return 'No account found with this email address.';
        }
        if (errorDetails.includes('invalid email')) {
            return 'Please enter a valid email address.';
        }
        if (errorDetails.includes('password is incorrect')) {
            return 'Incorrect password. Please try again.';
        }
        if (errorDetails.includes('account locked')) {
            return 'Your account has been temporarily locked due to multiple failed attempts.';
        }
        if (errorDetails.includes('email rate limit')) {
            return 'Too many login attempts. Please try again later.';
        }
        if (errorDetails.includes('invalid credentials')) {
            return 'Invalid email or password. Please check your credentials and try again.';
        }
        if (errorDetails.includes('email not verified')) {
            return 'Please verify your email address before logging in.';
        }

        // Return the original error message if no specific case matches
        return String(error.message);
    }

    // Handle plain Error
    if (error instanceof Error) {
        return error.message;
    }

    // Handle string errors
    if (typeof error === 'string') {
        return error;
    }

    return 'Login failed. Please try again.';
};
