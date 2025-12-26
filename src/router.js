import { createRouter, createWebHashHistory } from 'vue-router'
import WorkoutView from './views/WorkoutView.vue'
import DietView from './views/DietView.vue'
import StatsView from './views/StatsView.vue'

const routes = [
    { path: '/', redirect: '/workout' },
    { path: '/workout', name: 'Workout', component: WorkoutView },
    { path: '/diet', name: 'Diet', component: DietView },
    { path: '/stats', name: 'Stats', component: StatsView }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
