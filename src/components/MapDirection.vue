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

    const directionsService = new google.maps.DirectionsService()

    // console.log('map info', map)

    EventBus.$on('routes-data', routes => {
      const map = new google.maps.Map(
        this.$refs['map'], {
          center: new google.maps.LatLng(6.5244, 3.3792),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
      )
      routes.forEach(({origin, destination, distance, duration}) => {
        directionsService.route({
          origin: origin.address,
          destination: destination.address,
          travelMode: 'DRIVING'
        },
        (response, status) => {
          if(status === 'OK'){
            const directionsRenderer = new google.maps.DirectionsRenderer({
              suppressMarkers: true
            })

            // Infowindow code for default popup
            this.createInfoWindowWith(origin, "marker alternate", map)
            this.createInfoWindowWith(destination, "flag checkered", map)
            


            const overviewPath = response.routes[0].overview_path
            const middleIndex = parseInt(overviewPath.length / 2)

            const middleShow = overviewPath[middleIndex]

            const distanceDurationLabel = new google.maps.InfoWindow({
              content: `<i class="icon car"></i> ${distance.text} - ${duration.text}`,
              position: new google.maps.LatLng(
                middleShow.lat(), 
                middleShow.lng()
              )
            })
            distanceDurationLabel.open(map, null)

            directionsRenderer.setDirections(response)
            directionsRenderer.setMap(map)
          }
        }
        )
      })

    })
  },
  methods: {
    createInfoWindowWith(location, icon, map){
        // Google constant
        const google = window.google
        const infoWindow = new google.maps.InfoWindow({
          content: `<i class="${icon} icon"></i>${location.address}`,
          position: new google.maps.LatLng(location.lat, location.lng)
        })

        infoWindow.open(map, null)
    }
  }
}
</script>

<style >
.map{
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: #FFB60B;
}

button.gm-ui-hover-effect {
    display: none !important;
}
</style>