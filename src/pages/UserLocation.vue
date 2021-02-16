<template>
  <section class="ui column centered grid">
      <div class="column">
          <form action="" class="ui segment large form">
              <div class="ui message red" v-show="error"> {{ error }} </div>
              <div class="ui segment">
                  <div class="field">
                      <div class="ui right icon input large" :class="{loading:isLoading}">
                          <input 
                            id="autocomplete"
                            type="text" 
                            v-model.trim="address" 
                            placeholder="Enter your address.."
                          >
                          <i class="location arrow link icon" @click="locatorAlert"></i>
                      </div>
                  </div>
                  <button class="ui button">Search</button>
              </div>
          </form>
      </div>
  </section>
</template>

<script>

import axios from 'axios'

export default {
    data(){
        return{
            address: '',
            error: '',
            isLoading: false
        }
    },
    mounted(){
        const google = window.google
        new google.maps.places.Autocomplete(
            document.getElementById("autocomplete")
        )
    },
    methods: {
        locatorAlert(){

            this.isLoading = true

            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(
                    position => {
                        this.getAddressFrom(position.coords.latitude, position.coords.longitude)
                        // console.log(position.coords.latitude)
                        // console.log(position.coords.longitude)
                },
                error => {
                    this.error = error.message + '. Allow Location permission'
                    this.isLoading = false
                    // console.error(error.message)
                }
                )
            }else{
                this.error = 'Browser does not support geolocation API'
                this.isLoading = false
                // console.error('Browser does not support geolocation API')
            }
        },
        getAddressFrom(lat, long){
            axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="
             + lat +
             ","
             + long +
             "&key=AIzaSyC_PNlFvbM1LVO55Ep_8NKyf6oylut7JTg")
             .then(response => {
                 if(response.data.error_message){
                     this.error = response.data.error_message
                     this.isLoading = false
                     console.error(response.data.error_message + '1')
                 }else{
                     this.address = response.data.results[0].formatted_address
                    //  console.log(response.data.results[0].formatted_address)
                     this.isLoading = false
                 }
             }).catch(error => {
                 this.error = error.message
                 this.isLoading = false
                 console.error(error.message + '2')
             })
        }
    }
}
</script>

<style>
.ui.button,
.location.arrow
{
    background-color: #FFB60B
}
</style>