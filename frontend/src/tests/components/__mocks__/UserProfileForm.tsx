import React, { useState } from 'react';

// Mock of UserProfileForm that matches the test expectations
const MockUserProfileForm = ({ onSaveSuccess, initialData }: any) => {
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [goals, setGoals] = useState(initialData?.goals || []);
  const [newGoal, setNewGoal] = useState('');
  
  const handleSave = () => {
    if (!name || !email) {
      setShowValidationErrors(true);
      return;
    }
    
    if (onSaveSuccess) {
      onSaveSuccess();
    }
  };
  
  const addGoal = () => {
    if (newGoal) {
      setGoals([...goals, newGoal]);
      setNewGoal('');
    }
  };
  
  const removeGoal = (index: number) => {
    const newGoals = [...goals];
    newGoals.splice(index, 1);
    setGoals(newGoals);
  };

  return (
    <div data-testid="user-profile-form">
      <h1>Your Profile</h1>
      <div role="tablist" data-testid="profile-tabs">
        <button role="tab" data-testid="personal-info-tab">Personal Info</button>
        <button role="tab" data-testid="body-metrics-tab">Body Metrics</button>
        <button role="tab" data-testid="fitness-goals-tab">Fitness Goals</button>
        <button role="tab" data-testid="diet-tab">Diet</button>
        <button role="tab" data-testid="preferences-tab">Preferences</button>
      </div>
      
      <div data-testid="profile-tab-panels">
        <div data-testid="personal-info-panel" role="tabpanel">
          <div>
            <label htmlFor="name">Full Name</label>
            <input 
              id="name"
              data-testid="name-input" 
              value={name || (initialData?.name || '')}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={showValidationErrors && !name}
            />
            {showValidationErrors && !name && (
              <div data-testid="name-error">Name is required</div>
            )}
          </div>
          
          <div>
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              data-testid="email-input" 
              value={email || (initialData?.email || '')}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={showValidationErrors && !email}
            />
            {showValidationErrors && !email && (
              <div data-testid="email-error">Email is required</div>
            )}
          </div>
          
          <div>
            <label htmlFor="bio">Bio</label>
            <textarea 
              id="bio"
              data-testid="bio-input" 
              defaultValue={initialData?.bio || ''} 
            />
          </div>
        </div>
        
        <div data-testid="body-metrics-panel" role="tabpanel" style={{ display: 'none' }}>
          <input 
            data-testid="weight-input" 
            defaultValue={initialData?.measurements?.weight || ''} 
          />
          <input 
            data-testid="height-input" 
            defaultValue={initialData?.measurements?.height || ''} 
          />
        </div>
        
        <div data-testid="fitness-goals-panel" role="tabpanel" style={{ display: 'none' }}>
          <ul data-testid="goals-list">
            {goals.map((goal: string, index: number) => (
              <li key={index} data-testid={`goal-${index}`}>
                {goal}
                <button 
                  data-testid={`remove-goal-${index}`}
                  onClick={() => removeGoal(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <input 
            data-testid="goal-input"
            placeholder="Add a fitness goal"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
          />
          <button 
            data-testid="add-goal-button" 
            onClick={addGoal}
          >
            Add
          </button>
        </div>
        
        <div data-testid="diet-panel" role="tabpanel" style={{ display: 'none' }}>
          <h3>Diet Preferences</h3>
          <div>
            <label>
              <input 
                type="checkbox" 
                data-testid="vegetarian-checkbox" 
                defaultChecked={initialData?.diet?.vegetarian} 
              />
              Vegetarian
            </label>
          </div>
          <div>
            <label>
              <input 
                type="checkbox" 
                data-testid="vegan-checkbox" 
                defaultChecked={initialData?.diet?.vegan} 
              />
              Vegan
            </label>
          </div>
        </div>
        
        <div data-testid="preferences-panel" role="tabpanel" style={{ display: 'none' }}>
          <label>
            <input 
              type="checkbox" 
              data-testid="email-notifications-checkbox" 
              defaultChecked={initialData?.preferences?.emailNotifications} 
            />
            Email Notifications
          </label>
        </div>
      </div>
      
      <button 
        data-testid="save-profile-button" 
        onClick={handleSave}
      >
        Save Profile
      </button>
    </div>
  );
};

// Add the mock updateUserProfile function
const mockUpdateUserProfile = jest.fn().mockImplementation((profileData) => {
  return Promise.resolve(profileData);
});

// Export the default and named exports
export default MockUserProfileForm;
export { mockUpdateUserProfile as updateUserProfile };