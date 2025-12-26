// Food database extracted from Database.md
export const foodDatabase = [
    { name: 'Chicken Breast', quantity: '100g cooked', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
    { name: 'Bolty Fish (Tilapia)', quantity: '100g cooked', calories: 120, protein: 22, carbs: 0, fats: 3 },
    { name: 'Egg', quantity: '1 large', calories: 70, protein: 6, carbs: 0, fats: 5 },
    { name: 'Cottage Cheese', quantity: '100g', calories: 95, protein: 11, carbs: 3, fats: 4 },
    { name: 'Yogurt (Full-fat)', quantity: '100g', calories: 60, protein: 5, carbs: 4, fats: 3 },
    { name: 'Milk (Full-fat)', quantity: '250ml', calories: 105, protein: 8, carbs: 12, fats: 4 },
    { name: 'Balady Bread', quantity: '1 piece', calories: 100, protein: 3, carbs: 20, fats: 1 },
    { name: 'Potatoes (Boiled)', quantity: '100g', calories: 80, protein: 2, carbs: 18, fats: 0 },
    { name: 'Olive Oil', quantity: '1 tsp (5g)', calories: 45, protein: 0, carbs: 0, fats: 5 },
    { name: 'Mixed Vegetables', quantity: '100g', calories: 20, protein: 1, carbs: 4, fats: 0 }
]

// Meal examples from Database.md
export const mealExamples = {
    cut: [
        {
            name: 'Breakfast',
            items: [
                { name: 'Egg', quantity: '4', calories: 280, protein: 24 },
                { name: 'Balady Bread', quantity: '1', calories: 100, protein: 3 },
                { name: 'Yogurt (Full-fat)', quantity: '200g', calories: 120, protein: 10 },
                { name: 'Milk (Full-fat)', quantity: '250ml', calories: 105, protein: 8 }
            ],
            totalCalories: 620,
            totalProtein: 40
        },
        {
            name: 'Pre-Workout',
            items: [
                { name: 'Chicken Breast', quantity: '200g', calories: 330, protein: 62 },
                { name: 'Potatoes (Boiled)', quantity: '300g', calories: 240, protein: 6 },
                { name: 'Olive Oil', quantity: '1 tsp', calories: 45, protein: 0 },
                { name: 'Salad', quantity: '1 serving', calories: 35, protein: 2 }
            ],
            totalCalories: 650,
            totalProtein: 65
        },
        {
            name: 'Post-Workout',
            items: [
                { name: 'Cottage Cheese', quantity: '200g', calories: 190, protein: 22 },
                { name: 'Milk (Full-fat)', quantity: '250ml', calories: 105, protein: 8 }
            ],
            totalCalories: 300,
            totalProtein: 30
        },
        {
            name: 'Dinner',
            items: [
                { name: 'Bolty Fish (Tilapia)', quantity: '250g', calories: 300, protein: 55 },
                { name: 'Mixed Vegetables', quantity: '200g', calories: 40, protein: 2 }
            ],
            totalCalories: 350,
            totalProtein: 50
        }
    ],
    bulk: [
        {
            name: 'Breakfast',
            items: [
                { name: 'Egg', quantity: '4', calories: 280, protein: 24 },
                { name: 'Balady Bread', quantity: '2', calories: 200, protein: 6 },
                { name: 'Yogurt (Full-fat)', quantity: '200g', calories: 120, protein: 10 },
                { name: 'Milk (Full-fat)', quantity: '250ml', calories: 105, protein: 8 }
            ],
            totalCalories: 720,
            totalProtein: 48
        },
        {
            name: 'Pre-Workout',
            items: [
                { name: 'Chicken Breast', quantity: '200g', calories: 330, protein: 62 },
                { name: 'Potatoes (Boiled)', quantity: '450g', calories: 360, protein: 9 },
                { name: 'Olive Oil', quantity: '1 tsp', calories: 45, protein: 0 },
                { name: 'Salad', quantity: '1 serving', calories: 35, protein: 2 }
            ],
            totalCalories: 770,
            totalProtein: 73
        },
        {
            name: 'Post-Workout',
            items: [
                { name: 'Cottage Cheese', quantity: '200g', calories: 190, protein: 22 },
                { name: 'Milk (Full-fat)', quantity: '250ml', calories: 105, protein: 8 },
                { name: 'Banana', quantity: '1 large', calories: 120, protein: 1 }
            ],
            totalCalories: 415,
            totalProtein: 31
        },
        {
            name: 'Dinner',
            items: [
                { name: 'Bolty Fish (Tilapia)', quantity: '250g', calories: 300, protein: 55 },
                { name: 'Mixed Vegetables', quantity: '200g', calories: 40, protein: 2 },
                { name: 'Mixed Nuts', quantity: '30g', calories: 180, protein: 5 }
            ],
            totalCalories: 520,
            totalProtein: 62
        }
    ]
}

// Training split from Database.md
export const trainingSplit = [
    {
        day: 1,
        name: 'Push Strength',
        focus: 'Chest, Shoulders, Triceps',
        primary: [
            'Bench Press 4x5-8',
            'OHP 4x5-8',
            'Weighted Dips 4x6-10'
        ],
        secondary: [
            'Incline DB Press 3x8-12',
            'Tricep Pushdowns 3x10-15'
        ]
    },
    {
        day: 2,
        name: 'Pull + Conditioning',
        focus: 'Back, Biceps, Grip',
        primary: [
            'Deadlift 3x3-5',
            'Pull-ups 4xAMRAP',
            'Barbell Row 4x6-10'
        ],
        secondary: [
            'Face Pulls 4x15-20',
            'Hammer Curls 3x10-15'
        ]
    },
    {
        day: 3,
        name: 'Legs (Power)',
        focus: 'Quad Dominant',
        primary: [
            'Back Squat 5x5',
            'RDL 4x6-10',
            'Walking Lunges 3x20'
        ],
        secondary: [
            'Leg Curls 3x10-15',
            'Calf Raises 4x15-20'
        ]
    },
    {
        day: 4,
        name: 'Bodyweight + Explosive',
        focus: 'Upper Endurance & Power',
        primary: [
            'Dips 5xAMRAP',
            'Pull-ups 5xAMRAP',
            'Push-ups 4xAMRAP'
        ],
        secondary: [
            'Bodyweight Rows 3xAMRAP',
            'Hanging Knee Raises 3x12-15'
        ]
    },
    {
        day: 5,
        name: 'Legs + Explosiveness',
        focus: 'Strength & Athleticism',
        primary: [
            'Front Squat 4x5-6',
            'Bulgarian Splits 3x8-12',
            'Hip Thrusts 4x8-12'
        ],
        secondary: [
            "Farmer's Walks 3x40m",
            'Box Jumps 5x3',
            'Ab Wheel 3x8-12'
        ]
    },
    {
        day: 6,
        name: 'Upper + Core + Neck',
        focus: 'Detailing & Armor',
        primary: [
            'Incline Bench 4x8-12',
            'Cable Row 4x8-12'
        ],
        secondary: [
            'NECK ROUTINE',
            'Bicep Curls 3x10-15',
            'Leg Raises 3x10-15'
        ]
    },
    {
        day: 7,
        name: 'Active Recovery',
        focus: 'Regeneration',
        primary: [
            'Light Walk 30-45 min'
        ],
        secondary: [
            'Mobility',
            'Stretching & Foam Rolling'
        ]
    }
]

// Conditioning protocols
export const conditioningProtocols = [
    {
        name: 'Circuit A - High-Intensity',
        structure: '5 Rounds',
        exercises: [
            'Burpees: 10 reps',
            'Goblet Squats: 20 reps',
            'Push-ups: 25 reps',
            'Mountain Climbers: 40 reps (20/side)',
            'Plank: 45 seconds'
        ],
        rest: '60 seconds between rounds',
        focus: 'Work capacity and muscular endurance'
    },
    {
        name: 'Circuit B - Explosive Power',
        structure: '6 Rounds',
        exercises: [
            'Broad Jumps: 5 reps',
            'Dumbbell Push Press: 10 reps',
            'Jump Squats: 15 reps',
            'High Knees: 30 seconds'
        ],
        rest: '90 seconds between rounds',
        focus: 'Power development and anaerobic capacity'
    },
    {
        name: 'Circuit C - Grip & Core',
        structure: '3 Rounds',
        exercises: [
            "Farmer's Walks: 40-60 meters",
            'Hanging Knee/Leg Raises: 15 reps',
            'Dead Hang: 45 seconds',
            'Wall Sit: 60 seconds'
        ],
        rest: '60 seconds between exercises',
        focus: 'Wrestling-specific strength (grip, core)'
    },
    {
        name: 'Circuit D - Sprint Work',
        structure: '8-10 Sprints',
        exercises: [
            '100m Track Sprints OR',
            '30-40m Hill Sprints OR',
            'Stadium Stair Sprints'
        ],
        rest: 'Walk back to start (2-3 mins)',
        focus: 'Pure anaerobic power and recovery'
    }
]

// Neck routine
export const neckRoutine = [
    { exercise: 'Neck Curls (Front)', sets: '3x15-25', progression: 'Add weight on forehead' },
    { exercise: 'Neck Extensions (Back)', sets: '3x15-25', progression: 'Add weight behind head' },
    { exercise: 'Lateral Flexions (Sides)', sets: '3x15-25/side', progression: 'Add weight on side' },
    { exercise: 'Isometric Holds', sets: '4x30-sec holds', progression: 'Increase resistance' }
]

// Workout types for logging (matches training split days)
export const workoutTypes = [
    'Push Strength',
    'Pull + Conditioning',
    'Legs (Power)',
    'Bodyweight + Explosive',
    'Legs + Explosiveness',
    'Upper + Core + Neck',
    'Active Recovery'
]

// Conditioning types for logging
export const conditioningTypes = [
    'Circuit A - High-Intensity',
    'Circuit B - Explosive Power',
    'Circuit C - Grip & Core',
    'Circuit D - Sprint Work'
]

// Meal types
export const mealTypes = [
    'Breakfast',
    'Pre-workout',
    'Post-workout',
    'Dinner',
    'Other'
]

// Strength tracking exercises
export const strengthExercises = [
    'Deadlift',
    'Back Squat',
    'Pull-ups',
    'Curls',
    'Rows'
]
