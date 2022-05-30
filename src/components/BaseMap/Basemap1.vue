<template>
  <section id="map-widget" class="map-widget">
    <div class="map-container" id="map-container"></div>
    <section class="legend">
      <section class="legend-title">图 例</section>
      <div v-if="false"><img id="legend-content"/></div>
    </section>
  </section>
</template>

<script>
import OLMap from '@/utils/OLMap/OLMap';
import defaultTpl from "../../../public/tpl/default.json";
import ImageWMS from 'ol/source/ImageWMS';
import Overlay from "ol/Overlay";
import View from 'ol/View';
import axios from "axios";

export default {
  name: "Basemap1",
  data(){
    return{
      mapTpl:null,
      olMap: null,
    }
  },
  props: {
    params: {
      type: Object,
      data () {
        return {};
      }
    }
  },
  mounted() {
    const { init,tpl = defaultTpl} = this.params;

    this.mapTpl = tpl;
    // const widgets = tpl?.content?.widgets;
    // const tools = tpl?.content?.tools;

    this.$nextTick(()=>{
      this.olMap = new OLMap({ init, tpl });

      if(tpl.title == 'desert'){
        // 自动生成图例
        const resolution = this.olMap.map.getView().getResolution();

        this.updateLegend(resolution);
        this.getFeatureInfo()
      }
    })


  },
  methods:{
    updateLegend (resolution) {

      console.log('baseLayers:',this.olMap.map.getLayers())
      const wmsSource = new ImageWMS({
        url: 'http://localhost:7070/geoserver/nmg/wms',
        params: {'LAYERS': 'nmg:test'},
        ratio: 1,
        serverType: 'geoserver'
      });

      const graphicUrl = wmsSource.getLegendUrl(resolution);

      // console.log('graphicUrl',graphicUrl)
      const img = document.getElementById('legend-content');

      img.src = graphicUrl;
    },
    // 探针功能
    getFeatureInfo () {
      const { init,tpl = defaultTpl} = this.params;
      const wmsSource = new ImageWMS({
        url: 'http://localhost:7070/geoserver/nmg/wms',
        params: {'LAYERS': 'nmg:test'},
        ratio: 1,
        serverType: 'geoserver'
      });

      const view = new View({
        projection: tpl.projection || projection,
        center: tpl?.content?.map?.options?.center || center,
        zoom: tpl?.content?.map?.options?.zoom || zoom,
        extent: tpl?.content?.map?.options?.extent,
        showFullExtent: false
      });

      this.olMap.map.on('singleclick', function (evt) {
        // document.getElementById('info').innerHTML = '';
        const viewResolution = /** @type {number} */ (view.getResolution());
        const url = wmsSource.getFeatureInfoUrl(
            evt.coordinate,
            viewResolution,
            'EPSG:3857',
            {'INFO_FORMAT': 'text/html'}
        );
        if (url) {
          axios.get(url).then((res)=>{
            console.log(res)
          })
          // fetch(url)
          //     .then((response) => response.text())
          //     .then((html) => {
          //       // document.getElementById('info').innerHTML = html;
          //       console.log(html)
          //     });
        }
      });

      // this.olMap.map.on('pointermove', function (evt) {
      //   if (evt.dragging) {
      //     return;
      //   }
      //   const data = this.olMap.forEachFeatureAtPixel()
      //   map.wmsLayer.getData(evt.pixel);
      //   const hit = data && data[3] > 0; // transparent pixels have zero for data[3]
      //   this.olMap.getTargetElement().style.cursor = hit ? 'pointer' : '';
      // });
    },
  }

}
</script>

<style lang="scss">
  .map-widget{
    width: 100%;
    height: 100%;

    .map-container{
      width: 100%;
      height: 100%;
    }
  }
  /* 图例 */
  .legend {
    position: fixed;
    bottom: 1%;
    left: 21%;
    width: 2.2rem;
    border-radius: 0.08rem;
    //background: #fff;

    #legend-content {
      padding: 0 0.1rem;
    }
  }
</style>