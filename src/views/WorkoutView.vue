<template>
  <div class="page">
    <div class="container">
      <!-- Sub-navigation tabs -->
      <div class="tabs mb-lg">
        <button 
          class="tab" 
          :class="{ active: activeTab === 'today' }"
          @click="activeTab = 'today'"
        >
          Today
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'split' }"
          @click="activeTab = 'split'"
        >
          Split
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'conditioning' }"
          @click="activeTab = 'conditioning'"
        >
          Conditioning
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'strength' }"
          @click="activeTab = 'strength'"
        >
          Strength
        </button>
      </div>

      <!-- Today's Log -->
      <div v-if="activeTab === 'today'" class="animate-fade-in">
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">Log Workout</h2>
            <input 
              type="date" 
              class="input date-input"
              v-model="selectedDate"
            />
          </div>

          <div class="card">
            <div class="form-group">
              <label class="label">Training Type</label>
              <select class="select" v-model="workout.type">
                <option value="">Select type...</option>
                <option v-for="type in workoutTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="label">Weight (kg)</label>
              <input 
                type="number" 
                class="input" 
                v-model.number="todayWeight"
                placeholder="Enter today's weight"
                step="0.1"
              />
            </div>

            <div class="toggle-row">
              <span class="label">Conditioning</span>
              <button 
                class="toggle-btn"
                :class="{ active: workout.conditioning }"
                @click="workout.conditioning = !workout.conditioning"
              >
                {{ workout.conditioning ? 'Yes' : 'No' }}
              </button>
            </div>

            <div v-if="workout.conditioning" class="form-group mt-md">
              <label class="label">Conditioning Notes</label>
              <input 
                type="text" 
                class="input" 
                v-model="workout.conditioningNote"
                placeholder="Circuit A, sprints, etc."
              />
            </div>

            <div class="toggle-row">
              <span class="label">Neck Workout</span>
              <button 
                class="toggle-btn"
                :class="{ active: workout.neckDone }"
                @click="workout.neckDone = !workout.neckDone"
              >
                {{ workout.neckDone ? 'Yes' : 'No' }}
              </button>
            </div>

            <div v-if="workout.neckDone" class="form-group mt-md">
              <label class="label">Neck Notes</label>
              <input 
                type="text" 
                class="input" 
                v-model="workout.neckWorkout"
                placeholder="e.g., 3x20 curls + extensions"
              />
            </div>

            <div class="stats-row">
              <div class="form-group half">
                <label class="label">Steps</label>
                <input 
                  type="number" 
                  class="input" 
                  v-model.number="workout.steps"
                  placeholder="0"
                />
              </div>
              <div class="form-group half">
                <label class="label">Sleep (hours)</label>
                <input 
                  type="number" 
                  class="input" 
                  v-model.number="workout.sleep"
                  placeholder="0"
                  step="0.5"
                />
              </div>
            </div>

            <button class="btn btn-primary w-full mt-md" @click="saveWorkoutData">
              Save Workout
            </button>
          </div>
        </div>
      </div>

      <!-- Training Split Reference -->
      <div v-if="activeTab === 'split'" class="animate-fade-in">
        <div class="section">
          <h2 class="section-title mb-md">Weekly Training Split</h2>
          
          <div class="split-list">
            <div 
              v-for="day in trainingSplit" 
              :key="day.day" 
              class="split-card card"
            >
              <div class="split-header">
                <span class="day-badge">Day {{ day.day }}</span>
                <h3 class="split-name">{{ day.name }}</h3>
              </div>
              <p class="split-focus">{{ day.focus }}</p>
              
              <div class="exercises-section">
                <h4 class="exercises-label">Primary</h4>
                <ul class="exercises-list">
                  <li v-for="ex in day.primary" :key="ex">{{ ex }}</li>
                </ul>
              </div>
              
              <div class="exercises-section">
                <h4 class="exercises-label">Secondary</h4>
                <ul class="exercises-list secondary">
                  <li v-for="ex in day.secondary" :key="ex">{{ ex }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Conditioning Protocols -->
      <div v-if="activeTab === 'conditioning'" class="animate-fade-in">
        <div class="section">
          <h2 class="section-title mb-md">Conditioning Protocols</h2>
          
          <div class="conditioning-list">
            <div 
              v-for="protocol in conditioningProtocols" 
              :key="protocol.name" 
              class="card"
            >
              <h3 class="protocol-name">{{ protocol.name }}</h3>
              <p class="protocol-structure">{{ protocol.structure }}</p>
              
              <ul class="protocol-exercises">
                <li v-for="ex in protocol.exercises" :key="ex">{{ ex }}</li>
              </ul>
              
              <div class="protocol-meta">
                <span class="meta-item">⏱️ {{ protocol.rest }}</span>
                <span class="meta-item">🎯 {{ protocol.focus }}</span>
              </div>
            </div>
          </div>

          <div class="card mt-lg">
            <h3 class="protocol-name">Neck Armor Protocol</h3>
            <p class="text-secondary text-sm mb-md">2-3x per week</p>
            
            <div class="neck-exercises">
              <div 
                v-for="ex in neckRoutine" 
                :key="ex.exercise" 
                class="neck-item"
              >
                <div class="neck-main">
                  <span class="neck-name">{{ ex.exercise }}</span>
                  <span class="neck-sets">{{ ex.sets }}</span>
                </div>
                <span class="neck-progression">{{ ex.progression }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Strength Tracking -->
      <div v-if="activeTab === 'strength'" class="animate-fade-in">
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">Weekly Strength Log</h2>
            <div class="week-selector">
              <button class="btn btn-icon btn-sm" @click="changeWeek(-1)">←</button>
              <span class="week-label">Week {{ currentWeek }}</span>
              <button class="btn btn-icon btn-sm" @click="changeWeek(1)">→</button>
            </div>
          </div>

          <div class="card">
            <div 
              v-for="exercise in strengthExercises" 
              :key="exercise" 
              class="strength-row"
            >
              <span class="strength-name">{{ exercise }}</span>
              <div class="strength-inputs">
                <input 
                  type="number" 
                  class="input input-sm" 
                  :value="strengthData[exercise]?.weight"
                  @input="updateStrength(exercise, 'weight', $event.target.value)"
                  placeholder="kg"
                />
                <span class="strength-x">×</span>
                <input 
                  type="number" 
                  class="input input-sm" 
                  :value="strengthData[exercise]?.reps"
                  @input="updateStrength(exercise, 'reps', $event.target.value)"
                  placeholder="reps"
                />
              </div>
            </div>

            <div class="form-group mt-md">
              <label class="label">Notes</label>
              <textarea 
                class="input textarea" 
                v-model="strengthNotes"
                placeholder="Weekly notes..."
                rows="3"
              ></textarea>
            </div>

            <button class="btn btn-primary w-full mt-md" @click="saveStrengthData">
              Save Strength Data
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  store, 
  saveWorkout, 
  saveWeight, 
  saveStrength,
  getWorkoutForDate,
  getTodayDate 
} from '../store.js'
import { 
  workoutTypes, 
  trainingSplit, 
  conditioningProtocols, 
  neckRoutine,
  strengthExercises 
} from '../data/database.js'

export default {
  name: 'WorkoutView',
  data() {
    return {
      activeTab: 'today',
      selectedDate: getTodayDate(),
      todayWeight: null,
      workout: {
        type: '',
        conditioning: false,
        conditioningNote: '',
        neckDone: false,
        neckWorkout: '',
        steps: null,
        sleep: null
      },
      currentWeek: this.getCurrentWeekNumber(),
      currentYear: new Date().getFullYear(),
      strengthData: {},
      strengthNotes: '',
      workoutTypes,
      trainingSplit,
      conditioningProtocols,
      neckRoutine,
      strengthExercises
    }
  },
  watch: {
    selectedDate() {
      this.loadWorkoutForDate()
    },
    currentWeek() {
      this.loadStrengthData()
    }
  },
  mounted() {
    this.loadWorkoutForDate()
    this.loadStrengthData()
  },
  methods: {
    getCurrentWeekNumber() {
      const now = new Date()
      const start = new Date(now.getFullYear(), 0, 1)
      const diff = now - start
      const oneWeek = 1000 * 60 * 60 * 24 * 7
      return Math.ceil(diff / oneWeek)
    },
    loadWorkoutForDate() {
      const existing = getWorkoutForDate(this.selectedDate)
      if (existing) {
        this.workout = { ...existing }
        delete this.workout.date
      } else {
        this.workout = {
          type: '',
          conditioning: false,
          conditioningNote: '',
          neckDone: false,
          neckWorkout: '',
          steps: null,
          sleep: null
        }
      }
      // Load weight for this date
      const weightEntry = store.weights.find(w => w.date === this.selectedDate)
      this.todayWeight = weightEntry ? weightEntry.weight : null
    },
    loadStrengthData() {
      const entry = store.strength.find(
        s => s.week === this.currentWeek && s.year === this.currentYear
      )
      if (entry) {
        this.strengthData = {}
        this.strengthExercises.forEach(ex => {
          this.strengthData[ex] = entry[ex.toLowerCase().replace('-', '')] || { weight: null, reps: null }
        })
        this.strengthNotes = entry.notes || ''
      } else {
        this.strengthData = {}
        this.strengthExercises.forEach(ex => {
          this.strengthData[ex] = { weight: null, reps: null }
        })
        this.strengthNotes = ''
      }
    },
    updateStrength(exercise, field, value) {
      if (!this.strengthData[exercise]) {
        this.strengthData[exercise] = { weight: null, reps: null }
      }
      this.strengthData[exercise][field] = value ? Number(value) : null
    },
    saveWorkoutData() {
      const workoutData = {
        date: this.selectedDate,
        ...this.workout
      }
      saveWorkout(workoutData)
      
      if (this.todayWeight) {
        saveWeight(this.selectedDate, this.todayWeight)
      }
      
      // Trigger App update
      this.$root.updateProgress()
      
      alert('Workout saved!')
    },
    saveStrengthData() {
      const entry = {
        week: this.currentWeek,
        year: this.currentYear,
        notes: this.strengthNotes
      }
      this.strengthExercises.forEach(ex => {
        entry[ex.toLowerCase().replace('-', '')] = this.strengthData[ex]
      })
      saveStrength(entry)
      alert('Strength data saved!')
    },
    changeWeek(delta) {
      this.currentWeek = Math.max(1, Math.min(52, this.currentWeek + delta))
    }
  }
}
</script>

<style scoped>
.date-input {
  width: auto;
  padding: var(--space-xs) var(--space-sm);
  font-size: 0.875rem;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) 0;
}

