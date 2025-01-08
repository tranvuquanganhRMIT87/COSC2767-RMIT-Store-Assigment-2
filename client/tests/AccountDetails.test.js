import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AccountDetails from '../AccountDetails';

describe('AccountDetails Component', () => {
  const mockUser = {
    provider: 'Email',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '1234567890',
  };
  
  const mockAccountChange = jest.fn();
  const mockUpdateProfile = jest.fn();

  test('renders the account details form', () => {
    render(
      <AccountDetails
        user={mockUser}
        accountChange={mockAccountChange}
        updateProfile={mockUpdateProfile}
      />
    );
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
  });

  test('calls accountChange when inputs are changed', () => {
    render(
      <AccountDetails
        user={mockUser}
        accountChange={mockAccountChange}
        updateProfile={mockUpdateProfile}
      />
    );

    const firstNameInput = screen.getByLabelText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    expect(mockAccountChange).toHaveBeenCalledWith('firstName', 'Jane');
  });

  test('calls updateProfile on form submission', () => {
    render(
      <AccountDetails
        user={mockUser}
        accountChange={mockAccountChange}
        updateProfile={mockUpdateProfile}
      />
    );

    const submitButton = screen.getByText('Save changes');
    fireEvent.click(submitButton);
    expect(mockUpdateProfile).toHaveBeenCalled();
  });
});
