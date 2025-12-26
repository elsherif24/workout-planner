import { createRouter, createWebHashHistory } from 'vue-router'
import WorkoutView from './views/WorkoutView.vue'
import DietView from './views/DietView.vue'
import StatsView from './views/StatsView.vue'
import RewindView from './views/RewindView.vue'

const routes = [
    { path: '/', redirect: '/workout' },
    { path: '/workout', name: 'Workout', component: WorkoutView },
    { path: '/diet', name: 'Diet', component: DietView },
    { path: '/stats', name: 'Stats', component: StatsView },
    { path: '/rewind', name: 'Rewind', component: RewindView }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
