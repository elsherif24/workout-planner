<template>
  <div class="page page-wide">
    <div class="container-wide">
      <div class="section">
        <h2 class="section-title mb-md">Weekly Rewind</h2>
        <p class="section-subtitle">Dec 2025 - Dec 2026 (Saturday = first day of week)</p>
      </div>

      <!-- Scrollable table container -->
      <div class="table-container">
        <table class="rewind-table">
          <thead>
            <tr>
              <th class="sticky-col">Week</th>
              <th>Weight</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Steps</th>
              <th>Sleep</th>
              <th>Workouts</th>
              <th>Cond.</th>
              <th>Neck</th>
              <th>Deadlift</th>
              <th>Squat</th>
              <th>Pull-ups</th>
              <th>Curls</th>
              <th>Rows</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="week in weeklyData" :key="`${week.year}-${week.weekNumber}`" :class="{ 'current-week': week.isCurrent }">
              <td class="sticky-col week-label">
                <span class="week-number">W{{ week.weekNumber }}<span class="year-tag" v-if="week.year === 2025">'25</span></span>
                <span class="week-dates">{{ week.dateRange }}</span>
              </td>
              <td>{{ week.avgWeight || '—' }}<span class="unit" v-if="week.avgWeight">kg</span></td>
              <td>{{ week.avgCalories || '—' }}</td>
              <td>{{ week.avgProtein || '—' }}<span class="unit" v-if="week.avgProtein">g</span></td>
              <td>{{ week.avgSteps || '—' }}</td>
              <td>{{ week.avgSleep || '—' }}<span class="unit" v-if="week.avgSleep">h</span></td>
              <td class="highlight">{{ week.totalWorkouts }}</td>
              <td>{{ week.totalConditioning }}</td>
              <td>{{ week.totalNeck }}</td>
              <td>{{ formatStrength(week.strength.deadlift) }}</td>
              <td>{{ formatStrength(week.strength.backsquat) }}</td>
              <td>{{ formatStrength(week.strength.pullups) }}</td>
              <td>{{ formatStrength(week.strength.curls) }}</td>
              <td>{{ formatStrength(week.strength.rows) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary stats -->
      <div class="summary-section section mt-lg">
        <h3 class="subsection-title">All-Time Summary</h3>
        <div class="summary-grid">
          <div class="summary-item card-flat">
            <span class="summary-value">{{ totalStats.weeks }}</span>
            <span class="summary-label">Weeks Tracked</span>
          </div>
          <div class="summary-item card-flat">
            <span class="summary-value">{{ totalStats.workouts }}</span>
            <span class="summary-label">Total Workouts</span>
          </div>
          <div class="summary-item card-flat">
            <span class="summary-value">{{ totalStats.conditioning }}</span>
            <span class="summary-label">Conditioning</span>
          </div>
          <div class="summary-item card-flat">
            <span class="summary-value">{{ totalStats.neck }}</span>
            <span class="summary-label">Neck Workouts</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { store, getDailyTotals } from '../store.js'

export default {
  name: 'RewindView',
  computed: {
    weeklyData() {
      const weeks = []
      const now = new Date()
      
      // Journey starts Saturday, Dec 27, 2025 (Week 52 of 2025)
      // Then continues through all of 2026
      
      // Add Week 52 of 2025 (Dec 27, 2025 - Jan 2, 2026)
      const week52_2025 = this.calculateWeekData(52, 2025)
      week52_2025.isCurrent = this.isCurrentWeek(52, 2025)
      weeks.push(week52_2025)
      
      // Calculate current week number in 2026
      let maxWeek2026 = 0
      if (now.getFullYear() >= 2026) {
        // Get the Saturday of week 1, 2026 (Jan 3, 2026)
        const week1Start = new Date(2026, 0, 3) // First Saturday of 2026
        if (now >= week1Start) {
          const daysSinceWeek1 = Math.floor((now - week1Start) / 86400000)
          maxWeek2026 = Math.floor(daysSinceWeek1 / 7) + 1
        }
      }
      
      // Add weeks of 2026 up to current week
      for (let weekNum = 1; weekNum <= Math.max(maxWeek2026, 1); weekNum++) {
        // Only add if we're in 2026 or past
        if (now >= new Date(2026, 0, 3)) {
          const weekData = this.calculateWeekData(weekNum, 2026)
          weekData.isCurrent = this.isCurrentWeek(weekNum, 2026)
          weeks.push(weekData)
        }
      }
      
      // Reverse to show most recent first
      return weeks.reverse()
    },
    totalStats() {
      return {
        weeks: this.weeklyData.length,
        workouts: this.weeklyData.reduce((sum, w) => sum + w.totalWorkouts, 0),
        conditioning: this.weeklyData.reduce((sum, w) => sum + w.totalConditioning, 0),
        neck: this.weeklyData.reduce((sum, w) => sum + w.totalNeck, 0)
      }
    }
  },
  methods: {
    isCurrentWeek(weekNumber, year) {
      const now = new Date()
      const { dates } = this.getWeekDates(weekNumber, year)
      const todayStr = now.toISOString().split('T')[0]
      return dates.includes(todayStr)
    },
    getWeekDates(weekNumber, year) {
      // Saturday is the first day of the week
      let saturday
      
      if (year === 2025 && weekNumber === 52) {
        // Special case: Week 52 of 2025 starts Dec 27, 2025
        saturday = new Date(2025, 11, 27)
      } else if (year === 2026) {
        // Week 1 of 2026 starts Jan 3, 2026 (first Saturday)
        // Week 2 starts Jan 10, 2026, etc.
        saturday = new Date(2026, 0, 3 + (weekNumber - 1) * 7)
      } else {
        // Generic calculation for other years
        const jan1 = new Date(year, 0, 1)
        const firstSaturday = new Date(year, 0, 1 + ((6 - jan1.getDay() + 7) % 7))
        saturday = new Date(firstSaturday)
        saturday.setDate(firstSaturday.getDate() + (weekNumber - 1) * 7)
      }
      
      const friday = new Date(saturday)
      friday.setDate(saturday.getDate() + 6)
      
      const dates = []
      for (let i = 0; i < 7; i++) {
        const d = new Date(saturday)
        d.setDate(saturday.getDate() + i)
        dates.push(d.toISOString().split('T')[0])
      }
      
      return {
        dates,
        range: `${this.formatShortDate(saturday)} - ${this.formatShortDate(friday)}`
      }
    },
    formatShortDate(date) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    },
    calculateWeekData(weekNumber, year) {
      const { dates, range } = this.getWeekDates(weekNumber, year)
      
      let weights = []
      let calories = []
      let proteins = []
      let steps = []
      let sleeps = []
      let workouts = 0
      let conditioning = 0
      let neck = 0
      
      dates.forEach(dateStr => {
        // Get weight for this date
        const weightEntry = store.weights.find(w => w.date === dateStr)
        if (weightEntry) weights.push(weightEntry.weight)
        
        // Get nutrition for this date
        const nutrition = getDailyTotals(dateStr)
        if (nutrition.calories > 0) calories.push(nutrition.calories)
        if (nutrition.protein > 0) proteins.push(nutrition.protein)
        
        // Get workout for this date
        const workout = store.workouts.find(w => w.date === dateStr)
        if (workout) {
          if (workout.type && workout.type !== 'Active Recovery') workouts++
          if (workout.conditioning) conditioning++
          if (workout.neckDone) neck++
          if (workout.steps) steps.push(workout.steps)
          if (workout.sleep) sleeps.push(workout.sleep)
        }
      })
      
      // Get strength data for this week
      const strengthEntry = store.strength.find(s => s.week === weekNumber && s.year === year)
      
      return {
        weekNumber,
        year,
        dateRange: range,
        avgWeight: weights.length ? (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1) : null,
        avgCalories: calories.length ? Math.round(calories.reduce((a, b) => a + b, 0) / calories.length) : null,
        avgProtein: proteins.length ? Math.round(proteins.reduce((a, b) => a + b, 0) / proteins.length) : null,
        avgSteps: steps.length ? Math.round(steps.reduce((a, b) => a + b, 0) / steps.length) : null,
        avgSleep: sleeps.length ? (sleeps.reduce((a, b) => a + b, 0) / sleeps.length).toFixed(1) : null,
        totalWorkouts: workouts,
        totalConditioning: conditioning,
        totalNeck: neck,
        strength: {
          deadlift: strengthEntry?.deadlift || null,
          backsquat: strengthEntry?.backsquat || null,
          pullups: strengthEntry?.pullups || null,
          curls: strengthEntry?.curls || null,
          rows: strengthEntry?.rows || null
        }
      }
    },
    formatStrength(data) {
      if (!data || !data.weight) return '—'
      return `${data.weight}×${data.reps || '?'}`
    }
  }
}
</script>

<style scoped>
.page-wide {
  padding: 0;
}

.container-wide {
  width: 100%;
  padding: var(--space-md) 0;
}

.container-wide .section {
  padding: 0 var(--space-md);
}

.section-subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: var(--space-xs);
}

