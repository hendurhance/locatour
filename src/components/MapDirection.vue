<template>
  <section class="map">

  </section>
</template>

<script>
import { EventBus } from '@/EventBus.js'
export default {
  mounted(){
    EventBus.$on('route-data', data => {
      console.log(data)
    })

  }
}
</script>

<style scoped>
.map{
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: #FFB60B;
}
</style>