import React from 'react';

interface ActivityDataPoint {
  date: string;
  workoutMinutes: number;
  caloriesBurned: number;
}

interface ActivityChartProps {
  activityData: ActivityDataPoint[];
  timeFrame: 'week' | 'month' | 'year';
  onTimeFrameChange: (timeFrame: 'week' | 'month' | 'year') => void;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ 
  activityData, 
  timeFrame, 
  onTimeFrameChange 
}) => {
  // In a real implementation, this would use a charting library like Chart.js or Recharts
  // For now, we'll create a simple visual representation
  
  const maxWorkoutMinutes = Math.max(...activityData.map(d => d.workoutMinutes), 60);
  
  return (
    <div className="activity-chart">
      <div className="chart-header">
        <h3>Activity Overview</h3>
        <div className="time-frame-selector">
          <button 
            className={timeFrame === 'week' ? 'active' : ''} 
            onClick={() => onTimeFrameChange('week')}
          >
            Week
          </button>
          <button 
            className={timeFrame === 'month' ? 'active' : ''} 
            onClick={() => onTimeFrameChange('month')}
          >
            Month
          </button>
          <button 
            className={timeFrame === 'year' ? 'active' : ''} 
            onClick={() => onTimeFrameChange('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      <div className="chart-placeholder">
        <p>Activity chart showing workout minutes and calories burned would appear here.</p>
        <p>In a real implementation, this would use a proper charting library.</p>
      </div>
      
      <div className="activity-bars">
        {activityData.map((data, index) => (
          <div key={index} className="activity-day">
            <div className="bar-container">
              <div 
                className="activity-bar" 
                style={{ height: `${(data.workoutMinutes / maxWorkoutMinutes) * 100}%` }}
                title={`${data.workoutMinutes} minutes, ${data.caloriesBurned} calories`}
              ></div>
            </div>
            <span className="day-label">
              {new Date(data.date).toLocaleDateString(undefined, 
                timeFrame === 'week' ? { weekday: 'short' } : 
                timeFrame === 'month' ? { day: 'numeric' } : 
                { month: 'short' }
              )}
            </span>
          </div>
        ))}
      </div>
      
      <div className="chart-summary">
        <div className="summary-stat">
          <span className="stat-value">
            {activityData.reduce((sum, data) => sum + data.workoutMinutes, 0)} min
          </span>
          <span className="stat-label">Total Workout Time</span>
        </div>
        <div className="summary-stat">
          <span className="stat-value">
            {activityData.reduce((sum, data) => sum + data.caloriesBurned, 0)} kcal
          </span>
          <span className="stat-label">Total Calories Burned</span>
        </div>
        <div className="summary-stat">
          <span className="stat-value">
            {activityData.filter(data => data.workoutMinutes > 0).length}
          </span>
          <span className="stat-label">Active Days</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;