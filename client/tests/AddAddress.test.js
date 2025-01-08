import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddAddress from '../AddAddress';

describe('AddAddress Component', () => {
  const mockAddressChange = jest.fn();
  const mockAddAddress = jest.fn();
  const mockFormErrors = {};
  const mockAddressFormData = {
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    isDefault: false,
  };

  beforeEach(() => {
    render(
      <AddAddress
        addressFormData={mockAddressFormData}
        formErrors={mockFormErrors}
        addressChange={mockAddressChange}
        addAddress={mockAddAddress}
      />
    );
  });

  test('renders all input fields and the Add Address button', () => {
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Zipcode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/As the Default/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Address/i)).toBeInTheDocument();
  });

  test('calls addressChange function on input field change', () => {
    const addressInput = screen.getByLabelText(/Address/i);
    fireEvent.change(addressInput, { target: { value: '123 Main St' } });
    expect(mockAddressChange).toHaveBeenCalledWith('address', '123 Main St');

    const cityInput = screen.getByLabelText(/City/i);
    fireEvent.change(cityInput, { target: { value: 'New York' } });
    expect(mockAddressChange).toHaveBeenCalledWith('city', 'New York');
  });

  test('updates the checkbox state on change', () => {
    const checkbox = screen.getByLabelText(/As the Default/i);
    fireEvent.click(checkbox);
    expect(mockAddressChange).toHaveBeenCalledWith('isDefault', true);

    fireEvent.click(checkbox);
    expect(mockAddressChange).toHaveBeenCalledWith('isDefault', false);
  });

  test('calls addAddress function on form submission', () => {
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    expect(mockAddAddress).toHaveBeenCalled();
  });

  test('displays error messages for invalid fields', () => {
    const mockErrors = {
      address: 'Address is required',
      city: 'City is required',
    };

    render(
      <AddAddress
        addressFormData={mockAddressFormData}
        formErrors={mockErrors}
        addressChange={mockAddressChange}
        addAddress={mockAddAddress}
      />
    );

    expect(screen.getByText(/Address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/City is required/i)).toBeInTheDocument();
  });
});
