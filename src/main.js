import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import UserLocation from '@/pages/UserLocation.vue'
import CloseBy from '@/pages/CloseBy.vue'

Vue.config.productionTip = false


Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'UserLocation',
        component: UserLocation
      },
      {
        path: '/closeby',
        name: 'CloseBy',
        component: CloseBy
      }
  ]
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
