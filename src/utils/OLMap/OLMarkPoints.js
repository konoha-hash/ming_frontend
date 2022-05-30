/*
 * @Author: 王磊
 * @Date: 2021-03-18 16:16:31
 * @LastEditors: 王佳宾
 * @LastEditTime: 2021-10-29 15:46:08
 * @Description: openlayers mark点位
 * @FilePath: \src\utils\OLMap\OLMarkPoints.js
 */
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import VectorSource from 'ol/source/Vector';
import Overlay from 'ol/Overlay';
import {
  Icon, Style, Stroke, Fill
} from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import { unByKey } from 'ol/Observable';
import OLMap from '@/utils/OLMap/OLMap';
import { toSize } from 'ol/size';
import { gcj02towgs84 } from '@/utils/utils/transform';
import GeoJSON from 'ol/format/GeoJSON';
import { getCenter } from 'ol/extent';
import * as LayerUtils from './Layers/index';

class OLMarkPoints {
  constructor (param = {}) {
    const { map } = param;

    this.map = map || new OLMap();
    this.markPointsLayer = null;
    this.pointClick = null;
    this.pointOverlay = null;
    this.pointFeatures = [];
    this.geoLine = null;
    this.geoPolygon=null;
  }

  // 增加标记点
  add (markPoints = [], opts = {isLocation: false , zoom: 12}) {
    // 点图标大小,1=原始大小
    const { iconScale = 1, twinkel = false } = opts;

    if (markPoints.length >0) {
      const map = {
        type: 'pointVector',
        data: markPoints,
        src: markPoints[0]?.icon,
        name: markPoints[0]?.type,
        click: true
      };

      this.markPointsLayer = LayerUtils.createLayer(map,opts);
      this.markPointsLayer.set('name', markPoints[0]?.type); // 添加图层类别标识
    }

    this.map.map.addLayer(this.markPointsLayer);
    //图标闪烁
    if ( twinkel === true ){

      let flag=true;

      setInterval(()=>{
        flag=!flag;
        this.markPointsLayer.setVisible(flag);
      },500);
    }

    return this;
  }

  // 移除标记点
  remove () {
    if (this.markPointsLayer) {
      this.markPointsLayer
        .getSource()
        .getFeatures()
        .forEach((feature) => {
          this.markPointsLayer.getSource().removeFeature(feature);
        });
      this.pointFeatures = [];
      this.map.removeLayer(this.markPointsLayer);
      this.markPointsLayer = null;
    }
    // this.map.getLayers().forEach((layer) => {
    //   const layerType = layer?.get('name');
    //   console.log(layerType);
    //   if (layerType === val) {
    //     this.map.removeLayer(layer);
    //   } else {
    //     // this.oLWMS.removeWMSLayer(id);
    //   }
    // });
  }

  // 显示隐藏标记图层{type:"xxx",visible:true}
  displayLayers (item) {
    this.map.displayLayers(item);
  }

  // 删除标记图层
  removeLayerPoint (name) {
    this.map.map.getLayers().forEach((layer) => {
      const layerType = layer?.get('name');

      if (layerType === name) {
        this.map.map.removeLayer(layer);
      }
    });
  }

  // 删除标记图层
  removeLayer (name) {
    // this.map.map.getLayers().forEach((layer) => {
    //   const layerType = layer?.get('name');

    //   if (layerType === name) {
    //     this.map.map.removeLayer(layer);
    //   }
    // });
    let num = 0;

    this.map.map.getLayers().forEach((layer) => {
      const layerType = layer?.get('name');

      if (name === layerType) {
        num++;
      }
    });
    while (num) {
      let count = 0;

      // eslint-disable-next-line no-loop-func
      this.map.map.getLayers().forEach((layer) => {
        const layerType = layer?.get('name');

        if (name === layerType) {
          this.map.map.removeLayer(layer);
          num--;
          count++;
        }
      });
      if (count > 50) {
        break;
      }
    }
  }

