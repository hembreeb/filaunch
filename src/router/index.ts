import { createRouter, createWebHistory } from 'vue-router'
import ContentView from '../views/ContentView.vue'
import LaunchpadView from '../views/LaunchpadView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'contentView',
      component: ContentView
    },
    {
      path: '/launchpad',
      name: 'launchpad',
      component: LaunchpadView
    }
  ]
})

export default router
