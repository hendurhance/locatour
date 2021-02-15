<template>
  <section class="ui two column centered grid">
      <div class="column">
          <form action="" class="ui segment large form">
              <div class="ui message red"></div>
              <div class="ui segment">
                  <div class="field">
                      <div class="ui right icon input large">
                          <input type="text" placeholder="Enter your address..">
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

        }
    },
    methods: {
        locatorAlert(){
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(
                    position => {
                        this.getAddressFrom(position.coords.latitude, position.coords.longitude)
                        console.log(position.coords.latitude)
                        console.log(position.coords.longitude)
                },
                error => {
                    console.error(error.message)
                }
                )
            }else{
                console.log('Browser does not support geolocation API')
            }
        },
        getAddressFrom(lat, long){
            axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='
             + lat +
             ',' 
             + long 
             + '&key=AIzaSyBH9KpHSHWGYxC8BB_-0BpT7uziEthw-4k').then(response => {
                 if(response.data.error_message){
                     console.error(response.data.error_message)
                 }else{
                     console.log(response.data.results[0].formatted_address)
                 }
             }).catch(error => {
                 console.error(error.message)
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