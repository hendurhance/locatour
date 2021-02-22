import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'
import "semantic-ui-css/semantic.min.css"
import UserLocation from '@/pages/UserLocation.vue'
import CloseBy from '@/pages/CloseBy.vue'
import DistanceCalc from '@/pages/DistanceCalc.vue'

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
      },
      {
        path: '/transit',
        name: 'Distance Calculator',
        component: DistanceCalc
      }
  ]
})

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDJqK_D_WJCeT1nMRxsZBxqJCxHJ7uCFUg",
  authDomain: "locatour-b9596.firebaseapp.com",
  projectId: "locatour-b9596",
  storageBucket: "locatour-b9596.appspot.com",
  messagingSenderId: "129341321005",
  appId: "1:129341321005:web:62d4b4ff8bfb1da11beda4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// console.log(firebase)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
