import { getLoginErrorMessage } from '@/utils/helpers';

describe('getLoginErrorMessage', () => {
    it('should return specific message for invalid login credentials', () => {
        expect(
            getLoginErrorMessage({
                details: 'Invalid login credentials',
                message: 'fail',
            })
        ).toMatch(/Invalid email or password/);
    });

    it('should return specific message for email not confirmed', () => {
        expect(
            getLoginErrorMessage({
                details: 'Email not confirmed',
                message: 'fail',
            })
        ).toMatch(/verify your email/);
    });

    it('should return specific message for too many requests', () => {
        expect(
            getLoginErrorMessage({
                details: 'Too many requests',
                message: 'fail',
            })
        ).toMatch(/Too many login attempts/);
    });

    it('should return specific message for user not found', () => {
        expect(
            getLoginErrorMessage({ details: 'User not found', message: 'fail' })
        ).toMatch(/No account found/);
    });

    it('should return specific message for invalid email', () => {
        expect(
            getLoginErrorMessage({ details: 'Invalid email', message: 'fail' })
        ).toMatch(/valid email address/);
    });

    it('should return specific message for password is incorrect', () => {
        expect(
            getLoginErrorMessage({
                details: 'Password is incorrect',
                message: 'fail',
            })
        ).toMatch(/Incorrect password/);
    });

    it('should return specific message for account locked', () => {
        expect(
            getLoginErrorMessage({ details: 'Account locked', message: 'fail' })
        ).toMatch(/temporarily locked/);
    });

    it('should return specific message for email rate limit', () => {
        expect(
            getLoginErrorMessage({
                details: 'Email rate limit',
                message: 'fail',
            })
        ).toMatch(/Too many login attempts/);
    });

    it('should return specific message for invalid credentials', () => {
        expect(
            getLoginErrorMessage({
                details: 'Invalid credentials',
                message: 'fail',
            })
        ).toMatch(/Invalid email or password/);
    });

    it('should return specific message for email not verified', () => {
        expect(
            getLoginErrorMessage({
                details: 'Email not verified',
                message: 'fail',
            })
        ).toMatch(/verify your email/);
    });

    it('should return original error message if no match', () => {
        expect(
            getLoginErrorMessage({ details: 'other', message: 'custom error' })
        ).toBe('custom error');
    });

    it('should return error.message for plain Error', () => {
        expect(getLoginErrorMessage(new Error('plain error'))).toBe(
            'plain error'
        );
    });

    it('should return string error as is', () => {
        expect(getLoginErrorMessage('string error')).toBe('string error');
    });

    it('should return fallback for unknown error', () => {
        expect(getLoginErrorMessage(undefined)).toBe(
            'Login failed. Please try again.'
        );
    });
});
