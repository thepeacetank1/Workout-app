import React from 'react';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  mealType: string;
  date: string;
  time: string;
}

interface FoodHistoryProps {
  foodEntries: FoodEntry[];
  onDeleteEntry: (id: string) => void;
}

const FoodHistory: React.FC<FoodHistoryProps> = ({ foodEntries, onDeleteEntry }) => {
  // Group food entries by date and meal type
  const groupedEntries: Record<string, Record<string, FoodEntry[]>> = {};
  
  foodEntries.forEach(entry => {
    if (!groupedEntries[entry.date]) {
      groupedEntries[entry.date] = {};
    }
    
    if (!groupedEntries[entry.date][entry.mealType]) {
      groupedEntries[entry.date][entry.mealType] = [];
    }
    
    groupedEntries[entry.date][entry.mealType].push(entry);
  });

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(groupedEntries).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Define meal type order
  const mealTypeOrder = ['breakfast', 'lunch', 'dinner', 'snack'];
  
  return (
    <div className="food-history">
      <h2>Food History</h2>
      
      {sortedDates.length === 0 ? (
        <p>No food entries logged yet. Start logging your meals to see them here.</p>
      ) : (
        sortedDates.map(date => (
          <div key={date} className="day-entries">
            <h3>{new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            
            {mealTypeOrder.map(mealType => {
              const entries = groupedEntries[date][mealType];
              if (!entries || entries.length === 0) return null;
              
              return (
                <div key={`${date}-${mealType}`} className="meal-section">
                  <h4>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h4>
                  <ul className="food-entries-list">
                    {entries.map(entry => (
                      <li key={entry.id} className="food-entry">
                        <div className="food-entry-header">
                          <h5>{entry.name}</h5>
                          <span>{entry.time}</span>
                        </div>
                        <div className="food-entry-details">
                          <span>{entry.servingSize}</span>
                          <span>{entry.calories} kcal</span>
                          <span>{entry.protein}g protein</span>
                          <span>{entry.carbs}g carbs</span>
                          <span>{entry.fat}g fat</span>
                        </div>
                        <button 
                          className="delete-entry" 
                          onClick={() => onDeleteEntry(entry.id)}
                          aria-label={`Delete ${entry.name}`}
                        >
                          &times;
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
};

export default FoodHistory;