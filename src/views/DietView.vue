<template>
  <div class="page">
    <div class="container">
      <!-- Sub-navigation tabs -->
      <div class="tabs mb-lg">
        <button 
          class="tab" 
          :class="{ active: activeTab === 'log' }"
          @click="activeTab = 'log'"
        >
          Log
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'database' }"
          @click="activeTab = 'database'"
        >
          Foods
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'examples' }"
          @click="activeTab = 'examples'"
        >
          Meals
        </button>
      </div>

      <!-- Meal Logging -->
      <div v-if="activeTab === 'log'" class="animate-fade-in">
        <!-- Date selector and daily summary -->
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">Daily Log</h2>
            <input 
              type="date" 
              class="input date-input"
              v-model="selectedDate"
            />
          </div>

          <!-- Daily totals card -->
          <div class="totals-card card">
            <div class="totals-grid">
              <div class="total-item">
                <span class="total-value" :class="{ warning: dailyTotals.calories > calorieTarget }">
                  {{ dailyTotals.calories }}
                </span>
                <span class="total-label">Calories</span>
                <span class="total-target">/ {{ calorieTarget }}</span>
              </div>
              <div class="total-divider"></div>
              <div class="total-item">
                <span class="total-value" :class="{ success: dailyTotals.protein >= proteinTarget }">
                  {{ dailyTotals.protein }}g
                </span>
                <span class="total-label">Protein</span>
                <span class="total-target">/ {{ proteinTarget }}g</span>
              </div>
            </div>
            
            <div class="progress-bars mt-md">
              <div class="mini-progress">
                <span class="mini-label">Calories</span>
                <div class="progress-bar">
                  <div 
                    class="fill" 
                    :class="dailyTotals.calories > calorieTarget ? 'over' : 'cut'"
                    :style="{ width: Math.min((dailyTotals.calories / calorieTarget) * 100, 100) + '%' }"
                  ></div>
                </div>
              </div>
              <div class="mini-progress">
                <span class="mini-label">Protein</span>
                <div class="progress-bar">
                  <div 
                    class="fill bulk"
                    :style="{ width: Math.min((dailyTotals.protein / proteinTarget) * 100, 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Meals by category -->
        <div class="section">
          <div 
            v-for="mealType in mealTypes" 
            :key="mealType" 
            class="meal-section"
          >
            <div class="meal-header" @click="toggleMeal(mealType)">
              <h3 class="meal-title">{{ mealType }}</h3>
              <div class="meal-meta">
                <span class="meal-totals">
                  {{ getMealTotals(mealType).calories }} cal · {{ getMealTotals(mealType).protein }}g
                </span>
                <span class="expand-icon">{{ expandedMeals[mealType] ? '−' : '+' }}</span>
              </div>
            </div>

            <div v-if="expandedMeals[mealType]" class="meal-content">
              <!-- Existing items -->
              <div class="meal-items">
                <div 
                  v-for="(item, index) in getMealItems(mealType)" 
                  :key="index"
                  class="meal-item"
                >
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-macros">{{ item.calories }} · {{ item.protein }}g</span>
                  <button class="btn-remove" @click="removeItem(mealType, index)">×</button>
                </div>
              </div>

              <!-- Add new item -->
              <div class="add-item-form">
                <input 
                  type="text" 
                  class="input"
                  v-model="newItem[mealType].name"
                  placeholder="Food item"
                />
                <div class="macro-inputs">
                  <input 
                    type="number" 
                    class="input input-sm"
                    v-model.number="newItem[mealType].calories"
                    placeholder="Cal"
                  />
                  <input 
                    type="number" 
                    class="input input-sm"
                    v-model.number="newItem[mealType].protein"
                    placeholder="Pro"
                  />
                  <button 
                    class="btn btn-sm btn-primary"
                    @click="addItem(mealType)"
                  >
                    Add
                  </button>
                </div>
              </div>

              <!-- Quick add from database -->
              <div class="quick-add">
                <span class="quick-label">Quick add:</span>
                <div class="quick-items">
                  <button 
                    v-for="food in topFoods" 
                    :key="food.name"
                    class="quick-btn"
                    @click="openQuickAddModal(mealType, food)"
                  >
                    {{ food.name.split(' ')[0] }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Food Database -->
      <div v-if="activeTab === 'database'" class="animate-fade-in">
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">Food Database</h2>
          </div>

          <input 
            type="text" 
            class="input mb-md"
            v-model="searchQuery"
            placeholder="Search foods..."
          />

          <div class="food-list">
            <div 
              v-for="food in filteredFoods" 
              :key="food.name"
              class="food-item card-flat"
            >
              <div class="food-main">
                <span class="food-name">{{ food.name }}</span>
                <span class="food-quantity">{{ food.quantity }}</span>
              </div>
              <div class="food-macros">
                <span class="macro">{{ food.calories }} cal</span>
                <span class="macro protein">{{ food.protein }}g P</span>
                <span class="macro">{{ food.carbs }}g C</span>
                <span class="macro">{{ food.fats }}g F</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Meal Examples -->
      <div v-if="activeTab === 'examples'" class="animate-fade-in">
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">Meal Templates</h2>
            <div class="phase-toggle">
              <button 
                class="btn btn-sm"
                :class="{ 'btn-primary': selectedPhase === 'cut' }"
                @click="selectedPhase = 'cut'"
              >
                Cut
              </button>
              <button 
                class="btn btn-sm"
                :class="{ 'btn-bulk': selectedPhase === 'bulk' }"
                @click="selectedPhase = 'bulk'"
              >
                Bulk
              </button>
            </div>
          </div>

          <div class="examples-list">
            <div 
              v-for="meal in currentMealExamples" 
              :key="meal.name"
              class="example-card card"
            >
              <div class="example-header">
                <h3 class="example-name">{{ meal.name }}</h3>
                <div class="example-totals">
                  <span class="example-cal">{{ meal.totalCalories }} cal</span>
                  <span class="example-pro">{{ meal.totalProtein }}g protein</span>
                </div>
              </div>
              
              <ul class="example-items">
                <li v-for="item in meal.items" :key="item.name">
                  <span class="ex-item-name">{{ item.name }}</span>
                  <span class="ex-item-qty">{{ item.quantity }}</span>
                </li>
              </ul>

              <button 
                class="btn btn-sm w-full mt-sm"
                @click="applyMealTemplate(meal)"
              >
                Apply to Today
              </button>
            </div>
          </div>

          <!-- Daily total for phase -->
          <div class="phase-summary card mt-lg">
            <h3 class="summary-title">{{ selectedPhase === 'cut' ? 'Cut' : 'Bulk' }} Daily Target</h3>
            <div class="summary-stats">
              <div class="summary-stat">
                <span class="summary-value">{{ selectedPhase === 'cut' ? '~2,100' : '~2,900' }}</span>
                <span class="summary-label">Calories</span>
              </div>
              <div class="summary-stat">
                <span class="summary-value">{{ selectedPhase === 'cut' ? '200+' : '180-200' }}</span>
                <span class="summary-label">Protein (g)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Add Modal -->
    <div v-if="showQuickAddModal" class="modal-overlay" @click.self="closeQuickAddModal">
      <div class="modal-content">
        <h3 class="modal-title">Add {{ modalFood?.name }}</h3>
        <p class="modal-info">Base: {{ modalFood?.quantity }} = {{ modalFood?.calories }} cal, {{ modalFood?.protein }}g protein</p>
        
        <div class="modal-form">
          <label class="label">Quantity multiplier</label>
          <div class="modal-input-row">
            <input 
              type="number" 
              class="input"
              v-model.number="modalMultiplier"
              step="0.5"
              min="0.5"
              ref="modalInput"
            />
            <span class="modal-x">×</span>
          </div>
          
          <div class="modal-preview">
            <span class="preview-label">Result:</span>
            <span class="preview-value">{{ calculateModalCalories }} cal, {{ calculateModalProtein }}g protein</span>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn" @click="closeQuickAddModal">Cancel</button>
          <button class="btn btn-primary" @click="confirmQuickAdd">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  store, 
  saveMeal, 
  getMealsForDate, 
  getDailyTotals,
  getTodayDate,
  getCurrentPhase,
  getPhaseKey
} from '../store.js'
import { foodDatabase, mealExamples, mealTypes } from '../data/database.js'

