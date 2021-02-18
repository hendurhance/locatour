<template>
  <div class="ui grid">
      <div class="six wide column main-color">
           <form @submit.prevent class="ui segment large form">
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
                  <div class="field">
                      <div class="two fields">
                          <div class="field">
                              <select v-model="type">
                                  <option value="restaurant">Restaurant</option>
                              </select>
                          </div>
                          <div class="field">
                              <select v-model="range">
                                  <option value="5">5KM</option>
                                  <option value="10">10KM</option>
                                  <option value="15">15KM</option>
                                  <option value="20">20KM</option>
                              </select>
                          </div>
                      </div>
                  </div>
                  <button class="ui button" @click="findCloseBy">Find CloseBy Places</button>
              </div>
          </form>
          <div class="ui segment list-items">
              <div class="ui divided items">
                  <div 
                    class="item" 
                    v-for="(place, index) in places" 
                    :key="place.id" 
                    @click="showInfoWindow(index)"
                    :class="{'active' : activeIndex === index}"
                   >
                      <div class="content">
                          <div class="header">{{ place.name }}</div>
                          <div class="meta">{{ place.vicinity }}</div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div class="ten wide column main-color" ref="map"></div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
    data(){
        return{
            address: '',
            error: '',
            isLoading: false,
            apiKey: "AIzaSyC_PNlFvbM1LVO55Ep_8NKyf6oylut7JTg",
            lat: 0,
            lng: 0,
            type: '',
            range: '',
            places: [],
            markers: [],
            activeIndex: -1
        }
    },
    mounted(){
        const google = window.google
        let autocomplete = new google.maps.places.Autocomplete(
            document.getElementById("autocomplete"),
            {
                bounds: new google.maps.LatLngBounds(
                    new google.maps.LatLng(6.5244, 3.3792)
                )
            }
        )

        autocomplete.addListener('place_changed', () => {
            let place = autocomplete.getPlace()
            console.warn(place)
            this.showNearbyMap(
                place.geometry.location.lat(),
                place.geometry.location.lng() 
                )
        })
    },
    methods: {
        locatorAlert(){

            this.isLoading = true

            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(
                    position => {
                        this.lat = position.coords.latitude
                        this.lng = position.coords.longitude

                        // getting users address
                        this.getAddressFrom(position.coords.latitude, position.coords.longitude)
                        // console.log(position.coords.latitude)
                        // console.log(position.coords.longitude)
                        this.showNearbyMap(position.coords.latitude, position.coords.longitude)
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
             "&key=" + this.apiKey)
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
        },
        findCloseBy(){
            const URL = `http://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.lat},
            ${this.lng}&type=${this.type}&radius=${this.range * 1000}&key=${this.apiKey}`
            
            axios.get(URL).then(response => {
                this.places = response.data.results
                this.showNearbyMap()
                // console.log(response.data.results)
            }).catch(error => {
                this.error = error.message
            })
        },
        showNearbyMap(){
            const google = window.google
            const map = new google.maps.Map(
                this.$refs['map'],
                {
                    zoom: 15,
                    center: new google.maps.LatLng(this.lat, this.lng),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
            )

            const infoWindow = new google.maps.InfoWindow()

            for(let i = 0; i < this.places.length; i++){
                const lat = this.places[i].geometry.location.lat
                const lng = this.places[i].geometry.location.lng
                const placeID = this.places[i].place_id

                const marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat,lng),
                    map: map
                })

                this.markers.push(marker)

                google.maps.event.addListener(
                    marker, "click", () => {
                        const URL = `http://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?key=${this.apiKey}&place_id=${placeID}`
                        
                        axios.get(URL).then(response => {
                            if(response.data.error_message){
                                this.error = response.data.error_message
                            }else{
                                const place = response.data.result
                                if(place.website === undefined){
                                    place.website = 'Not Available'
                                }
                                infoWindow.setContent(`
                                    <div class="ui header">${place.name}</div>
                                    <p>${place.formatted_address}</p>
                                    <a style='color: black' href='tel:+234${place.formatted_phone_number}' target='_blank'>${place.formatted_phone_number}</a> <br>
                                    <a href='${place.website}' target='_blank'>${place.website}</a>
                                `)
                                infoWindow.open(map, marker)
                            }
                            console.log(response.data.result)
                        }).catch(error => {
                            this.error = error.message
                        })
                    })
                // console.log(marker)
            }
        },
        showInfoWindow(index){
            this.activeIndex = index
            const google = window.google
            new google.maps.event.trigger(this.markers[index], 'click')
        }
    }
}
</script>

<style scoped>
.ui.button,
.location.arrow, .main-color
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

.gm-style .gm-style-iw{
    color: black;
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

.list-items{
    max-height: 60vh;
    overflow: auto;
}

.active{
    background: #FFB60B !important;
}
</style>