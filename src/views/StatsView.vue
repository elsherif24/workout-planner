<template>
  <div class="page">
    <div class="container">
      <!-- Sub-navigation tabs -->
      <div class="tabs mb-lg">
        <button 
          class="tab" 
          :class="{ active: activeTab === 'overview' }"
          @click="activeTab = 'overview'"
        >
          Overview
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'weight' }"
          @click="activeTab = 'weight'"
        >
          Weight
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'strength' }"
          @click="activeTab = 'strength'"
        >
          Strength
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'habits' }"
          @click="activeTab = 'habits'"
        >
          Habits
        </button>
      </div>

      <!-- Overview -->
      <div v-if="activeTab === 'overview'" class="animate-fade-in">
        <!-- Key Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card card">
            <span class="stat-icon">⚖️</span>
            <div class="stat-info">
              <span class="stat-value">{{ currentWeight || '--' }}</span>
              <span class="stat-label">Current Weight (kg)</span>
            </div>
          </div>
          <div class="stat-card card">
            <span class="stat-icon">📉</span>
            <div class="stat-info">
              <span class="stat-value" :class="weightChange < 0 ? 'success' : 'warning'">
                {{ weightChange > 0 ? '+' : '' }}{{ weightChange.toFixed(1) }}
              </span>
              <span class="stat-label">Change (kg)</span>
            </div>
          </div>
          <div class="stat-card card">
            <span class="stat-icon">💪</span>
            <div class="stat-info">
              <span class="stat-value">{{ totalWorkouts }}</span>
              <span class="stat-label">Total Workouts</span>
            </div>
          </div>
          <div class="stat-card card">
            <span class="stat-icon">🔥</span>
            <div class="stat-info">
              <span class="stat-value">{{ currentStreak }}</span>
              <span class="stat-label">Day Streak</span>
            </div>
          </div>
        </div>

        <!-- Phase Progress -->
        <div class="section mt-lg">
          <h2 class="section-title mb-md">Phase Progress</h2>
          <div class="card">
            <div class="phase-info">
              <div class="phase-header">
                <span :class="['pill', phaseKey === 'cut' ? 'pill-cut' : 'pill-bulk']">
                  {{ phase.name }}
                </span>
                <span class="phase-dates">
                  {{ formatDateShort(phase.startDate) }} → {{ formatDateShort(phase.endDate) }}
                </span>
              </div>
              
              <div class="progress-detail mt-md">
                <div class="progress-row">
                  <span class="progress-label">Time</span>
                  <span class="progress-value">{{ dayOfPhase }} / {{ totalDays }} days</span>
                </div>
                <div class="progress-bar progress-bar-lg">
                  <div 
                    class="fill" 
                    :class="phaseKey"
                    :style="{ width: (dayOfPhase / totalDays) * 100 + '%' }"
                  ></div>
                </div>
              </div>

              <div class="progress-detail mt-md">
                <div class="progress-row">
                  <span class="progress-label">Weight Goal</span>
                  <span class="progress-value">
                    {{ currentWeight || phase.startWeight }}kg → {{ phase.targetWeightMin }}-{{ phase.targetWeightMax }}kg
                  </span>
                </div>
                <div class="progress-bar progress-bar-lg">
                  <div 
                    class="fill" 
                    :class="phaseKey"
                    :style="{ width: weightProgress + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Weekly Summary -->
        <div class="section mt-lg">
          <h2 class="section-title mb-md">This Week</h2>
          <div class="week-stats">
            <div class="week-stat card-flat">
              <span class="week-value">{{ weekWorkouts }}</span>
              <span class="week-label">Workouts</span>
            </div>
            <div class="week-stat card-flat">
              <span class="week-value">{{ avgCalories }}</span>
              <span class="week-label">Avg Calories</span>
            </div>
            <div class="week-stat card-flat">
              <span class="week-value">{{ avgProtein }}g</span>
              <span class="week-label">Avg Protein</span>
            </div>
            <div class="week-stat card-flat">
              <span class="week-value">{{ avgSleep }}h</span>
              <span class="week-label">Avg Sleep</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Weight Tracking -->
      <div v-if="activeTab === 'weight'" class="animate-fade-in">
        <div class="section">
          <h2 class="section-title mb-md">Weight History</h2>
          
          <!-- Chart -->
          <div class="chart-container card">
            <canvas ref="weightChart"></canvas>
          </div>

          <!-- Weight Log -->
          <div class="weight-log mt-lg">
            <h3 class="subsection-title">Recent Entries</h3>
            <div class="log-list">
              <div 
                v-for="entry in recentWeights" 
                :key="entry.date"
                class="log-item"
              >
                <span class="log-date">{{ formatDate(entry.date) }}</span>
                <span class="log-value">{{ entry.weight }} kg</span>
                <span 
                  class="log-change"
                  :class="getWeightChangeClass(entry)"
                >
                  {{ getWeightChange(entry) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Strength Progress -->
      <div v-if="activeTab === 'strength'" class="animate-fade-in">
        <div class="section">
          <h2 class="section-title mb-md">Strength Progression</h2>
          
          <!-- Strength Chart -->
          <div class="chart-container card">
            <canvas ref="strengthChart"></canvas>
          </div>

          <!-- Current PRs -->
          <div class="pr-section mt-lg">
            <h3 class="subsection-title">Personal Records</h3>
            <div class="pr-grid">
              <div 
                v-for="(pr, exercise) in personalRecords" 
                :key="exercise"
                class="pr-card card-flat"
              >
                <span class="pr-exercise">{{ exercise }}</span>
                <span class="pr-value">{{ pr.weight || '--' }}kg</span>
                <span class="pr-details">{{ pr.reps }} reps</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Habits & Trends -->
      <div v-if="activeTab === 'habits'" class="animate-fade-in">
        <div class="section">
          <h2 class="section-title mb-md">Habits Overview</h2>
          
          <!-- Workout Consistency -->
          <div class="card mb-md">
            <h3 class="card-title">Workout Consistency</h3>
            <div class="consistency-stats">
              <div class="cons-stat">
                <span class="cons-value">{{ workoutConsistency }}%</span>
                <span class="cons-label">This Month</span>
              </div>
              <div class="cons-stat">
                <span class="cons-value">{{ conditioningCount }}</span>
                <span class="cons-label">Conditioning</span>
              </div>
              <div class="cons-stat">
                <span class="cons-value">{{ neckCount }}</span>
                <span class="cons-label">Neck Workouts</span>
              </div>
            </div>
            
            <!-- Mini calendar heatmap -->
            <div class="heatmap mt-md">
              <div 
                v-for="day in last30Days" 
                :key="day.date"
                class="heatmap-day"
                :class="getHeatmapClass(day)"
                :title="getHeatmapTooltip(day)"
              ></div>
            </div>
            <div class="heatmap-legend-row">
              <span class="legend-item"><span class="legend-dot"></span> Rest</span>
              <span class="legend-item"><span class="legend-dot level-1"></span> Workout</span>
              <span class="legend-item"><span class="legend-dot level-2"></span> +1 Extra</span>
              <span class="legend-item"><span class="legend-dot level-3"></span> Full Day</span>
            </div>
          </div>

          <!-- Sleep & Steps -->
          <div class="card mb-md">
            <h3 class="card-title">Sleep & Steps</h3>
            <div class="habit-stats">
              <div class="habit-stat">
                <span class="habit-icon">😴</span>
                <div class="habit-info">
                  <span class="habit-value">{{ avgSleepMonth }}h</span>
                  <span class="habit-label">Avg Sleep (30d)</span>
                </div>
              </div>
              <div class="habit-stat">
                <span class="habit-icon">👣</span>
                <div class="habit-info">
                  <span class="habit-value">{{ avgStepsMonth }}</span>
                  <span class="habit-label">Avg Steps (30d)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Nutrition Trends -->
          <div class="card">
            <h3 class="card-title">Nutrition (30d Avg)</h3>
            <div class="nutrition-stats">
              <div class="nutri-stat">
                <span class="nutri-value">{{ avgCaloriesMonth }}</span>
                <span class="nutri-label">Calories</span>
                <span class="nutri-target">Target: {{ phase.calorieTarget }}</span>
              </div>
              <div class="nutri-stat">
                <span class="nutri-value">{{ avgProteinMonth }}g</span>
                <span class="nutri-label">Protein</span>
                <span class="nutri-target">Target: {{ phase.proteinTarget }}g</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Management -->
        <div class="section mt-lg">
          <h2 class="section-title mb-md">Data</h2>
          <div class="card">
            <div class="data-actions">
              <button class="btn w-full mb-sm" @click="exportData">
                📤 Export Data (JSON)
              </button>
              <label class="btn w-full">
                📥 Import Data
                <input 
                  type="file" 
                  accept=".json"
                  class="hidden"
                  @change="importData"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import { 
  store, 
  getCurrentPhase, 
  getPhaseKey,
  getDayOfPhase,
  getTotalDaysInPhase,
  getWeightProgress,
  getLatestWeight,
  getDailyTotals
} from '../store.js'

Chart.register(...registerables)

export default {
  name: 'StatsView',
  data() {
    return {
      activeTab: 'overview',
      phase: getCurrentPhase(),
      phaseKey: getPhaseKey(),
      dayOfPhase: getDayOfPhase(),
      totalDays: getTotalDaysInPhase(),
      weightProgress: getWeightProgress(),
      weightChart: null,
      strengthChart: null
    }
  },
  computed: {
    currentWeight() {
      return getLatestWeight()
    },
    weightChange() {
      if (store.weights.length < 2) return 0
      const sorted = [...store.weights].sort((a, b) => new Date(b.date) - new Date(a.date))
      return sorted[0].weight - sorted[sorted.length - 1].weight
    },
    totalWorkouts() {
      return store.workouts.filter(w => w.type && w.type !== 'Rest').length
    },
    currentStreak() {
      let streak = 0
      const today = new Date()
      const sortedWorkouts = [...store.workouts]
        .filter(w => w.type && w.type !== 'Rest')
        .sort((a, b) => new Date(b.date) - new Date(a.date))
      
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today)
        checkDate.setDate(checkDate.getDate() - i)
        const dateStr = checkDate.toISOString().split('T')[0]
        const hasWorkout = sortedWorkouts.some(w => w.date === dateStr)
        if (hasWorkout) streak++
        else if (i > 0) break
      }
      return streak
    },
    recentWeights() {
      return [...store.weights]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10)
    },
    weekWorkouts() {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return store.workouts.filter(w => 
        new Date(w.date) >= weekAgo && w.type && w.type !== 'Rest'
      ).length
    },
    avgCalories() {
      return this.getAverageNutrition(7, 'calories')
    },
    avgProtein() {
      return this.getAverageNutrition(7, 'protein')
    },
    avgSleep() {
      return this.getAverageStat(7, 'sleep')
    },
    avgSleepMonth() {
      return this.getAverageStat(30, 'sleep')
    },
    avgStepsMonth() {
      return Math.round(this.getAverageStat(30, 'steps'))
    },
    avgCaloriesMonth() {
      return this.getAverageNutrition(30, 'calories')
    },
    avgProteinMonth() {
      return this.getAverageNutrition(30, 'protein')
    },
    personalRecords() {
      const prs = {}
      const exercises = ['Deadlift', 'Back Squat', 'Pull-ups', 'Curls', 'Rows']
      exercises.forEach(ex => {
        const key = ex.toLowerCase().replace('-', '').replace(' ', '')
        let maxWeight = 0
        let bestReps = 0
        store.strength.forEach(entry => {
          if (entry[key] && entry[key].weight > maxWeight) {
            maxWeight = entry[key].weight
            bestReps = entry[key].reps || 0
          }
        })
        prs[ex] = { weight: maxWeight || null, reps: bestReps || null }
      })
      return prs
    },
    workoutConsistency() {
      const monthAgo = new Date()
      monthAgo.setDate(monthAgo.getDate() - 30)
      const workoutsThisMonth = store.workouts.filter(w => 
        new Date(w.date) >= monthAgo && w.type && w.type !== 'Rest'
      ).length
      // Target 5 workouts per week = ~21 per month
      return Math.round((workoutsThisMonth / 21) * 100)
    },
    conditioningCount() {
      const monthAgo = new Date()
      monthAgo.setDate(monthAgo.getDate() - 30)
      return store.workouts.filter(w => 
        new Date(w.date) >= monthAgo && w.conditioning
      ).length
    },
    neckCount() {
      const monthAgo = new Date()
      monthAgo.setDate(monthAgo.getDate() - 30)
      return store.workouts.filter(w => 
        new Date(w.date) >= monthAgo && w.neckDone
      ).length
    },
    last30Days() {
      const days = []
      const today = new Date()
      for (let i = 29; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]
        const workout = store.workouts.find(w => w.date === dateStr)
        days.push({
          date: dateStr,
          hasWorkout: workout && workout.type && workout.type !== 'Rest',
          hasConditioning: workout && workout.conditioning,
          hasNeck: workout && workout.neckDone
        })
      }
      return days
    }
  },
  watch: {
    activeTab(newTab) {
      this.$nextTick(() => {
        if (newTab === 'weight') this.renderWeightChart()
        if (newTab === 'strength') this.renderStrengthChart()
      })
    }
  },
  mounted() {
    if (this.activeTab === 'weight') {
      this.renderWeightChart()
    }
  },
  methods: {
    formatDate(dateStr) {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    },
    formatDateShort(date) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    },
    getWeightChange(entry) {
      const idx = this.recentWeights.findIndex(w => w.date === entry.date)
      if (idx >= this.recentWeights.length - 1) return '--'
      const prev = this.recentWeights[idx + 1]
      const change = entry.weight - prev.weight
      return (change > 0 ? '+' : '') + change.toFixed(1)
    },
    getWeightChangeClass(entry) {
      const change = this.getWeightChange(entry)
      if (change === '--') return ''
      const num = parseFloat(change)
      if (this.phaseKey === 'cut') {
        return num < 0 ? 'success' : 'warning'
      }
      return num > 0 ? 'success' : 'warning'
    },
    getAverageNutrition(days, type) {
      let total = 0
      let count = 0
      const today = new Date()
      for (let i = 0; i < days; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]
        const totals = getDailyTotals(dateStr)
        if (totals[type] > 0) {
          total += totals[type]
          count++
        }
      }
      return count > 0 ? Math.round(total / count) : 0
    },
    getAverageStat(days, stat) {
      let total = 0
      let count = 0
      const today = new Date()
      for (let i = 0; i < days; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]
        const workout = store.workouts.find(w => w.date === dateStr)
        if (workout && workout[stat]) {
          total += workout[stat]
          count++
        }
      }
      return count > 0 ? (total / count).toFixed(1) : 0
    },
    getHeatmapClass(day) {
      // Count how many activities were done
      let score = 0
      if (day.hasWorkout) score++
      if (day.hasConditioning) score++
      if (day.hasNeck) score++
      
      // Return intensity level
      if (score === 3) return 'level-3'  // Full day: workout + conditioning + neck
      if (score === 2) return 'level-2'  // Good: workout + one extra
      if (score === 1) return 'level-1'  // Base: just workout (still good!)
      return 'rest'                       // No activity
    },
    getHeatmapTooltip(day) {
      const parts = [day.date]
      if (day.hasWorkout) parts.push('Workout')
      if (day.hasConditioning) parts.push('Conditioning')
      if (day.hasNeck) parts.push('Neck')
      if (parts.length === 1) parts.push('Rest')
      return parts.join(' - ')
    },
    // E1RM calculation using Epley formula
    // E1RM = weight × (1 + reps / 30)
    calculateE1RM(weight, reps) {
      if (!weight || !reps) return 0
      return weight * (1 + reps / 30)
    },
    renderWeightChart() {
      if (this.weightChart) {
        this.weightChart.destroy()
      }
      
      const ctx = this.$refs.weightChart
      if (!ctx) return
      
      const sortedWeights = [...store.weights]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-30)
      
      this.weightChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: sortedWeights.map(w => this.formatDate(w.date)),
          datasets: [{
            label: 'Weight (kg)',
            data: sortedWeights.map(w => w.weight),
            borderColor: this.phaseKey === 'cut' ? '#f97316' : '#10b981',
            backgroundColor: this.phaseKey === 'cut' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#6b6b7b' }
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#6b6b7b' }
            }
          }
        }
      })
    },
    renderStrengthChart() {
      if (this.strengthChart) {
        this.strengthChart.destroy()
      }
      
      const ctx = this.$refs.strengthChart
      if (!ctx) return
      
      const sortedStrength = [...store.strength]
        .sort((a, b) => a.week - b.week)
        .slice(-12)
      
      const exercises = ['deadlift', 'backsquat', 'pullups']
      const labels = ['Deadlift', 'Back Squat', 'Pull-ups']
      const colors = ['#f97316', '#10b981', '#3b82f6']
      
      this.strengthChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: sortedStrength.map(s => `W${s.week}`),
          datasets: exercises.map((ex, i) => ({
            label: labels[i],
            data: sortedStrength.map(s => s[ex]?.weight || null),
            borderColor: colors[i],
            backgroundColor: 'transparent',
            tension: 0.4,
            pointRadius: 4
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { 
              position: 'bottom',
              labels: { color: '#a0a0b0' }
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.dataset.label}: ${context.raw}kg`
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#6b6b7b' }
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#6b6b7b' },
              title: {
                display: true,
                text: 'Weight (kg)',
                color: '#6b6b7b'
              }
            }
          }
        }
      })
    },
    exportData() {
      const data = {
        weights: store.weights,
        meals: store.meals,
        workouts: store.workouts,
        strength: store.strength,
        exportDate: new Date().toISOString()
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fitness-data-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    },
    importData(event) {
      const file = event.target.files[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (data.weights) store.weights = data.weights
          if (data.meals) store.meals = data.meals
          if (data.workouts) store.workouts = data.workouts
          if (data.strength) store.strength = data.strength
          alert('Data imported successfully!')
          location.reload()
        } catch (err) {
          alert('Error importing data: ' + err.message)
        }
      }
      reader.readAsText(file)
    }
  }
}
</script>

<style scoped>
/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-card .stat-value {
  font-size: 1.25rem;
  font-weight: 700;
}

.stat-card .stat-value.success {
  color: var(--bulk-primary);
}

.stat-card .stat-value.warning {
  color: var(--accent-red);
}

.stat-card .stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Phase Progress */
.phase-info .phase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.phase-dates {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.progress-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.progress-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.progress-row .progress-label {
  color: var(--text-secondary);
}

.progress-row .progress-value {
  color: var(--text-primary);
  font-weight: 500;
}

/* Week Stats */
.week-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-sm);
}

.week-stat {
  text-align: center;
  padding: var(--space-md) var(--space-sm);
}

.week-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.week-label {
  display: block;
  font-size: 0.625rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Chart Container */
.chart-container {
  height: 250px;
  padding: var(--space-md);
}

/* Weight Log */
.subsection-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
}

.log-list {
  display: flex;
  flex-direction: column;
}

.log-item {
  display: flex;
  align-items: center;
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--border-subtle);
}

.log-item:last-child {
  border-bottom: none;
}

.log-date {
  flex: 1;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.log-value {
  font-weight: 600;
  margin-right: var(--space-md);
}

.log-change {
  font-size: 0.75rem;
  min-width: 50px;
  text-align: right;
}

.log-change.success {
  color: var(--bulk-primary);
}

.log-change.warning {
  color: var(--accent-red);
}

/* PR Grid */
.pr-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
}

.pr-card {
  padding: var(--space-md);
  text-align: center;
}

.pr-exercise {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
}

.pr-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--cut-primary);
}

.pr-note {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: var(--space-md);
}

.pr-details {
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: var(--space-xs);
}

/* Habits */
.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--space-md);
}

.consistency-stats {
  display: flex;
  justify-content: space-around;
}

.cons-stat {
  text-align: center;
}

.cons-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--cut-primary);
}

.cons-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Heatmap */
.heatmap {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
}

.heatmap-day {
  aspect-ratio: 1;
  border-radius: 4px;
  background: var(--bg-tertiary);
}

.heatmap-day.level-1 {
  background: #0e4429;  /* Dark green - base workout */
}

.heatmap-day.level-2 {
  background: #26a641;  /* Medium green - workout + 1 extra */
}

.heatmap-day.level-3 {
  background: #39d353;  /* Bright green - full day! */
  box-shadow: 0 0 8px rgba(57, 211, 83, 0.5);
}

.heatmap-legend {
  margin-top: var(--space-sm);
  font-size: 0.75rem;
  color: var(--text-muted);
  text-align: center;
}

.heatmap-legend-row {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  margin-top: var(--space-sm);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 0.625rem;
  color: var(--text-muted);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: var(--bg-tertiary);
}

.legend-dot.level-1 {
  background: #0e4429;
}

.legend-dot.level-2 {
  background: #26a641;
}

.legend-dot.level-3 {
  background: #39d353;
}

/* Habit Stats */
.habit-stats {
  display: flex;
  gap: var(--space-lg);
}

.habit-stat {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.habit-icon {
  font-size: 1.5rem;
}

.habit-info {
  display: flex;
  flex-direction: column;
}

.habit-value {
  font-size: 1.25rem;
  font-weight: 700;
}

.habit-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Nutrition Stats */
.nutrition-stats {
  display: flex;
  justify-content: space-around;
}

.nutri-stat {
  text-align: center;
}

.nutri-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.nutri-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.nutri-target {
  display: block;
  font-size: 0.625rem;
  color: var(--text-muted);
  margin-top: var(--space-xs);
}

/* Data Actions */
.data-actions {
  display: flex;
  flex-direction: column;
}

.data-actions .btn {
  cursor: pointer;
}

.data-actions input[type="file"] {
  display: none;
}
</style>
