import React from 'react';

interface NutritionData {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  goalCalories: number;
  goalProtein: number;
  goalCarbs: number;
  goalFat: number;
}

interface NutritionSummaryProps {
  nutritionData: NutritionData;
  date: string;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ nutritionData, date }) => {
  const calculatePercentage = (current: number, goal: number) => {
    if (goal <= 0) return 0;
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  const caloriePercentage = calculatePercentage(nutritionData.totalCalories, nutritionData.goalCalories);
  const proteinPercentage = calculatePercentage(nutritionData.totalProtein, nutritionData.goalProtein);
  const carbsPercentage = calculatePercentage(nutritionData.totalCarbs, nutritionData.goalCarbs);
  const fatPercentage = calculatePercentage(nutritionData.totalFat, nutritionData.goalFat);

  return (
    <div className="nutrition-summary">
      <h2>Nutrition Summary for {date}</h2>
      
      <div className="nutrition-overview">
        <div className="nutrition-metric">
          <h3>Calories</h3>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${caloriePercentage}%` }}></div>
          </div>
          <p>{nutritionData.totalCalories} / {nutritionData.goalCalories} kcal</p>
        </div>
        
        <div className="nutrition-metric">
          <h3>Protein</h3>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${proteinPercentage}%` }}></div>
          </div>
          <p>{nutritionData.totalProtein} / {nutritionData.goalProtein} g</p>
        </div>
        
        <div className="nutrition-metric">
          <h3>Carbs</h3>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${carbsPercentage}%` }}></div>
          </div>
          <p>{nutritionData.totalCarbs} / {nutritionData.goalCarbs} g</p>
        </div>
        
        <div className="nutrition-metric">
          <h3>Fat</h3>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${fatPercentage}%` }}></div>
          </div>
          <p>{nutritionData.totalFat} / {nutritionData.goalFat} g</p>
        </div>
      </div>
      
      <div className="macronutrient-chart">
        <h3>Macronutrient Distribution</h3>
        <div className="chart-placeholder">
          {/* In a real implementation, this would be a pie chart showing macronutrient breakdown */}
          <p>Pie chart showing protein, carbs, and fat distribution would appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default NutritionSummary;