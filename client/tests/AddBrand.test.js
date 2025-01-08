import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddBrand from '../AddBrand';

describe('AddBrand Component', () => {
  const mockBrandChange = jest.fn();
  const mockAddBrand = jest.fn();
  const mockFormErrors = {};
  const mockBrandFormData = {
    name: '',
    description: '',
    isActive: false,
  };

  beforeEach(() => {
    render(
      <AddBrand
        brandFormData={mockBrandFormData}
        formErrors={mockFormErrors}
        brandChange={mockBrandChange}
        addBrand={mockAddBrand}
      />
    );
  });

  test('renders all inputs, the switch, and the Add Brand button', () => {
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Active\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Brand/i)).toBeInTheDocument();
  });

  test('calls brandChange function on input field changes', () => {
    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Brand' } });
    expect(mockBrandChange).toHaveBeenCalledWith('name', 'Test Brand');

    const descriptionInput = screen.getByLabelText(/Description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Brand Description' } });
    expect(mockBrandChange).toHaveBeenCalledWith('description', 'Brand Description');
  });

  test('toggles the switch state and calls brandChange function', () => {
    const switchInput = screen.getByLabelText(/Active\?/i);
    fireEvent.click(switchInput);
    expect(mockBrandChange).toHaveBeenCalledWith('isActive', true);

    fireEvent.click(switchInput);
    expect(mockBrandChange).toHaveBeenCalledWith('isActive', false);
  });

  test('calls addBrand function on form submission', () => {
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    expect(mockAddBrand).toHaveBeenCalled();
  });

  test('displays error messages for invalid fields', () => {
    const mockErrors = {
      name: 'Brand name is required',
      description: 'Description is required',
    };

    render(
      <AddBrand
        brandFormData={mockBrandFormData}
        formErrors={mockErrors}
        brandChange={mockBrandChange}
        addBrand={mockAddBrand}
      />
    );

    expect(screen.getByText(/Brand name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
  });
});
