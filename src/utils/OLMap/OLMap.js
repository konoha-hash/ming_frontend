/*
 * @Author: 王磊
 * @Date: 2020-12-29 09:54:32
 * @LastEditors: 王佳宾
 * @LastEditTime: 2021-10-13 17:44:50
 * @Description: 初始化openlayers地图和常用工具类
 * @FilePath: \src\utils\OLMap\OLMap.js
 */
import 'ol/ol.css';
import { Map, View } from 'ol';
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
import { defaults } from 'ol/control';
import { unByKey } from 'ol/Observable';
import Overlay from 'ol/Overlay';
import OLWMS from './OLWMS';
import * as layersUtils from '@/utils/OLMap/Layers/index';
import mapConfig from './mapConfig';
import defaultTpl from '../../../public/tpl/default.json';

const {
  target, projection, center, zoom, onlineTdtLayers
} = mapConfig;
const {
  vec, vecCva, img, imgCia
} = onlineTdtLayers;

class OLMap {
  constructor (props = {}) {
    const { init, tpl = defaultTpl } = props;

    if (init) {
      this.map = null;
      this.viewer = null;
      this.layers = [];
      this.baseLayers = [];
      this.events = {};
      this.pointOverlay = null;
      this.initMap(tpl);
      OLMap.instance = this;
    } else if (typeof OLMap.instance === 'object') {
      return OLMap.instance;
    }
    // this.map = null;
    // this.layers = [];
    // this.events = {};
    // this.pointOverlay = null;
    // this.initMap(tpl);

    return this;
  }

  // get map (){
  //   return this.map;
  // }

  // set map (map){
  //   this.map = map;
  // }

  // 初始化地图
  initMap (tpl = {}) {

    const olView = new View({
      projection: tpl.projection || projection,
      center: tpl?.content?.map?.options?.center || center,
      zoom: tpl?.content?.map?.options?.zoom || zoom,
      extent: tpl?.content?.map?.options?.extent,
      showFullExtent: false
    });

    this.viewer = olView;

    const baseLayersOption = tpl?.content?.map?.baseLayers;
    // const baseLayers = [];

    this.map = new Map({
      layers: [],
      target: tpl?.target || target,
      view: olView,
      controls: defaults({
        attribution: false,
        rotate: false,
        zoom: false
      })
    });

    baseLayersOption.forEach((item) => {
      this.baseLayers.push(this.createLayer(item));
    });
    // this.switchBaseMap();

    this.map.on('pointermove', (evt) => {
      this.map.getTargetElement().style.cursor = this.map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
    });
  }

  addLayer = (item) => {
    this.layers.push(this.createLayer(item));
  };

  // removeLayer = (item) => {
  //   // debugger;
  //   // this.layers.forEach((value) => {
  //   //   if (value?.values_?.name === item?.name) {
  //   //     this.deleteLayer(item?.type,value);
  //   //   }
  //   // });
  // }

  createLayer = (item) => {
    const {
      name, type, url, alias,visible = true, index, group
    } = item;

    let layer;

    let oLWMS;

    switch (type) {
    case 'tms':
      layer = new TileLayer({
        source: new XYZ({
          title: alias,
          url: url,
          maxZoom: 16
        }),
        zIndex: index === null ? 0: index,
        visible: visible,
        className: name
      });
      layer.set('name', name);
      layer.set('group', group);
      this.map.addLayer(layer);
      return layer;
    case 'wms':
      // 加载矢量边界
      oLWMS = new OLWMS(this.map);

      layer = oLWMS.addWMSLayer({
        ...item,
        url: item?.url === '' ? process.env.VUE_APP_GEOSERVER_IP : item?.url,
        params: {
          layers: item?.name
        }
      });
      oLWMS.WMSLayers.set('name', name);

      return layer;
    default:
      break;
    }
  };

  removeLayer = (item) => {
    let num = 0;

    switch (item?.type) {
    case 'wms':
      this.map.getLayers().forEach((layer) => {
        const layerType = layer?.get('name');

        if (item?.name === layerType) {
          num++;
        }
      });
      while (num) {
        let count = 0;

        // eslint-disable-next-line no-loop-func
        this.map.getLayers().forEach((layer) => {
          const layerType = layer?.get('name');

          if (item?.name === layerType) {
            this.map.removeLayer(layer);
            num--;
            count++;
          }
        });
        if (count > 50) {
          break;
        }
      }

    default:
      break;
    }
  };

  displayLayers = (item) => {
    this.map.getLayers().forEach((layer) => {
      const layerType = layer?.get('name');

      if (layerType === item.type) {
        layer.setVisible(item.visible);
      }
    });
  };

  // 移除地图事件
  removeEvent (type) {
    unByKey(this.events[type]);
  }

  forEachFeatureAtPixel = (pixel, callback) => {
    this.map.forEachFeatureAtPixel(pixel, callback);
  };

  addPointOverlay (element) {
    this.pointOverlay = new Overlay({
      element,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    this.map.addOverlay(this.pointOverlay);
  }

  // 增加地图事件
  addEvent (type, fn) {
    const mapEvent = this.map.on(type, fn);

    this.events[type] = mapEvent;
  }

  // 地图切换
  switchBaseMap (options = {}) {
    // 默认加载矢量底图
    const { mapType = 'vec' } = options;

    layersUtils.showOrHideLayers(this.baseLayers, 'group', mapType);
    /*this.baseLayers.forEach((ele) => {
      const name = ele.get('name');

      if (mapType === 'vec') {
        if (name === 'vec_w' || name === 'cva_w') {
          ele.setVisible(true);
        } else if (name === 'img_w' || name === 'cia_w') {
          ele.setVisible(false);
        }
      } else if (mapType === 'img') {
        if (name === 'vec_w' || name === 'cva_w') {
          ele.setVisible(false);
        } else if (name === 'img_w' || name === 'cia_w') {
          ele.setVisible(true);
        }
      }
    });*/
  }

  // zoomout / zoomin
  zoomOutIn (type) {
    const view = this.map.getView();

    let currentZoom = view.getZoom();

    if (type === 'zoomIn') {
      view.setZoom(--currentZoom);
    } else {
      view.setZoom(++currentZoom);
    }
  }
}

export default OLMap;
