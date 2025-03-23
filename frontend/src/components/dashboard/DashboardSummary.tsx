import React from 'react';

interface DashboardSummaryProps {
  stats: {
    totalWorkouts: number;
    workoutStreak: number;
    caloriesBurned: number;
    goalProgress: number;
    lastWorkout: string;
    upcomingWorkout?: {
      date: string;
      time: string;
      type: string;
    };
    weightProgress?: {
      current: number;
      target: number;
      startWeight: number;
    };
    nutritionSummary: {
      averageCalories: number;
      averageProtein: number;
      averageCarbs: number;
      averageFat: number;
    };
  };
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ stats }) => {
  const calculateWeightProgressPercentage = () => {
    if (!stats.weightProgress) return 0;
    
    const { current, target, startWeight } = stats.weightProgress;
    const totalChange = Math.abs(target - startWeight);
    const currentChange = Math.abs(current - startWeight);
    
    if (totalChange === 0) return 100; // Already at target
    return Math.min(Math.round((currentChange / totalChange) * 100), 100);
  };

  return (
    <div className="dashboard-summary">
      <h2>Your Fitness Overview</h2>
      
      <div className="summary-grid">
        <div className="summary-card workouts-card">
          <h3>Workouts</h3>
          <div className="stat">
            <span className="stat-value">{stats.totalWorkouts}</span>
            <span className="stat-label">Total Workouts</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.workoutStreak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.caloriesBurned.toLocaleString()}</span>
            <span className="stat-label">Calories Burned</span>
          </div>
          <div className="stat">
            <span className="stat-label">Last Workout:</span>
            <span className="stat-value">{stats.lastWorkout}</span>
          </div>
        </div>
        
        <div className="summary-card goal-card">
          <h3>Goal Progress</h3>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${stats.goalProgress}%` }}></div>
            <span className="progress-text">{stats.goalProgress}%</span>
          </div>
          
          {stats.weightProgress && (
            <div className="weight-progress">
              <h4>Weight Progress</h4>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${calculateWeightProgressPercentage()}%` }}
                ></div>
                <span className="progress-text">{calculateWeightProgressPercentage()}%</span>
              </div>
              <div className="weight-details">
                <span>Current: {stats.weightProgress.current} kg</span>
                <span>Target: {stats.weightProgress.target} kg</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="summary-card nutrition-card">
          <h3>Nutrition Overview</h3>
          <div className="stat">
            <span className="stat-label">Avg. Daily Calories:</span>
            <span className="stat-value">{stats.nutritionSummary.averageCalories}</span>
          </div>
          <div className="macros">
            <div className="macro-stat">
              <span className="macro-value">{stats.nutritionSummary.averageProtein}g</span>
              <span className="macro-label">Protein</span>
            </div>
            <div className="macro-stat">
              <span className="macro-value">{stats.nutritionSummary.averageCarbs}g</span>
              <span className="macro-label">Carbs</span>
            </div>
            <div className="macro-stat">
              <span className="macro-value">{stats.nutritionSummary.averageFat}g</span>
              <span className="macro-label">Fat</span>
            </div>
          </div>
        </div>
        
        <div className="summary-card schedule-card">
          <h3>Schedule</h3>
          {stats.upcomingWorkout ? (
            <div className="upcoming-workout">
              <h4>Next Workout</h4>
              <p className="workout-date">{stats.upcomingWorkout.date}</p>
              <p className="workout-time">{stats.upcomingWorkout.time}</p>
              <p className="workout-type">{stats.upcomingWorkout.type}</p>
            </div>
          ) : (
            <p className="no-workouts">No upcoming workouts scheduled</p>
          )}
          <button className="btn btn-secondary">View Calendar</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;