export default {
  name: 'DietView',
  data() {
    const phase = getCurrentPhase()
    return {
      activeTab: 'log',
      selectedDate: getTodayDate(),
      searchQuery: '',
      selectedPhase: getPhaseKey(),
      expandedMeals: {
        'Breakfast': true,
        'Pre-workout': false,
        'Post-workout': false,
        'Dinner': false,
        'Other': false
      },
      newItem: {
        'Breakfast': { name: '', calories: null, protein: null },
        'Pre-workout': { name: '', calories: null, protein: null },
        'Post-workout': { name: '', calories: null, protein: null },
        'Dinner': { name: '', calories: null, protein: null },
        'Other': { name: '', calories: null, protein: null }
      },
      mealTypes,
      foodDatabase,
      mealExamples,
      calorieTarget: phase.calorieTarget,
      proteinTarget: phase.proteinTarget,
      // Modal state
      showQuickAddModal: false,
      modalFood: null,
      modalMealType: null,
      modalMultiplier: 1
    }
  },
  computed: {
    dailyTotals() {
      return getDailyTotals(this.selectedDate)
    },
    filteredFoods() {
      if (!this.searchQuery) return this.foodDatabase
      const query = this.searchQuery.toLowerCase()
      return this.foodDatabase.filter(f => 
        f.name.toLowerCase().includes(query)
      )
    },
    topFoods() {
      return this.foodDatabase.slice(0, 5)
    },
    currentMealExamples() {
      return this.mealExamples[this.selectedPhase] || []
    },
    calculateModalCalories() {
      if (!this.modalFood) return 0
      return Math.round(this.modalFood.calories * (this.modalMultiplier || 1))
    },
    calculateModalProtein() {
      if (!this.modalFood) return 0
      return Math.round(this.modalFood.protein * (this.modalMultiplier || 1))
    }
  },
  watch: {
    selectedDate() {
      // Totals will auto-update via computed
    }
  },
  methods: {
    getMealItems(mealType) {
      const meals = getMealsForDate(this.selectedDate)
      const meal = meals.find(m => m.meal === mealType)
      return meal?.items || []
    },
    getMealTotals(mealType) {
      const items = this.getMealItems(mealType)
      return items.reduce((acc, item) => ({
        calories: acc.calories + (item.calories || 0),
        protein: acc.protein + (item.protein || 0)
      }), { calories: 0, protein: 0 })
    },
    toggleMeal(mealType) {
      this.expandedMeals[mealType] = !this.expandedMeals[mealType]
    },
    addItem(mealType) {
      const item = this.newItem[mealType]
      if (!item.name) return
      
      const currentItems = [...this.getMealItems(mealType)]
      currentItems.push({
        name: item.name,
        calories: item.calories || 0,
        protein: item.protein || 0
      })
      
      saveMeal(this.selectedDate, mealType, currentItems)
      
      // Reset form
      this.newItem[mealType] = { name: '', calories: null, protein: null }
    },
    removeItem(mealType, index) {
      const currentItems = [...this.getMealItems(mealType)]
      currentItems.splice(index, 1)
      saveMeal(this.selectedDate, mealType, currentItems)
    },
    openQuickAddModal(mealType, food) {
      this.modalMealType = mealType
      this.modalFood = food
      this.modalMultiplier = 1
      this.showQuickAddModal = true
      this.$nextTick(() => {
        if (this.$refs.modalInput) {
          this.$refs.modalInput.focus()
          this.$refs.modalInput.select()
        }
      })
    },
    closeQuickAddModal() {
      this.showQuickAddModal = false
      this.modalFood = null
      this.modalMealType = null
      this.modalMultiplier = 1
    },
    confirmQuickAdd() {
      if (!this.modalFood || !this.modalMealType) return
      
      const multiplier = this.modalMultiplier || 1
      const currentItems = [...this.getMealItems(this.modalMealType)]
      const displayMultiplier = multiplier !== 1 ? ` (${multiplier}×)` : ''
      currentItems.push({
        name: this.modalFood.name + displayMultiplier,
        calories: Math.round(this.modalFood.calories * multiplier),
        protein: Math.round(this.modalFood.protein * multiplier)
      })
      saveMeal(this.selectedDate, this.modalMealType, currentItems)
      this.closeQuickAddModal()
    },
    applyMealTemplate(meal) {
      const mealType = meal.name
      const items = meal.items.map(item => ({
        name: `${item.name} (${item.quantity})`,
        calories: item.calories,
        protein: item.protein
      }))
      saveMeal(this.selectedDate, mealType, items)
      alert(`${mealType} template applied!`)
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

/* Totals card */
.totals-card {
  background: linear-gradient(135deg, var(--bg-card), var(--bg-tertiary));
}

.totals-grid {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.total-item {
  text-align: center;
}

.total-value {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
}

.total-value.warning {
  color: var(--accent-red);
}

.total-value.success {
  color: var(--bulk-primary);
}

.total-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.total-target {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.total-divider {
  width: 1px;
  height: 50px;
  background: var(--border-medium);
}

.progress-bars {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.mini-progress {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.mini-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  width: 60px;
}

.fill.over {
  background: linear-gradient(90deg, var(--accent-red), #dc2626);
}

/* Meal sections */
.meal-section {
  margin-bottom: var(--space-md);
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.meal-header:hover {
  background: var(--bg-secondary);
}

.meal-title {
  font-size: 1rem;
  font-weight: 600;
}

.meal-meta {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.meal-totals {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.expand-icon {
  font-size: 1.25rem;
  color: var(--text-muted);
  width: 20px;
  text-align: center;
}

.meal-content {
  padding: 0 var(--space-md) var(--space-md);
  border-top: 1px solid var(--border-subtle);
}

.meal-items {
  margin-bottom: var(--space-md);
}

.meal-item {
  display: flex;
  align-items: center;
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--border-subtle);
}

.meal-item:last-child {
  border-bottom: none;
}

.item-name {
  flex: 1;
  font-size: 0.875rem;
}

.item-macros {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-right: var(--space-sm);
}

.btn-remove {
  width: 24px;
  height: 24px;
  padding: 0;
  font-size: 1rem;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.btn-remove:hover {
  color: var(--accent-red);
  background: rgba(239, 68, 68, 0.1);
}

/* Add item form */
.add-item-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.macro-inputs {
  display: flex;
  gap: var(--space-sm);
}

.macro-inputs .input-sm {
  flex: 1;
  text-align: center;
}

/* Quick add */
.quick-add {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.quick-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.quick-items {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.quick-btn {
  padding: var(--space-xs) var(--space-sm);
  font-size: 0.75rem;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.quick-btn:hover {
  color: var(--text-primary);
  border-color: var(--cut-primary);
}

.quick-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xs);
}

.multiplier-input {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.multiplier-input .input-xs {
  width: 50px;
  padding: var(--space-xs);
  font-size: 0.75rem;
  text-align: center;
}

.multiplier-x {
  font-size: 0.875rem;
  color: var(--text-muted);
}

/* Food database */
.food-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.food-item {
  padding: var(--space-md);
}

.food-main {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-xs);
}

.food-name {
  font-weight: 600;
}

.food-quantity {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.food-macros {
  display: flex;
  gap: var(--space-md);
}

.macro {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.macro.protein {
  color: var(--bulk-primary);
  font-weight: 600;
}

/* Meal examples */
.phase-toggle {
  display: flex;
  gap: var(--space-xs);
}

.examples-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.example-card {
  padding: var(--space-md);
}

.example-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
}

.example-name {
  font-size: 1rem;
  font-weight: 600;
}

.example-totals {
  text-align: right;
}

.example-cal {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--cut-primary);
}

.example-pro {
  display: block;
  font-size: 0.75rem;
  color: var(--bulk-primary);
}

.example-items {
  list-style: none;
}

.example-items li {
  display: flex;
  justify-content: space-between;
  padding: var(--space-xs) 0;
  font-size: 0.875rem;
  border-bottom: 1px solid var(--border-subtle);
}

.example-items li:last-child {
  border-bottom: none;
}

.ex-item-name {
  color: var(--text-primary);
}

.ex-item-qty {
  color: var(--text-muted);
}

/* Phase summary */
.phase-summary {
  text-align: center;
}

.summary-title {
  font-size: 1rem;
  margin-bottom: var(--space-md);
}

.summary-stats {
  display: flex;
  justify-content: space-around;
}

.summary-stat {
  text-align: center;
}

.summary-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.summary-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: var(--space-md);
}

.modal-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  width: 100%;
  max-width: 320px;
  animation: slideUp 0.2s ease;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: var(--space-xs);
}

.modal-info {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
  padding: var(--space-sm);
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
}

.modal-form {
  margin-bottom: var(--space-lg);
}

.modal-input-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.modal-input-row .input {
  flex: 1;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-x {
  font-size: 1.25rem;
  color: var(--text-muted);
}

.modal-preview {
  margin-top: var(--space-md);
  padding: var(--space-md);
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  text-align: center;
}

.preview-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
}

.preview-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--bulk-primary);
}

.modal-actions {
  display: flex;
  gap: var(--space-sm);
}

.modal-actions .btn {
  flex: 1;
}
</style>
