<template>
  <section id="map-widget" class="map-widget">
    <div class="map-container" id="map-container">

    </div>
  </section>
</template>

<script>
import axios from "axios";
import { Vector as VectorSource} from 'ol/source';
import { Vector as VectorLayer} from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {FullScreen, defaults as defaultControls} from 'ol/control';
import Control from 'ol/control/Control';

export default {
  name: "Map",
  data() {
    return {
      mapTpl: null,
      olMap: null,
      olVector:null,
    }
  },
  props: {
    params: {
      type: Object,
      data() {
        return {
          areaGeoJson:null,
          oLMarkPoints:null,
          olMap:null,
        };
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.olMap = this.params.olMap;
      this.getArea();

      var myControl = new Control({})
      this.olMap.map.addControl()
    })
  },
  methods: {
    getolmap() {
      return this.olMap;
    },

    getArea(){
      axios.get("https://geo.datav.aliyun.com/areas_v3/bound/150000_full.json").then((res)=>{
        this.$message.success('基础地图加载成功！');
        this.areaGeoJson = res.data;

        const image = new CircleStyle({
          radius: 5,
          fill: null,
          stroke: new Stroke({color: 'red', width: 1}),
        });

        const styles = {
          'Point': new Style({
            image: image,
          }),
          'LineString': new Style({
            stroke: new Stroke({
              color: 'green',
              width: 1,
            }),
          }),
          'MultiLineString': new Style({
            stroke: new Stroke({
              color: 'green',
              width: 1,
            }),
          }),
          'MultiPoint': new Style({
            image: image,
          }),
          'MultiPolygon': new Style({
            stroke: new Stroke({
              color: 'yellow',
              width: 1,
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 0, 0.1)',
            }),
          }),
          'Polygon': new Style({
            stroke: new Stroke({
              color: 'blue',
              lineDash: [4],
              width: 3,
            }),
            fill: new Fill({
              color: 'rgba(0, 0, 255, 0.1)',
            }),
          }),
          'GeometryCollection': new Style({
            stroke: new Stroke({
              color: 'magenta',
              width: 2,
            }),
            fill: new Fill({
              color: 'magenta',
            }),
            image: new CircleStyle({
              radius: 10,
              fill: null,
              stroke: new Stroke({
                color: 'magenta',
              }),
            }),
          }),
          'Circle': new Style({
            stroke: new Stroke({
              color: 'red',
              width: 2,
            }),
            fill: new Fill({
              color: 'rgba(255,0,0,0.2)',
            }),
          }),
        };

        const styleFunction = function (feature){
          return styles[feature.getGeometry().getType()]
        }

        const vectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(this.areaGeoJson),
        });

        let vectorLayer = new VectorLayer({
          source: vectorSource,
          style: styleFunction
        })

        this.olMap.map.addLayer(vectorLayer);


      })
    }
  }
}
</script>

<style lang="scss" scoped>
.map-widget {
  width: 100%;
  height: 100%;

  .map-container {
    width: 100%;
    height: 100%;
  }
}
</style>