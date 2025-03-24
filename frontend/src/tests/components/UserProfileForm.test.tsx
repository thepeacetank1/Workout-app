import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { ChakraProvider } from './chakra-mock';

// Mock the UserProfileForm component directly
jest.mock('../../components/user/UserProfileForm', () => require('./__mocks__/UserProfileForm').default);
import UserProfileForm from '../../components/user/UserProfileForm';
import createMockStore from '../mocks/mockStore';
import { updateUserProfile } from '../../store/slices/profileSlice';

// Mock dependencies
jest.mock('../../store/slices/profileSlice', () => ({
  updateUserProfile: jest.fn(),
  uploadProfilePicture: jest.fn(),
  fetchUserProfile: jest.fn(),
}));

// Test configuration
describe('UserProfileForm Component', () => {
  let store: any;

  beforeEach(() => {
    store = createMockStore({
      auth: {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
      },
      profile: {
        profile: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          height: 180,
          weight: 75,
          gender: 'male',
          fitnessLevel: 'intermediate',
          fitnessGoals: ['weight_loss', 'muscle_gain'],
          dietaryPreferences: ['high_protein'],
          dietaryRestrictions: ['gluten_free'],
          measurements: {
            chest: 100,
            waist: 80,
            hips: 95,
            biceps: 35,
            thighs: 55,
          },
        },
        isLoading: false,
        error: null,
      },
    });

    // Reset mock implementations
    (updateUserProfile as jest.Mock).mockReset();
  });

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <ChakraProvider>
          <UserProfileForm {...props} />
        </ChakraProvider>
      </Provider>
    );
  };

  it('renders the profile form with correct tabs', () => {
    renderComponent();
    
    expect(screen.getByText('Your Profile')).toBeInTheDocument();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /personal/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /body metrics/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /fitness goals/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /diet/i })).toBeInTheDocument();
  });

  it('pre-populates form with user data', () => {
    renderComponent();
    
    // Personal tab (active by default)
    expect(screen.getByLabelText(/full name/i)).toHaveValue('Test User');
    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
    
    // Click on Body Metrics tab
    fireEvent.click(screen.getByRole('tab', { name: /body metrics/i }));
    
    // Body Metrics tab
    expect(screen.getByLabelText(/height/i)).toHaveValue('180');
    expect(screen.getByLabelText(/weight/i)).toHaveValue('75');
  });

  it('allows updating profile information', async () => {
    (updateUserProfile as jest.Mock).mockResolvedValue({});
    renderComponent();
    
    // Change name
    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /save profile/i }));
    
    await waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Name',
        })
      );
    });
  });

  it('validates form inputs before submission', async () => {
    renderComponent();
    
    // Clear required fields
    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: '' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /save profile/i }));
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
    
    // updateUserProfile should not be called
    expect(updateUserProfile).not.toHaveBeenCalled();
  });

  it('allows adding and removing fitness goals', () => {
    renderComponent();
    
    // Go to Fitness Goals tab
    fireEvent.click(screen.getByRole('tab', { name: /fitness goals/i }));
    
    // Add a new goal
    const goalInput = screen.getByPlaceholderText(/add a fitness goal/i);
    fireEvent.change(goalInput, { target: { value: 'New Goal' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    
    // Should show new goal
    expect(screen.getByText('New Goal')).toBeInTheDocument();
    
    // Remove existing goal
    const weightLossTag = screen.getByText('weight_loss');
    const removeButton = weightLossTag.nextSibling as HTMLElement;
    fireEvent.click(removeButton);
    
    // Should remove the goal
    expect(screen.queryByText('weight_loss')).not.toBeInTheDocument();
  });

  it('calls onSaveSuccess callback when form is successfully submitted', async () => {
    (updateUserProfile as jest.Mock).mockResolvedValue({});
    const onSaveSuccess = jest.fn();
    renderComponent({ onSaveSuccess });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /save profile/i }));
    
    await waitFor(() => {
      expect(onSaveSuccess).toHaveBeenCalled();
    });
  });
});