  // 增加mark点弹出
  addPointOverlay (element) {
    this.pointOverlay = new Overlay({
      element,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    this.map.map.addOverlay(this.pointOverlay);
  }

  // 移除mark点弹出
  removePointOverlay () {
    this.map.map.removeOverlay(this.pointOverlay);
  }


  //添加geojson图层
  addGeoline (feature, location = {isLocation: false , zoom: 12}){

    const lineStyle = new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 3
      })

    });

    const lineFeature = new GeoJSON().readFeature(feature);


    this.map.map.getLayers()
      .forEach((layer) => {
        const layerType = layer?.get('name');

        if (layerType === 'lineLayer') {
          this.geoLine = layer;
        }
      });

    if (!this.geoLine) {

      this.geoLine = new VectorLayer({
        opacity: 0.8,
        source: new VectorSource(),
        zIndex: 100,
        style: lineStyle
      });

      this.geoLine.set('name', 'lineLayer');
      this.map.map.addLayer(this.geoLine);
    } else {
      this.geoLine.getSource()
        .clear();
    }
    this.geoLine.getSource()
      .addFeature(lineFeature);

    if (location.isLocation) {
      this.map.map.getView().setCenter(getCenter(lineFeature.getGeometry().getExtent()));
      this.map.map.getView().setZoom(location.zoom);
    }
  }

  addGeopolygon (feature, location = {isLocation: false , zoom: 12}){

    const polygonStyle = new Style({
      stroke: new Stroke({
        color: 'red',
        width: 2
      }),
      fill:new Fill({
        color: 'rgba(103,222,248,1)'
      })

    });

    const polygonFeature = new GeoJSON().readFeature(feature);

    this.map.map.getLayers()
      .forEach((layer) => {
        const layerType = layer?.get('name');

        //console.log(layerType);

        if (layerType === 'polygonLayer') {
          this.geoPolygon = layer;

        }
      });

    if (!this.geoPolygon) {

      this.geoPolygon = new VectorLayer({
        opacity: 0.8,
        source: new VectorSource(),
        zIndex: 100,
        style: polygonStyle
      });

      this.geoPolygon.set('name', 'polygonLayer');
      this.map.map.addLayer(this.geoPolygon);
    } else {
      this.geoPolygon.getSource()
        .clear();
    }
    this.geoPolygon.getSource()
      .addFeature(polygonFeature);

    if (location.isLocation) {
      this.map.map.getView().setCenter(getCenter(polygonFeature.getGeometry().getExtent()));
      this.map.map.getView().setZoom(location.zoom);
    }
  }


  // 加线
  addLine (markPoints = [], opts = {}) {
    const result = markPoints.slice(1, markPoints.length - 2);
    const arr = result.split('},');
    const geoObj = [];

    arr.forEach((ele) => {
      const item = ele;
      const itemObj = JSON.parse(`${item}}`);

      geoObj.push(itemObj);
    });

    // 点图标大小,1=原始大小
    const { iconScale = 1 } = opts;

    this.pointFeatures = [];
    const coorList = [];

    geoObj.forEach((item) => {
      const lon = item.x ? item.x : item.lng;
      const lat = item.y ? item.y : item.lat;

      const coor = gcj02towgs84(Number(lon), Number(lat));

      coorList.push(coor);
    });
    // 定义feature点
    const iconFeature = new Feature({
      type: 'lineStyle',
      geometry: new LineString(coorList)
      // attribute: {
      //   // ...item
      // }
    });

    // 给feature点设置样式
    iconFeature.setStyle(
      new Style({
        stroke: new Stroke({
          color: 'red',
          width: 2
        })
      })
    );

    this.pointFeatures.push(iconFeature);

    this.markPointsLayer = new VectorLayer({
      source: new VectorSource(),
      zIndex: 1002
    });

    this.markPointsLayer.getSource().addFeatures(this.pointFeatures);
    this.markPointsLayer.set('name', 'line'); // 添加图层类别标识
    this.map.map.addLayer(this.markPointsLayer);
    return this;
  }
}

export default OLMarkPoints;
