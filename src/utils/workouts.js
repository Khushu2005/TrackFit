// src/utils/workouts.js

// 15 Mins Warmup (Dynamic movements to prevent injury)
export const WARMUP_EXERCISES = [
  { id: 'w1', name: 'Jumping Jacks', type: 'Cardio', sets: 1, reps: '40s', activeTime: 40, restTime: 20 },
  { id: 'w2', name: 'High Knees', type: 'Cardio', sets: 1, reps: '40s', activeTime: 40, restTime: 20 },
  { id: 'w3', name: 'Arm Circles', type: 'Flexibility', sets: 1, reps: '30s', activeTime: 30, restTime: 10 },
  { id: 'w4', name: 'Bodyweight Squats', type: 'Mobility', sets: 1, reps: '15 reps', activeTime: 45, restTime: 15 },
  { id: 'w5', name: 'Walkouts (Inchworms)', type: 'Full Body', sets: 1, reps: '5 reps', activeTime: 50, restTime: 10 },
];

export const getRecommendedWorkouts = (goal, bmi) => {
  // Bhaai, yahan maine itni exercises daal di hain ki 90 mins bhi aaram se fill ho jayenge!
  if (goal === 'loss') {
    return [
      { id: 'l1', name: 'Burpees', type: 'HIIT Burn', sets: 3, reps: '10 reps', activeTime: 45, restTime: 30 },
      { id: 'l2', name: 'Mountain Climbers', type: 'Core Cardio', sets: 3, reps: '40s', activeTime: 40, restTime: 20 },
      { id: 'l3', name: 'Knee Pushups', type: 'Upper Body', sets: 3, reps: '12 reps', activeTime: 40, restTime: 30 },
      { id: 'l4', name: 'Alternating Lunges', type: 'Lower Body', sets: 3, reps: '20 reps', activeTime: 50, restTime: 20 },
      { id: 'l5', name: 'Plank Hold', type: 'Core', sets: 3, reps: '45s', activeTime: 45, restTime: 20 },
      { id: 'l6', name: 'Glute Bridges', type: 'Lower Body', sets: 3, reps: '15 reps', activeTime: 40, restTime: 20 },
      { id: 'l7', name: 'Russian Twists', type: 'Obliques', sets: 3, reps: '30 reps', activeTime: 45, restTime: 20 },
      { id: 'l8', name: 'Jump Squats', type: 'Explosive', sets: 3, reps: '12 reps', activeTime: 40, restTime: 30 },
      { id: 'l9', name: 'Bicycle Crunches', type: 'Core', sets: 3, reps: '30 reps', activeTime: 45, restTime: 15 },
      { id: 'l10', name: 'Leg Raises', type: 'Lower Abs', sets: 3, reps: '15 reps', activeTime: 45, restTime: 20 },
      { id: 'l11', name: 'Shadow Boxing', type: 'Cardio', sets: 3, reps: '60s', activeTime: 60, restTime: 30 },
      { id: 'l12', name: 'Squat Pulses', type: 'Legs Burn', sets: 3, reps: '30s', activeTime: 30, restTime: 15 },
      { id: 'l13', name: 'Tricep Dips (on Chair)', type: 'Arms', sets: 3, reps: '15 reps', activeTime: 40, restTime: 30 },
      { id: 'l14', name: 'Spiderman Plank', type: 'Obliques', sets: 3, reps: '20 reps', activeTime: 50, restTime: 30 },
      { id: 'l15', name: 'High Plank Shoulder Taps', type: 'Core/Arms', sets: 3, reps: '20 reps', activeTime: 45, restTime: 20 },
      { id: 'l16', name: 'Skaters', type: 'Agility', sets: 3, reps: '40s', activeTime: 40, restTime: 20 },
      { id: 'l17', name: 'Flutter Kicks', type: 'Core', sets: 3, reps: '40s', activeTime: 40, restTime: 20 }
    ];
  } else {
    // Weight Gain (Hypertrophy / Strength Building - Takes more rest time usually)
    return [
      { id: 'g1', name: 'Barbell Squats', type: 'Legs', sets: 4, reps: '8-10 reps', activeTime: 45, restTime: 90 },
      { id: 'g2', name: 'Dumbbell Bench Press', type: 'Chest', sets: 4, reps: '8-10 reps', activeTime: 45, restTime: 90 },
      { id: 'g3', name: 'Deadlifts', type: 'Back/Legs', sets: 4, reps: '6-8 reps', activeTime: 45, restTime: 120 },
      { id: 'g4', name: 'Pull-ups', type: 'Back', sets: 3, reps: 'Till Failure', activeTime: 40, restTime: 90 },
      { id: 'g5', name: 'Overhead Shoulder Press', type: 'Shoulders', sets: 3, reps: '10 reps', activeTime: 40, restTime: 60 },
      { id: 'g6', name: 'Bent Over Rows', type: 'Back', sets: 3, reps: '12 reps', activeTime: 45, restTime: 60 },
      { id: 'g7', name: 'Dumbbell Lunges', type: 'Legs', sets: 3, reps: '12 reps/leg', activeTime: 60, restTime: 60 },
      { id: 'g8', name: 'Bicep Curls', type: 'Arms', sets: 3, reps: '15 reps', activeTime: 40, restTime: 45 },
      { id: 'g9', name: 'Overhead Tricep Extension', type: 'Arms', sets: 3, reps: '15 reps', activeTime: 40, restTime: 45 },
      { id: 'g10', name: 'Calf Raises', type: 'Calves', sets: 4, reps: '20 reps', activeTime: 40, restTime: 45 },
      { id: 'g11', name: 'Lat Pulldowns', type: 'Back', sets: 3, reps: '12 reps', activeTime: 45, restTime: 60 },
      { id: 'g12', name: 'Chest Flyes', type: 'Chest', sets: 3, reps: '12 reps', activeTime: 45, restTime: 60 },
      { id: 'g13', name: 'Bulgarian Split Squats', type: 'Legs', sets: 3, reps: '10 reps/leg', activeTime: 60, restTime: 90 },
      { id: 'g14', name: 'Lateral Raises', type: 'Shoulders', sets: 3, reps: '15 reps', activeTime: 40, restTime: 45 },
      { id: 'g15', name: 'Leg Press', type: 'Legs', sets: 3, reps: '12 reps', activeTime: 50, restTime: 90 }
    ];
  }
};