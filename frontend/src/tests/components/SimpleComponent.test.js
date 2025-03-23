import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Create a simple component that doesn't depend on Chakra UI
const SimpleComponent = ({ title, description }) => (
  <div>
    <h1 data-testid="simple-title">{title}</h1>
    <p data-testid="simple-description">{description}</p>
  </div>
);

describe('SimpleComponent', () => {
  it('renders title and description correctly', () => {
    render(
      <SimpleComponent 
        title="Test Title" 
        description="Test Description" 
      />
    );

    // Check that the title and description are rendered
    expect(screen.getByTestId('simple-title')).toHaveTextContent('Test Title');
    expect(screen.getByTestId('simple-description')).toHaveTextContent('Test Description');
  });

  it('handles empty props gracefully', () => {
    render(<SimpleComponent title="" description="" />);

    // Check that the component renders even with empty props
    expect(screen.getByTestId('simple-title')).toBeInTheDocument();
    expect(screen.getByTestId('simple-description')).toBeInTheDocument();
  });
});