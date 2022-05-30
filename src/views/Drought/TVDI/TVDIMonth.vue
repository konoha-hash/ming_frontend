<template>
  <div id="TVDIMonth">
    <div class="map"><BaseMap :params="{ init: true, tpl: mapTpl }" ref="map" /></div>


  </div>
</template>

<script>
import BaseMap from '@/components/BaseMap/Basemap1';
import mapTpl from '../../../../public/tpl/TVDI.json';


export default {
  name: "TVDIMonth",
  components:{BaseMap},
  data(){
    return{
      mapTpl:mapTpl,
    }
  }
}
</script>

<style lang="scss" scoped>
#TVDIMonth{
  height: 100%;
  width: 100%;
}

.map{
  position: absolute;
  left:0px;
  height: 100%;
  width: 100%;
  background: #00b4ff;
}

</style>