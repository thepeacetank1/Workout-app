import React, { useState } from 'react';

interface DietPreference {
  calorieGoal: number;
  dietType: string;
  restrictions: string[];
  budgetConstraint: number;
  mealsPerDay: number;
  preferredCuisines: string[];
}

interface DietPreferencesProps {
  currentPreferences: DietPreference;
  onSavePreferences: (preferences: DietPreference) => void;
}

const DietPreferences: React.FC<DietPreferencesProps> = ({ 
  currentPreferences, 
  onSavePreferences 
}) => {
  const [preferences, setPreferences] = useState<DietPreference>(currentPreferences);
  const [newRestriction, setNewRestriction] = useState('');
  const [newCuisine, setNewCuisine] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences({
      ...preferences,
      [name]: ['calorieGoal', 'budgetConstraint', 'mealsPerDay'].includes(name) 
        ? Number(value) 
        : value
    });
  };

  const handleAddRestriction = () => {
    if (newRestriction.trim() !== '' && !preferences.restrictions.includes(newRestriction.trim())) {
      setPreferences({
        ...preferences,
        restrictions: [...preferences.restrictions, newRestriction.trim()]
      });
      setNewRestriction('');
    }
  };

  const handleRemoveRestriction = (restriction: string) => {
    setPreferences({
      ...preferences,
      restrictions: preferences.restrictions.filter(r => r !== restriction)
    });
  };

  const handleAddCuisine = () => {
    if (newCuisine.trim() !== '' && !preferences.preferredCuisines.includes(newCuisine.trim())) {
      setPreferences({
        ...preferences,
        preferredCuisines: [...preferences.preferredCuisines, newCuisine.trim()]
      });
      setNewCuisine('');
    }
  };

  const handleRemoveCuisine = (cuisine: string) => {
    setPreferences({
      ...preferences,
      preferredCuisines: preferences.preferredCuisines.filter(c => c !== cuisine)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePreferences(preferences);
  };

  return (
    <div className="diet-preferences">
      <h2>Diet Preferences</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="calorieGoal">Daily Calorie Goal</label>
          <input
            type="number"
            id="calorieGoal"
            name="calorieGoal"
            min="1000"
            max="5000"
            value={preferences.calorieGoal}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="dietType">Diet Type</label>
          <select
            id="dietType"
            name="dietType"
            value={preferences.dietType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a diet type</option>
            <option value="regular">Regular</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="keto">Keto</option>
            <option value="paleo">Paleo</option>
            <option value="mediterranean">Mediterranean</option>
            <option value="lowCarb">Low Carb</option>
            <option value="lowFat">Low Fat</option>
            <option value="highProtein">High Protein</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Dietary Restrictions</label>
          <div className="tag-input-container">
            <div className="tag-input-field">
              <input
                type="text"
                value={newRestriction}
                onChange={(e) => setNewRestriction(e.target.value)}
                placeholder="e.g., gluten-free, dairy-free, nut allergy"
              />
              <button type="button" onClick={handleAddRestriction}>Add</button>
            </div>
            <div className="tags-container">
              {preferences.restrictions.map((restriction) => (
                <div key={restriction} className="tag">
                  <span>{restriction}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveRestriction(restriction)}
                    aria-label={`Remove ${restriction}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="budgetConstraint">Weekly Budget (USD)</label>
          <input
            type="number"
            id="budgetConstraint"
            name="budgetConstraint"
            min="0"
            step="10"
            value={preferences.budgetConstraint}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="mealsPerDay">Meals Per Day</label>
          <input
            type="number"
            id="mealsPerDay"
            name="mealsPerDay"
            min="3"
            max="6"
            value={preferences.mealsPerDay}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Preferred Cuisines</label>
          <div className="tag-input-container">
            <div className="tag-input-field">
              <input
                type="text"
                value={newCuisine}
                onChange={(e) => setNewCuisine(e.target.value)}
                placeholder="e.g., Italian, Mexican, Thai"
              />
              <button type="button" onClick={handleAddCuisine}>Add</button>
            </div>
            <div className="tags-container">
              {preferences.preferredCuisines.map((cuisine) => (
                <div key={cuisine} className="tag">
                  <span>{cuisine}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveCuisine(cuisine)}
                    aria-label={`Remove ${cuisine}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary">Save Preferences</button>
      </form>
    </div>
  );
};

export default DietPreferences;