.table-container {
  overflow-x: auto;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  margin: var(--space-md) 0;
}

.rewind-table {
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
  white-space: nowrap;
}

.rewind-table th,
.rewind-table td {
  padding: var(--space-sm) var(--space-md);
  text-align: center;
  border-bottom: 1px solid var(--border-subtle);
}

.rewind-table th {
  background: var(--bg-tertiary);
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.rewind-table td {
  color: var(--text-primary);
}

.sticky-col {
  position: sticky;
  left: 0;
  background: var(--bg-secondary);
  z-index: 5;
  text-align: left !important;
  border-right: 1px solid var(--border-medium);
}

.rewind-table th.sticky-col {
  background: var(--bg-tertiary);
  z-index: 15;
}

.week-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.week-number {
  font-weight: 700;
  color: var(--cut-primary);
}

.year-tag {
  font-size: 0.625rem;
  color: var(--text-muted);
  margin-left: 2px;
}

.week-dates {
  font-size: 0.625rem;
  color: var(--text-muted);
}

.unit {
  font-size: 0.625rem;
  color: var(--text-muted);
  margin-left: 2px;
}

.highlight {
  font-weight: 600;
  color: var(--bulk-primary);
}

.current-week {
  background: rgba(249, 115, 22, 0.1);
}

.current-week .sticky-col {
  background: rgba(249, 115, 22, 0.15);
}

.rewind-table tbody tr:hover {
  background: var(--bg-tertiary);
}

.rewind-table tbody tr:hover .sticky-col {
  background: var(--bg-tertiary);
}

.rewind-table tbody tr.current-week:hover {
  background: rgba(249, 115, 22, 0.15);
}

/* Summary section */
.subsection-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-sm);
}

.summary-item {
  text-align: center;
  padding: var(--space-md);
}

.summary-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--cut-primary);
}

.summary-label {
  display: block;
  font-size: 0.625rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: var(--space-xs);
}

@media (max-width: 480px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
