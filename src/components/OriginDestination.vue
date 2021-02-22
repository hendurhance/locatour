<template>
<section class="origin-destination">
  <div class="ui form">
    <div class="two fields">
      <div class="field">
        <div class="ui left icon input">
          <i class="marker alternate icon"></i>
          <input type="text" placeholder="Origin">
        </div>
      </div>
      <div class="field">
        <div class="ui left icon input">
          <i class="flag checkered icon"></i>
          <input type="text" placeholder="Destination">
        </div>
      </div>
      <button class="ui button small green">Routes</button>
    </div>
  </div>
</section>
</template>

<script>
export default {

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