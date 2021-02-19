<template>
  <div>
    <h2>Distance Calculator</h2>
    <origin-destination></origin-destination>
    <map-direction></map-direction>
    <route-list></route-list>
  </div>
</template>

<script>
import OriginDestination from '@/components/OriginDestination.vue'
import MapDirection from '@/components/MapDirection.vue'
import RouteList from '@/components/RouteList.vue'


export default {
    components: {
        OriginDestination,
        MapDirection,
        RouteList
    }
}
</script>

<style>

</style>