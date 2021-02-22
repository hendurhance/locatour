<template>
<section class="origin-destination">
  <div class="ui form">
    <div class="ui message red small" v-show="error">
      {{ error }}
    </div>
  </div>
  <div class="ui form">
    <div class="two fields">
      <div class="field">
        <div class="ui left icon input">
          <i class="marker alternate icon"></i>
          <input type="text" placeholder="Origin" ref="origin">
        </div>
      </div>
      <div class="field">
        <div class="ui left icon input">
          <i class="flag checkered icon"></i>
          <input type="text" placeholder="Destination" ref="destination">
        </div>
      </div>
      <button 
        class="ui button small green"
        :class="{loading:isLoading}" 
        @click="calculateRoutes"
      >Routes</button>
    </div>
  </div>
</section>
</template>

<script>
import axios from 'axios'

export default {
  data(){
    return{
      route: {
        origin: {
          address: '',
          lat: 0,
          lng: 0
        },
        destination: {
          address: '',
          lat: 0,
          lng: 0
        },
        distance: {},
        duration: {}
      },
      error: '',
      isLoading: false
    }
  },
  mounted(){
    for(let ref in this.$refs){
      // console.log(this.$refs[ref])
      const google = window.google
      const autocomplete = new google.maps.places.Autocomplete(
        this.$refs[ref],
        {
          bounds: new google.maps.LatLngBounds(
                      new google.maps.LatLng(6.5244, 3.3792)
          )
        }
      )

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        this.route[ref].address = `${place.name}, ${place.vicinity}`
        this.route[ref].lat = place.geometry.location.lat()
        this.route[ref].lng = place.geometry.location.lng()
      })
    }
  },
  methods: {
    calculateRoutes(){
      this.isLoading = true
      // console.log(this.route)
      if(this.route.origin.address === '' || this.route.destination.address === ''){
        this.error = "Input is Invalid"
      }else{
        this.error = ''
        const URL = `https://secret-ocean-49799.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?origins=${this.route.origin.lat},${this.route.origin.lng}&destinations=${this.route.destination.lat},${this.route.destination.lng}&key=AIzaSyC_PNlFvbM1LVO55Ep_8NKyf6oylut7JTg`
        axios
        .get(URL)
        .then(response => {
          if(response.data.error_message){
            this.error = response.data.error_message
          }else{
            const elements = response.data.rows[0].elements
            
            if(elements[0].status === "ZERO_RESULTS"){
              this.error = 'No Results Available'
            }else{
              console.info(elements[0].distance)
              console.info(elements[0].duration)

              this.route.distance = elements[0].distance
              this.route.duration = elements[0].duration

              this.isLoading = false
            }
          }
        })
        .catch(error => {
          this.isLoading = false
          this.error = error.message
        })
      }
    }
  }
}
</script>

<style scoped>
.origin-destination{
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 5px;
}
</style>