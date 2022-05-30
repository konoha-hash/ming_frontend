<template>
  <div class="RSEIanalysis">
    <!-- 左侧 -->
    <Siderbar :params="{ init: true, tpl: mapTpl, olMap: olMap}"></Siderbar>
    <!-- 地图-->
    <div class="map"><Map :params="{ init: true, tpl: mapTpl, olMap: olMap}" ref="Map"/></div>
  </div>
</template>

<script>
import Siderbar from "@/views/Drought/RSEI/component/Siderbar";
import Map from "@/views/Drought/RSEI/component/Map/Map";
import mapTpl from '../../../../public/tpl/RSEIdefault.json';
import OLMap from "@/utils/OLMap/OLMap";

export default {
  name: "RSEIanalysis",
  components:{Siderbar,Map},
  data() {
    return {
      mapTpl: mapTpl, //地图模板
      olMap: null,
    };
  },
  mounted() {
    const param ={init: true, tpl: this.mapTpl}

    this.olMap = new OLMap(param);

  },
  methods:{
    addLayer(){
      //ceshi
      const item={
        "id": "0158336bce132v9282de583367510107",
        "alias": "2021_01TVDI",
        "name": "2021_01TVDI",
        "type": "wms",
        "url": "http://localhost:7070/geoserver/ming/wms"
      }

      this.olMap.createLayer(item);

      //ceshi end
    },
  },
}
</script>

<style lang="scss" scoped>
.RSEIanalysis{
  width: 100%;
  height: 100%;
}
.map{
  position: absolute;
  left: 430px;
  height: 100%;
  width: 76.5%;
  background: #00b4ff;
}
</style>