import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AccountMenu from '../AccountMenu';

describe('AccountMenu Component', () => {
  const mockToggleMenu = jest.fn();
  const mockLinks = [
    { name: 'Dashboard', to: '/dashboard', provider: ['Email'] },
    { name: 'Settings', to: '/settings', provider: null },
    { name: 'Profile', to: '/profile', provider: ['Google'] },
  ];
  const mockUser = { provider: 'Email' };

  test('renders AccountMenu with correct title and links', () => {
    render(
      <AccountMenu
        user={mockUser}
        isMenuOpen={true}
        links={mockLinks}
        toggleMenu={mockToggleMenu}
      />
    );

    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument(); // Profile should not render for Email provider
  });

  test('toggles the menu on button click', () => {
    render(
      <AccountMenu
        user={mockUser}
        isMenuOpen={false}
        links={mockLinks}
        toggleMenu={mockToggleMenu}
      />
    );

    const toggleButton = screen.getByText('Dashboard Menu');
    fireEvent.click(toggleButton);
    expect(mockToggleMenu).toHaveBeenCalled();
  });

  test('filters links based on user provider', () => {
    render(
      <AccountMenu
        user={{ provider: 'Google' }}
        isMenuOpen={true}
        links={mockLinks}
        toggleMenu={mockToggleMenu}
      />
    );

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument(); // Dashboard should not render for Google provider
    expect(screen.getByText('Profile')).toBeInTheDocument(); // Profile should render for Google provider
  });

  test('renders links with correct attributes', () => {
    render(
      <AccountMenu
        user={mockUser}
        isMenuOpen={true}
        links={mockLinks}
        toggleMenu={mockToggleMenu}
      />
    );

    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    const settingsLink = screen.getByText('Settings');
    expect(settingsLink).toHaveAttribute('href', '/settings');
  });
});
