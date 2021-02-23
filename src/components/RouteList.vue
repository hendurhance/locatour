<template>
<section class="route-list">
  <div class="route-list-header">
    <h3 class="ui header">Route List</h3>
    <select @change="sortRoute($event)">
      <option selected disabled>Sort</option>
      <optgroup label="Distance">
        <option value="distance-asc">short</option>
        <option value="distance-desc">long</option>
      </optgroup>
      <optgroup label="Duration">
        <option value="duration-asc">fast</option>
        <option value="duration-desc">slow</option>
      </optgroup>
    </select>
  </div>
  <div class="item" v-for="route in routes" :key="route.id">
    <div>
      <i class="marker alternate icon"></i>
      {{ route.origin.address }}
    </div>
    <div>
      <i class="flag checkered icon"></i>
      {{ route.destination.address }}
    </div>
    <div class="ui label small">{{ route.distance.text }}</div>
    <div class="ui label small">{{ route.duration.text }}</div>
  </div>
</section>
</template>

<script>
import firebase from 'firebase'

export default {
  data(){
    return{
      routes: []
    }
  },
  created(){
    const db = firebase.firestore()
    db.collection('routes').onSnapshot(
      snap => {
        this.routes = []
        snap.forEach(doc => {
          let route = doc.data()
          route.id = doc.id
          this.routes.push(route)
        })
      }
    )
  },
  methods: {
    sortRoute(e){
      const sortName = e.target.value.split('-')[0]
      const sortOrder = e.target.value.split('-').[1]
      
      const db = firebase.firestore()
      db.collection('routes').orderBy(sortName + '.value', sortOrder)
      .get()
      .then(snap => {
        this.routes = []
        snap.forEach(doc => {
          let route = doc.data()
          route.id = doc.id
          this.routes.push(route)
        })
      })
    }
  }
}
</script>

<style scoped>
.route-list{
  position: relative;
  z-index: 1;
  max-width: 250px;
  margin: 5px;
  background-color: #fff;
}
.route-list-header{
  padding: 10px
}

.item{
  padding: 10px;
  cursor: pointer;
}

.item:hover{
  background-color: rgba(0,0,0,0.1);
}
</style>