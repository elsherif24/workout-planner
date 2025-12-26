import { reactive, watch } from 'vue'

// Phase configuration
const PHASES = {
    cut: {
        name: 'Cut',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-06-30'),
        startWeight: 100,
        targetWeightMin: 80,
        targetWeightMax: 82,
        calorieTarget: 2100,
        proteinTarget: 200,
        color: '#f97316'
    },
    bulk: {
        name: 'Lean Bulk',
        startDate: new Date('2026-07-01'),
        endDate: new Date('2026-12-31'),
        startWeight: 82,
        targetWeightMin: 92,
        targetWeightMax: 94,
        calorieTarget: 2900,
        proteinTarget: 190,
        color: '#10b981'
    }
}

// Load from localStorage or use defaults
function loadData(key, defaultValue) {
    try {
        const stored = localStorage.getItem(key)
        return stored ? JSON.parse(stored) : defaultValue
    } catch {
        return defaultValue
    }
}

// Save to localStorage
function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

// Reactive store
export const store = reactive({
    // Weight entries: { date: 'YYYY-MM-DD', weight: number }
    weights: loadData('fitness_weights', []),

    // Meal entries: { date: 'YYYY-MM-DD', meal: string, items: [{ name, calories, protein }] }
    meals: loadData('fitness_meals', []),

    // Workout entries: { date: 'YYYY-MM-DD', type: string, conditioning: bool, conditioningNote: string, neckWorkout: string, steps: number, sleep: number }
    workouts: loadData('fitness_workouts', []),

    // Strength entries: { week: number, year: number, deadlift: { weight, reps }, squat: {...}, pullups: {...}, curls: {...}, rows: {...}, notes: string }
    strength: loadData('fitness_strength', [])
})

// Auto-save watchers
watch(() => store.weights, (val) => saveData('fitness_weights', val), { deep: true })
watch(() => store.meals, (val) => saveData('fitness_meals', val), { deep: true })
watch(() => store.workouts, (val) => saveData('fitness_workouts', val), { deep: true })
watch(() => store.strength, (val) => saveData('fitness_strength', val), { deep: true })

// Helper functions
export function getCurrentPhase(date = new Date()) {
    if (date < PHASES.bulk.startDate) {
        return PHASES.cut
    }
    return PHASES.bulk
}

export function getPhaseKey(date = new Date()) {
    return date < PHASES.bulk.startDate ? 'cut' : 'bulk'
}

export function getDayOfPhase(date = new Date()) {
    const phase = getCurrentPhase(date)
    const start = phase.startDate
    const diffTime = date.getTime() - start.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(1, diffDays + 1)
}

export function getTotalDaysInPhase(date = new Date()) {
    const phase = getCurrentPhase(date)
    const diffTime = phase.endDate.getTime() - phase.startDate.getTime()
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
}

export function getLatestWeight() {
    if (store.weights.length === 0) return null
    const sorted = [...store.weights].sort((a, b) => new Date(b.date) - new Date(a.date))
    return sorted[0].weight
}

export function getWeightProgress(date = new Date()) {
    const phase = getCurrentPhase(date)
    const latest = getLatestWeight()
    if (!latest) return 0

    const totalChange = phase.startWeight - phase.targetWeightMin
    const currentChange = phase.startWeight - latest

    if (getPhaseKey(date) === 'bulk') {
        const bulkTotal = phase.targetWeightMin - phase.startWeight
        const bulkCurrent = latest - phase.startWeight
        return Math.min(100, Math.max(0, (bulkCurrent / bulkTotal) * 100))
    }

    return Math.min(100, Math.max(0, (currentChange / totalChange) * 100))
}

export function getWorkoutsInPhase(date = new Date()) {
    const phase = getCurrentPhase(date)
    return store.workouts.filter(w => {
        const wDate = new Date(w.date)
        return wDate >= phase.startDate && wDate <= phase.endDate && w.type !== 'Rest'
    }).length
}

export function formatDate(date) {
    return date.toISOString().split('T')[0]
}

export function getTodayDate() {
    return formatDate(new Date())
}

export function getWorkoutForDate(dateStr) {
    return store.workouts.find(w => w.date === dateStr)
}

export function getMealsForDate(dateStr) {
    return store.meals.filter(m => m.date === dateStr)
}

export function getDailyTotals(dateStr) {
    const meals = getMealsForDate(dateStr)
    let calories = 0
    let protein = 0
    meals.forEach(meal => {
        meal.items?.forEach(item => {
            calories += item.calories || 0
            protein += item.protein || 0
        })
    })
    return { calories, protein }
}

export function saveWeight(dateStr, weight) {
    const existing = store.weights.findIndex(w => w.date === dateStr)
    if (existing >= 0) {
        store.weights[existing].weight = weight
    } else {
        store.weights.push({ date: dateStr, weight })
    }
}

export function saveWorkout(workout) {
    const existing = store.workouts.findIndex(w => w.date === workout.date)
    if (existing >= 0) {
        store.workouts[existing] = workout
    } else {
        store.workouts.push(workout)
    }
}

export function saveMeal(dateStr, mealType, items) {
    const existing = store.meals.findIndex(m => m.date === dateStr && m.meal === mealType)
    if (existing >= 0) {
        store.meals[existing].items = items
    } else {
        store.meals.push({ date: dateStr, meal: mealType, items })
    }
}

export function saveStrength(entry) {
    const existing = store.strength.findIndex(s => s.week === entry.week && s.year === entry.year)
    if (existing >= 0) {
        store.strength[existing] = entry
    } else {
        store.strength.push(entry)
    }
}

export { PHASES }
