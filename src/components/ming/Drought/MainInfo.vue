<template>
  <div class="mainInfo">

    <!-- 左侧 -->
    <SideLeft ref="leftSide"></SideLeft>
    <!-- 地图-->
    <div class="map"><BaseMap :params="{ init: true, tpl: mapTpl }" ref="map" /></div>
    <div class="legend"><img id="legend"/></div>
  </div>
</template>

<script>
import BaseMap from '@/components/BaseMap/Basemap1';
import SideLeft from '@/components/ming/Drought/LeftSiderbar';
import mapTpl from '../../../../public/tpl/desertification.json';
import OLMap from "@/utils/OLMap/OLMap";
import ImageWMS from 'ol/source/ImageWMS';

export default {
  name: "MainInfo",
  components:{BaseMap,SideLeft},
  data() {
    return {
      mapTpl: mapTpl, //地图模板
    };
  },
  mouted(){
    this.$nextTick(()=>{
      console.log('执行')
      this.olMap = new OLMap();

      const wmsSource = new ImageWMS({
        url: 'http://localhost:7070/geoserver/nmg/wms',
        params: {'LAYERS': 'nmg:test'},
        ratio: 1,
        serverType: 'geoserver',
      });

      const updateLegend = function (resolution) {
        const graphicUrl = wmsSource.getLegendUrl(resolution);
        const img = document.getElementById('legend');
        img.src = graphicUrl;
        console.log(img.src)
      };

      // Initial legend
      const resolution = this.olMap.getView().getResolution();
      updateLegend(resolution);
    })
  }
}
</script>

<style lang="scss" scoped>
.mainInfo{
  height: 100%;
  width: 100%;
}
.map{
  position: absolute;
  left: 20%;
  height: 100%;
  width: 80%;
  background: #00b4ff;
}
.legend{
  position: absolute;
  height: 200px;
  width: 200px;
  //background: #888888;
}
</style>