import React from 'react';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  recipe?: string;
  imageUrl?: string;
}

interface DailyPlan {
  day: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal[];
  };
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface DietPlanProps {
  weeklyPlan: DailyPlan[];
  userCalorieGoal: number;
  userProteinGoal: number;
  userCarbsGoal: number;
  userFatGoal: number;
}

const DietPlan: React.FC<DietPlanProps> = ({ 
  weeklyPlan, 
  userCalorieGoal, 
  userProteinGoal, 
  userCarbsGoal, 
  userFatGoal 
}) => {
  return (
    <div className="diet-plan">
      <h2>Your Personalized Diet Plan</h2>
      
      <div className="plan-summary">
        <h3>Weekly Overview</h3>
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-label">Daily Calorie Target:</span>
            <span className="stat-value">{userCalorieGoal} kcal</span>
          </div>
          <div className="stat">
            <span className="stat-label">Protein Goal:</span>
            <span className="stat-value">{userProteinGoal}g</span>
          </div>
          <div className="stat">
            <span className="stat-label">Carbs Goal:</span>
            <span className="stat-value">{userCarbsGoal}g</span>
          </div>
          <div className="stat">
            <span className="stat-label">Fat Goal:</span>
            <span className="stat-value">{userFatGoal}g</span>
          </div>
        </div>
      </div>
      
      <div className="weekly-plan">
        {weeklyPlan.map((dailyPlan) => (
          <div key={dailyPlan.day} className="daily-plan">
            <h3>{dailyPlan.day}</h3>
            
            <div className="daily-summary">
              <p>Total: {dailyPlan.totalCalories} kcal ({dailyPlan.totalProtein}g protein, {dailyPlan.totalCarbs}g carbs, {dailyPlan.totalFat}g fat)</p>
            </div>
            
            <div className="meals">
              <div className="meal-section">
                <h4>Breakfast</h4>
                <div className="meal-card">
                  <h5>{dailyPlan.meals.breakfast.name}</h5>
                  <p className="meal-macros">
                    {dailyPlan.meals.breakfast.calories} kcal | 
                    {dailyPlan.meals.breakfast.protein}g protein | 
                    {dailyPlan.meals.breakfast.carbs}g carbs | 
                    {dailyPlan.meals.breakfast.fat}g fat
                  </p>
                  <div className="meal-ingredients">
                    <h6>Ingredients:</h6>
                    <ul>
                      {dailyPlan.meals.breakfast.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  {dailyPlan.meals.breakfast.recipe && (
                    <div className="meal-recipe">
                      <h6>Recipe:</h6>
                      <p>{dailyPlan.meals.breakfast.recipe}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="meal-section">
                <h4>Lunch</h4>
                <div className="meal-card">
                  <h5>{dailyPlan.meals.lunch.name}</h5>
                  <p className="meal-macros">
                    {dailyPlan.meals.lunch.calories} kcal | 
                    {dailyPlan.meals.lunch.protein}g protein | 
                    {dailyPlan.meals.lunch.carbs}g carbs | 
                    {dailyPlan.meals.lunch.fat}g fat
                  </p>
                  <div className="meal-ingredients">
                    <h6>Ingredients:</h6>
                    <ul>
                      {dailyPlan.meals.lunch.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  {dailyPlan.meals.lunch.recipe && (
                    <div className="meal-recipe">
                      <h6>Recipe:</h6>
                      <p>{dailyPlan.meals.lunch.recipe}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="meal-section">
                <h4>Dinner</h4>
                <div className="meal-card">
                  <h5>{dailyPlan.meals.dinner.name}</h5>
                  <p className="meal-macros">
                    {dailyPlan.meals.dinner.calories} kcal | 
                    {dailyPlan.meals.dinner.protein}g protein | 
                    {dailyPlan.meals.dinner.carbs}g carbs | 
                    {dailyPlan.meals.dinner.fat}g fat
                  </p>
                  <div className="meal-ingredients">
                    <h6>Ingredients:</h6>
                    <ul>
                      {dailyPlan.meals.dinner.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  {dailyPlan.meals.dinner.recipe && (
                    <div className="meal-recipe">
                      <h6>Recipe:</h6>
                      <p>{dailyPlan.meals.dinner.recipe}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {dailyPlan.meals.snacks.length > 0 && (
                <div className="meal-section">
                  <h4>Snacks</h4>
                  {dailyPlan.meals.snacks.map((snack) => (
                    <div key={snack.id} className="meal-card">
                      <h5>{snack.name}</h5>
                      <p className="meal-macros">
                        {snack.calories} kcal | 
                        {snack.protein}g protein | 
                        {snack.carbs}g carbs | 
                        {snack.fat}g fat
                      </p>
                      <div className="meal-ingredients">
                        <h6>Ingredients:</h6>
                        <ul>
                          {snack.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="shopping-list-section">
        <h3>Generate Shopping List</h3>
        <button className="btn btn-primary">Generate Shopping List</button>
      </div>
    </div>
  );
};

export default DietPlan;