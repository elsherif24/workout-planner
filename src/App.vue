<template>
  <div class="app">
    <!-- Phase Header -->
    <header class="app-header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <h1 class="app-title">Fitness 2026</h1>
            <span :class="['pill', phaseKey === 'cut' ? 'pill-cut' : 'pill-bulk']">
              {{ phase.name }}
            </span>
          </div>
          <div class="header-right">
            <div class="day-counter">
              <span class="day-number">Day {{ dayOfPhase }}</span>
              <span class="day-total">of {{ totalDays }}</span>
            </div>
          </div>
        </div>
        
        <!-- Progress Section -->
        <div class="progress-section">
          <div class="progress-item">
            <div class="progress-label">
              <span>Weight Progress</span>
              <span class="progress-value">{{ weightProgress.toFixed(0) }}%</span>
            </div>
            <div class="progress-bar progress-bar-lg">
              <div 
                class="fill" 
                :class="phaseKey"
                :style="{ width: weightProgress + '%' }"
              ></div>
            </div>
            <div class="progress-target">
              <span>{{ phase.startWeight }}kg</span>
              <span>{{ phase.targetWeightMin }}-{{ phase.targetWeightMax }}kg</span>
            </div>
          </div>
          
          <div class="progress-item">
            <div class="progress-label">
              <span>Workouts</span>
              <span class="progress-value">{{ workoutsCompleted }}</span>
            </div>
            <div class="progress-bar">
              <div 
                class="fill" 
                :class="phaseKey"
                :style="{ width: Math.min((workoutsCompleted / targetWorkouts) * 100, 100) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <router-link 
        to="/workout" 
        class="nav-item"
        :class="{ active: $route.path === '/workout' }"
      >
        <span class="icon">💪</span>
        <span>Workout</span>
      </router-link>
      <router-link 
        to="/diet" 
        class="nav-item"
        :class="{ active: $route.path === '/diet' }"
      >
        <span class="icon">🍽️</span>
        <span>Diet</span>
      </router-link>
      <router-link 
        to="/stats" 
        class="nav-item"
        :class="{ active: $route.path === '/stats' }"
      >
        <span class="icon">📊</span>
        <span>Stats</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
import { 
  getCurrentPhase, 
  getPhaseKey,
  getDayOfPhase, 
  getTotalDaysInPhase,
  getWeightProgress,
  getWorkoutsInPhase
} from './store.js'

export default {
  name: 'App',
  data() {
    return {
      phase: getCurrentPhase(),
      phaseKey: getPhaseKey(),
      dayOfPhase: getDayOfPhase(),
      totalDays: getTotalDaysInPhase(),
      weightProgress: getWeightProgress(),
      workoutsCompleted: getWorkoutsInPhase(),
      targetWorkouts: 130 // ~5 workouts per week for 26 weeks
    }
  },
  mounted() {
    // Update progress periodically
    this.updateProgress()
  },
  methods: {
    updateProgress() {
      this.phase = getCurrentPhase()
      this.phaseKey = getPhaseKey()
      this.dayOfPhase = getDayOfPhase()
      this.totalDays = getTotalDaysInPhase()
      this.weightProgress = getWeightProgress()
      this.workoutsCompleted = getWorkoutsInPhase()
    }
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  padding: var(--space-lg) 0;
  border-bottom: 1px solid var(--border-subtle);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-lg);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.app-title {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #fff 0%, #a0a0b0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-right {
  text-align: right;
}

.day-counter {
  display: flex;
  flex-direction: column;
}

.day-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.day-total {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.progress-value {
  font-weight: 600;
  color: var(--text-primary);
}

.progress-target {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.main-content {
  flex: 1;
  padding-bottom: 80px;
}

/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