.toggle-btn {
  padding: var(--space-xs) var(--space-md);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.toggle-btn.active {
  color: white;
  background: var(--bulk-primary);
  border-color: var(--bulk-primary);
}

.stats-row {
  display: flex;
  gap: var(--space-md);
}

.half {
  flex: 1;
}

/* Split tab styles */
.split-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.split-card {
  padding: var(--space-md);
}

.split-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-xs);
}

.day-badge {
  padding: var(--space-xs) var(--space-sm);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--cut-primary);
  background: rgba(249, 115, 22, 0.15);
  border-radius: var(--radius-sm);
}

.split-name {
  font-size: 1rem;
  font-weight: 600;
}

.split-focus {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: var(--space-md);
}

.exercises-section {
  margin-bottom: var(--space-sm);
}

.exercises-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-xs);
}

.exercises-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.exercises-list li {
  padding: var(--space-xs) var(--space-sm);
  font-size: 0.813rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
}

.exercises-list.secondary li {
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}

/* Conditioning styles */
.conditioning-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.protocol-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--space-xs);
}

.protocol-structure {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--cut-primary);
  margin-bottom: var(--space-sm);
}

.protocol-exercises {
  list-style: none;
  margin-bottom: var(--space-md);
}

.protocol-exercises li {
  padding: var(--space-xs) 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-subtle);
}

.protocol-exercises li:last-child {
  border-bottom: none;
}

.protocol-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.meta-item {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Neck routine */
.neck-exercises {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.neck-item {
  padding: var(--space-sm);
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
}

.neck-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xs);
}

.neck-name {
  font-weight: 500;
}

.neck-sets {
  font-size: 0.875rem;
  color: var(--cut-primary);
}

.neck-progression {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Strength tab styles */
.week-selector {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.week-label {
  font-size: 0.875rem;
  font-weight: 600;
  min-width: 70px;
  text-align: center;
}

.strength-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--border-subtle);
}

.strength-row:last-of-type {
  border-bottom: none;
}

.strength-name {
  font-weight: 500;
  font-size: 0.875rem;
}

.strength-inputs {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.input-sm {
  width: 60px;
  padding: var(--space-xs);
  font-size: 0.875rem;
  text-align: center;
}

.strength-x {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.textarea {
  resize: vertical;
  min-height: 80px;
}
</style>
