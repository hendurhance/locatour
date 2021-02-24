<template>
  <section class="map" ref="map">

  </section>
</template>

<script>
import { EventBus } from '@/EventBus.js'
export default {
  mounted(){
    // Google constant
    const google = window.google

    const map = new google.maps.Map(
      this.$refs['map'], {
        center: new google.maps.LatLng(6.5244, 3.3792),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    )
    const directionsService = new google.maps.DirectionsService()
    const directionsRenderer = new google.maps.DirectionsRenderer()

    // console.log('map info', map)

    EventBus.$on('route-data', ({origin, destination}) => {
      directionsService.route(
        {
          origin: origin.address,
          destination: destination.address,
          travelMode: 'DRIVING'
        },
        (response, status) => {
          if(status === 'OK'){
            directionsRenderer.setDirections(response)
            directionsRenderer.setMap(map)
          }
          console.log(response)
          console.warn(status)
        }
      )
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