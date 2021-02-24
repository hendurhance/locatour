<template>
  <section class="map" ref="map">

  </section>
</template>

<script>
import { EventBus } from '@/EventBus.js'
export default {
  data(){
    return{
      map: null
    }
  },
  mounted(){
    // Google constant
    const google = window.google

    const directionsService = new google.maps.DirectionsService()

    // console.log('map info', map)

    EventBus.$on('routes-data', routes => {
      this.map = new google.maps.Map(
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
              suppressMarkers: true,
              directions: response,
              map: this.map 
            })

            console.log(directionsRenderer)
            // Infowindow code for default popup
            this.createInfoWindowWith(origin, "marker alternate")
            this.createInfoWindowWith(destination, "flag checkered")
            


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
            distanceDurationLabel.open(this.map, null)


            this.createPolylineWith(
            [
                {lat: origin.lat, lng: origin.lng},
                {lat: overviewPath[0].lat(), lng: overviewPath[0].lng()}
            ])


            this.createPolylineWith(
              [
                {lat: destination.lat, lng: destination.lng},
                {
                  lat: overviewPath[overviewPath.length - 1].lat(),
                  lng: overviewPath[overviewPath.length - 1].lng(),
                }
            ])

            



          }
        }
        )
      })

    })
  },
  methods: {
    createInfoWindowWith(location, icon){
        // Google constant
        const google = window.google
        const infoWindow = new google.maps.InfoWindow({
          content: `<i class="${icon} icon"></i>${location.address}`,
          position: new google.maps.LatLng(location.lat, location.lng)
        })

        infoWindow.open(this.map, null)
    },
    createPolylineWith(path){
      // Google constant
      const google = window.google
      new google.maps.Polyline({
        path,
        strokeColor: '#000000',
        strokeOpacity: 1,
        strokeWeight: 8,
        map: this.map
      })
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