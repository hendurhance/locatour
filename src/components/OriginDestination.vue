<template>
<section class="origin-destination">
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
      <button class="ui button small green">Routes</button>
    </div>
  </div>
</section>
</template>

<script>
export default {
  mounted(){
    // const google = window.google
    for(let ref in this.$refs){
      console.log(this.$refs[ref])
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
        console.log(autocomplete.getPlace())
      })
    }
  }
}
</script>

<style scoped>
.origin-destination{
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 10px;
}
</style>