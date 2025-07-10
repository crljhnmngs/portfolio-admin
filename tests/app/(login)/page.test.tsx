import React from 'react';
import { render, screen } from '@testing-library/react';
import SignIn from '@/app/(login)/page';

describe('SignIn page', () => {
  it('should render the SignInForm', () => {
    render(<SignIn />);
    expect(screen.getAllByRole('button', { name: /sign in/i }).length).toBeGreaterThan(0);
  });
});
