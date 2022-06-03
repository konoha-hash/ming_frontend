<template>
  <section id="map-widget" class="map-widget">
    <div class="map-container" id="map-container"></div>
  </section>
</template>

<script>
import OLMap from '@/utils/OLMap/OLMap';
import defaultTpl from "../../../../../../public/tpl/default.json";

export default {
  name: "Map",
  data(){
    return{
      mapTpl:null,
      olMap:null,
    }
  },
  props: {
    params: {
      type: Object,
      data () {
        return {};
      }
    },
  },
  mounted() {
    // const { init,tpl = defaultTpl} = this.params;
    //
    // this.mapTpl = tpl;
    // this.$nextTick(()=>{
    //   this.olMap = new OLMap({ init, tpl });
    // })
    this.$nextTick(()=>{
      this.olMap = this.params.olMap;
    })
  },
  methods:{
    addLayer(){
      item={
        "id": "0158336bce132v9282de583367510107",
        "alias": "test",
        "name": "test",
        "type": "wms",
        "url": "http://localhost:7070/geoserver/nmg/wms"
      }
      this.olMap.createLayer(item)
    },


    getolmap(){
      return this.olMap;
    }
  }
}
</script>

<style lang="scss" scoped>
.map-widget{
  width: 100%;
  height: 100%;

  .map-container{
    width: 100%;
    height: 100%;
  }
}

</style>