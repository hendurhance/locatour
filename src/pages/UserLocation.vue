<template>
<div>
<section class="ui column centered grid other">
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

  <section id="map">

  </section>
</div>
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
            document.getElementById("autocomplete"),
            {
                bounds: new google.maps.LatLngBounds(
                    new google.maps.LatLng(6.5244, 3.3792)
                )
            }
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
                    //  console.error(response.data.error_message)
                 }else{
                     this.address = response.data.results[0].formatted_address
                    //  console.log(response.data.results[0].formatted_address)
                     this.isLoading = false
                 }
             }).catch(error => {
                 this.error = error.message
                 this.isLoading = false
                //  console.error(error.message)
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

.pac-icon{
    display: none;
}

.pac-tem{
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
}

.pac-item:hover{
    background-color: #eee;
}

.pac-item-query{
    font-size: 16px;
}

.other{
    position: relative !important;
    z-index: 1 !important;
}

#map{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #FFB60B;
    width: 100%;
    
}
</style>