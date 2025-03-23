const { Exercise } = require('../models/workoutModel');
const { logger } = require('../utils/logger');

/**
 * Generate a workout plan based on user's goal and preferences
 * @param {Object} goal - User's goal
 * @param {Object} user - User object with preferences
 * @returns {Object} Generated workout plan
 */
const generateWorkoutPlan = async (goal, user) => {
  try {
    // This is a simplified version - in production this would be more sophisticated
    const workoutPlans = [];
    const schedule = [];
    
    // Determine workout frequency based on goal and preferences
    const weeklyFrequency = goal.weeklyWorkoutFrequency || 3;
    
    // Get preferred days or default to common workout days
    const preferredDays = user.workoutPreferences?.preferredDays || 
      ['monday', 'wednesday', 'friday', 'saturday'];
    
    // Limit to the number of days per week the user wants to work out
    const workoutDays = preferredDays.slice(0, weeklyFrequency);
    
    // Determine workout types based on goals
    let workoutTypes = [];
    
    if (goal.primaryGoal === 'lose-weight') {
      workoutTypes = ['cardio', 'hiit', 'circuit'];
    } else if (goal.primaryGoal === 'gain-muscle') {
      workoutTypes = ['strength', 'hypertrophy'];
    } else if (goal.primaryGoal === 'improve-fitness') {
      workoutTypes = ['cardio', 'strength', 'circuit'];
    } else if (goal.primaryGoal === 'increase-strength') {
      workoutTypes = ['strength', 'powerlifting'];
    } else {
      workoutTypes = ['strength', 'cardio'];
    }
    
    // Get user equipment preferences or default to bodyweight
    const equipment = user.workoutPreferences?.equipmentAvailable || ['none'];
    
    // Fetch exercises that match the criteria
    const exercises = await Exercise.find({
      equipment: { $in: equipment },
      type: { $in: ['compound', 'isolation'] }
    });
    
    // Group exercises by muscle group
    const exercisesByMuscle = {
      chest: exercises.filter(e => e.muscleGroups.includes('chest')),
      back: exercises.filter(e => e.muscleGroups.includes('back')),
      legs: exercises.filter(e => 
        e.muscleGroups.includes('quadriceps') || 
        e.muscleGroups.includes('hamstrings') || 
        e.muscleGroups.includes('glutes')
      ),
      shoulders: exercises.filter(e => e.muscleGroups.includes('shoulders')),
      arms: exercises.filter(e => 
        e.muscleGroups.includes('biceps') || 
        e.muscleGroups.includes('triceps')
      ),
      core: exercises.filter(e => e.muscleGroups.includes('abs'))
    };
    
    // Create workout plans based on goal
    if (goal.primaryGoal === 'gain-muscle' || goal.primaryGoal === 'increase-strength') {
      // Push/Pull/Legs split
      const pushWorkout = {
        name: 'Push Day',
        description: 'Chest, shoulders, and triceps workout',
        type: 'strength',
        difficulty: 'intermediate',
        exercises: [
          ...exercisesByMuscle.chest.slice(0, 2).map(e => ({
            exerciseId: e._id,
            sets: 4,
            reps: 8,
            restBetweenSets: 90
          })),
          ...exercisesByMuscle.shoulders.slice(0, 2).map(e => ({
            exerciseId: e._id,
            sets: 3,
            reps: 10,
            restBetweenSets: 60
          })),
          ...exercisesByMuscle.arms.filter(e => 
            e.muscleGroups.includes('triceps')
          ).slice(0, 2).map(e => ({
            exerciseId: e._id,
            sets: 3,
            reps: 12,
            restBetweenSets: 60
          }))
        ],
        estimatedDuration: 60,
        notes: 'Focus on compound movements first, then isolation'
      };
      
      const pullWorkout = {
        name: 'Pull Day',
        description: 'Back and biceps workout',
        type: 'strength',
        difficulty: 'intermediate',
        exercises: [
          ...exercisesByMuscle.back.slice(0, 3).map(e => ({
            exerciseId: e._id,
            sets: 4,
            reps: 8,
            restBetweenSets: 90
          })),
          ...exercisesByMuscle.arms.filter(e => 
            e.muscleGroups.includes('biceps')
          ).slice(0, 2).map(e => ({
            exerciseId: e._id,
            sets: 3,
            reps: 12,
            restBetweenSets: 60
          }))
        ],
        estimatedDuration: 50,
        notes: 'Start with compound back exercises, then move to isolation'
      };
      
      const legWorkout = {
        name: 'Leg Day',
        description: 'Lower body workout',
        type: 'strength',
        difficulty: 'intermediate',
        exercises: [
          ...exercisesByMuscle.legs.slice(0, 4).map(e => ({
            exerciseId: e._id,
            sets: 4,
            reps: 10,
            restBetweenSets: 90
          })),
          ...exercisesByMuscle.core.slice(0, 2).map(e => ({
            exerciseId: e._id,
            sets: 3,
            reps: 15,
            restBetweenSets: 45
          }))
        ],
        estimatedDuration: 60,
        notes: 'Focus on compound leg movements and proper form'
      };
      
      workoutPlans.push(pushWorkout, pullWorkout, legWorkout);
      
      // Assign workouts to days
      for (let i = 0; i < Math.min(weeklyFrequency, workoutDays.length); i++) {
        schedule.push({
          dayOfWeek: workoutDays[i],
          workoutPlan: workoutPlans[i % workoutPlans.length]._id,
          startTime: user.workoutPreferences?.preferredTime || '18:00',
          notes: `${workoutPlans[i % workoutPlans.length].name}`
        });
      }
    } else if (goal.primaryGoal === 'lose-weight') {
      // HIIT and circuit training
      const hiitWorkout = {
        name: 'HIIT Cardio',
        description: 'High intensity interval training',
        type: 'hiit',
        difficulty: 'intermediate',
        exercises: [
          // Simplified HIIT exercises
          {
            exerciseId: exercises.find(e => e.type === 'cardio')?._id,
            sets: 10,
            reps: 1, // 30 seconds on
            restBetweenSets: 15 // 15 seconds off
          }
        ],
        estimatedDuration: 30,
        notes: '30 seconds of work, 15 seconds of rest'
      };
      
      const circuitWorkout = {
        name: 'Full Body Circuit',
        description: 'Full body workout with minimal rest',
        type: 'circuit',
        difficulty: 'intermediate',
        exercises: [
          // One exercise per major muscle group
          ...Object.values(exercisesByMuscle).map(muscleGroup => {
            const exercise = muscleGroup[0];
            return exercise ? {
              exerciseId: exercise._id,
              sets: 3,
              reps: 15,
              restBetweenSets: 30
            } : null;
          }).filter(Boolean)
        ],
        estimatedDuration: 45,
        notes: 'Perform exercises as a circuit with minimal rest between exercises'
      };
      
      const cardioWorkout = {
        name: 'Steady State Cardio',
        description: 'Moderate intensity cardio session',
        type: 'cardio',
        difficulty: 'beginner',
        exercises: [
          {
            exerciseId: exercises.find(e => e.type === 'cardio')?._id,
            sets: 1,
            reps: 1,
            restBetweenSets: 0
          }
        ],
        estimatedDuration: 30,
        notes: '30 minutes of moderate intensity cardio'
      };
      
      workoutPlans.push(hiitWorkout, circuitWorkout, cardioWorkout);
      
      // Assign workouts to days
      for (let i = 0; i < Math.min(weeklyFrequency, workoutDays.length); i++) {
        schedule.push({
          dayOfWeek: workoutDays[i],
          workoutPlan: workoutPlans[i % workoutPlans.length]._id,
          startTime: user.workoutPreferences?.preferredTime || '18:00',
          notes: `${workoutPlans[i % workoutPlans.length].name}`
        });
      }
    } else {
      // General fitness - full body workouts
      const fullBodyWorkout1 = {
        name: 'Full Body Workout A',
        description: 'Complete full body workout focusing on major muscle groups',
        type: 'strength',
        difficulty: 'intermediate',
        exercises: [
          // One compound exercise per major muscle group
          ...Object.values(exercisesByMuscle).map(muscleGroup => {
            const exercise = muscleGroup.find(e => e.type === 'compound') || muscleGroup[0];
            return exercise ? {
              exerciseId: exercise._id,
              sets: 3,
              reps: 10,
              restBetweenSets: 60
            } : null;
          }).filter(Boolean)
        ],
        estimatedDuration: 60,
        notes: 'Focus on form and controlled movements'
      };
      
      const fullBodyWorkout2 = {
        name: 'Full Body Workout B',
        description: 'Alternative full body workout with different exercises',
        type: 'strength',
        difficulty: 'intermediate',
        exercises: [
          // Different exercises for variety
          ...Object.values(exercisesByMuscle).map(muscleGroup => {
            const exercise = muscleGroup.length > 1 ? muscleGroup[1] : muscleGroup[0];
            return exercise ? {
              exerciseId: exercise._id,
              sets: 3,
              reps: 12,
              restBetweenSets: 60
            } : null;
          }).filter(Boolean)
        ],
        estimatedDuration: 60,
        notes: 'Alternative exercises for muscle confusion'
      };
      
      const cardioSession = {
        name: 'Cardio Session',
        description: 'Mixed cardio workout',
        type: 'cardio',
        difficulty: 'intermediate',
        exercises: [
          {
            exerciseId: exercises.find(e => e.type === 'cardio')?._id,
            sets: 1,
            reps: 1,
            restBetweenSets: 0
          }
        ],
        estimatedDuration: 30,
        notes: '30 minutes of varied cardio'
      };
      
      workoutPlans.push(fullBodyWorkout1, fullBodyWorkout2, cardioSession);
      
      // Assign workouts to days
      for (let i = 0; i < Math.min(weeklyFrequency, workoutDays.length); i++) {
        schedule.push({
          dayOfWeek: workoutDays[i],
          workoutPlan: workoutPlans[i % workoutPlans.length]._id,
          startTime: user.workoutPreferences?.preferredTime || '18:00',
          notes: `${workoutPlans[i % workoutPlans.length].name}`
        });
      }
    }
    
    return { plans: workoutPlans, schedule };
  } catch (error) {
    logger.error(`Error generating workout plan: ${error.message}`);
    throw error;
  }
};

module.exports = {
  generateWorkoutPlan
};