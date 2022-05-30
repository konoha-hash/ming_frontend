/*
 * @Author: 王磊
 * @Date: 2021-01-29 14:38:43
 * @LastEditors: 王佳宾
 * @LastEditTime: 2021-10-29 17:46:42
 * @Description: openlayers请求wms服务
 * @FilePath: \src\utils\OLMap\OLWMS.js
 */
import TileWMS from 'ol/source/ImageWMS';
import TileLayer from 'ol/layer/Image';
// import TileWMS from 'ol/source/TileWMS';
// import TileLayer from 'ol/layer/Tile';
import axios from 'axios';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

import Overlay from 'ol/Overlay';
import * as LayerUtils from './Layers/index';

class OLWMS {
  constructor (map) {
    this.map = map;
    this.WMSLayers = new Map(); // WMS服务图层
    this.WMSSource = null;
    this.WMSLayer = null;
    this.polygonOverlay = null;
    this.infoArray = {};

    this.filterWmsLayers = []; // 只存三个图层  多余的删除掉
    this.filterLength = 1; // 控制地图保存几个图层
  }

  /**
   * @description 处理issue，从202012111200格式化成2020-10-11T00:00:00.004Z
   * @param {String} cycle 周期编码
   * @param {*} issue 时间 202012111200
   */
  static getGeoTime (cycle, issue) {
    const copyIssue = issue;

    let cycleCode;

    switch (cycle) {
    case 'normal':
      cycleCode = '000';
      break;
    case 'COOH':
      cycleCode = '001';
      break;
    case 'COOD':
      cycleCode = '002';
      break;
    case 'COAW':
      cycleCode = '003';
      break;
    case 'COTD':
      cycleCode = '004';
      break;
    case 'COAM':
      cycleCode = '005';
      break;
    case 'COAQ':
      cycleCode = '006';
      break;
    case 'COAY':
      cycleCode = '007';
      break;
    case 'COED':
      cycleCode = '008';
      break;
    default:
      return '000';
    }

    const year = copyIssue.substr(0, 4) || '0000';
    const month = copyIssue.substr(4, 2) || '00';
    const day = copyIssue.substr(6, 2) || '00';
    const hour = copyIssue.substr(8, 2) || '00';
    const minute = copyIssue.substr(10, 2) || '00';
    const second = copyIssue.substr(12, 2) || '00';

    return `${year}-${month}-${day}T${hour}:${minute}:${second}.${cycleCode}Z`;
  }

  // 获取sld xml
  static getStyle (colorValue, mark) {
    if (!colorValue) {
      return '';
    }
    const colors = [];
    const { reMaps } = colorValue;

    reMaps.forEach((item) => {
      colors.push({
        color: item.color && OLWMS.to16(item.color),
        value: parseFloat(item.value),
        opacity: item.color && item.color[3]
      });
    });

    let colorsString = '';

    colors.forEach((item) => {
      // debugger;
      colorsString += `<ColorMapEntry color="${item.color}" quantity="${item.value}" opacity="${item.opacity}" />`;
    });

    const result = `<?xml version="1.0" encoding="UTF-8"?>
    <StyledLayerDescriptor
      xmlns="http://www.opengis.net/sld"
      xmlns:ogc="http://www.opengis.net/ogc"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.opengis.net/sld
      http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd"
      version="1.0.0"
    >
      <NamedLayer>
        <Name>${mark}</Name>
        <UserStyle>
          <Title>A raster style</Title>
          <FeatureTypeStyle>
            <Rule>
              <RasterSymbolizer>
                <Opacity>1.0</Opacity>
                <ColorMap type="intervals">
                  ${colorsString}
                </ColorMap>
              </RasterSymbolizer>
            </Rule>
          </FeatureTypeStyle>
        </UserStyle>
      </NamedLayer>
    </StyledLayerDescriptor>`;

    return result;
  }

  // rgb转16进制
  static to16 (color) {
    const r = parseInt(color[0], 10);
    const g = parseInt(color[1], 10);
    const b = parseInt(color[2], 10);
    // eslint-disable-next-line no-bitwise
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

    return hex;
  }

  // 增加栅格WMS图层
  addWMSLayer (options) {
    const {
      url, params = {}, layerParams = {}, visible
    } = options;
    const { layers } = params;

    this.WMSLayer = LayerUtils.createLayer(options);

    // 地图增加镶嵌数据集图层
    this.WMSLayers.set(layers, this.WMSLayer);
    this.map.addLayer(this.WMSLayer);

    // this.viewCenter();
    return this.WMSLayer;
  }

  /**
   * @description 发送wms服务，请求镶嵌数据集
   * @param {Object} params { time 时间, colorArr? , mark, cycle, click 是否可点击, max 地图存储的最大图层数，不传就是 +1 -1 }
   * @param {String} url geoserver地址
   */
  getMosaicDataset (params, url) {
    const {
      cycle, time, colorArr, mark, clip, click, max
    } = params;

    let wmsParams = {
      service: 'WMS',
      format: 'image/png',
      version: '1.1.0',
      transparent: true,
      time: OLWMS.getGeoTime(cycle, time)
    };

    if (colorArr) {
      wmsParams.sld_body = OLWMS.getStyle(colorArr, mark);
    } else {
      wmsParams.layers = mark;
    }

    this.WMSSource = new TileWMS({
      url,
      params: wmsParams
    });

    this.WMSLayer = new TileLayer({
      visible: true,
      source: this.WMSSource,
      zIndex: 998
    });

    if (click) {
      this.addSingLecClick(this.WMSLayer);
    }
    this.WMSLayer.set('name', mark);
    this.WMSLayers.set(mark, this.WMSLayer);
    this.filterWmsLayers.push(this.WMSLayer);
    // 地图增加镶嵌数据集图层
    this.map.addLayer(this.WMSLayer);
    // 如果大于filterLength 删除上一个 可控
    if (this.filterWmsLayers.length > (max || this.filterLength)) {
      this.map.removeLayer(this.filterWmsLayers[0]);
      this.filterWmsLayers.shift();
    }
    return this.WMSLayer;
  }

  // 移除栅格WMS图层
  removeWMSLayer (layers) {
    const WMSLayer = this.WMSLayers.get(layers);

    this.WMSLayers.delete(layers);
    this.map.removeLayer(WMSLayer);
    // 根据图层删除
    this.map.getLayers().forEach((layer) => {
      const layerType = layer?.get('name');

      if (layers === layerType) {
        this.map.removeLayer(layer);
      }
    });
  }

  // 视角居中
  viewCenter () {
    const view = this.map.getView();

    view.setCenter([96, 35.2]);
    view.setZoom(6.5);
  }

  /**
   * @param {Layer} layear 地图图层
   */
  addSingLecClick (layer) {
    layer.on('singleclick', (param) => {
      const { callback, event } = param;

      // eslint-disable-next-line no-unused-expressions
      // callback && callback('dddd');
      const view = this.map.getView();
      const viewResolution = view.getResolution();
      const projection = view.getProjection();
      const name = layer.get('name');

      const url1 = layer.getSource().getFeatureInfoUrl(event.coordinate, viewResolution, projection, {
        INFO_FORMAT: 'application/json',
        QUERY_LAYERS: name
      });

      if (url1) {
        axios.get(url1).then((res) => {
          // eslint-disable-next-line no-unused-expressions
          callback && callback(res, event);
        });
      }
    });
  }

  /**
   * @description 增加自定义事件
   * @param {Function} callback 回调函数
   * @param {HTMLElement} overlayEle 自定义弹框的dom
   */
  addCustomEvent ({ callback, overlayEle }) {
    if (!this.polygonOverlay) {
      this.polygonOverlay = new Overlay({
        element: overlayEle,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        },
        positioning: 'top-center'
      });
      // 添加信息弹窗
      this.map.addOverlay(this.polygonOverlay);
      // 初始化置空
      this.polygonOverlay.setPosition(undefined);
    }
    this.map.on('singleclick', event => {
      // 点击事件是否命中feature
      const pixel = this.map.getEventPixel(event.originalEvent);
      const hit = this.map.hasFeatureAtPixel(pixel);

      if (hit) {
        this.map.forEachFeatureAtPixel(event.pixel, feature => {
          // 为移动到的feature发送自定义的singleclick消息
          feature.dispatchEvent({
            type: 'singleclick',
            event: event,
            ol: this.map,
            element: overlayEle,
            callback
          });
        });
      } else {
        this.WMSLayer.dispatchEvent({
          type: 'singleclick',
          event: event,
          ol: this.map,
          element: overlayEle,
          callback
        });
      }
    });
  }

  /**
   * @todo 废弃 用addCustomEvent
   * @description 添加探针事件
   * @param {HTMLElement} element 弹框的dom
   * @param {String} layerName 点击对应图层的名字
   * @param {Object} tpl tpl
   * @param {Function} callback 探针成功时的回调
   */
  addOverlay (element, layerName, tpl, callback) {
    this.polygonOverlay = new Overlay({
      element,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      },
      positioning: 'top-center'
    });
    // 添加信息弹窗
    this.map.addOverlay(this.polygonOverlay);
    // 初始化置空
    this.polygonOverlay.setPosition(undefined);

    this.map.on('click', (e) => {
      const view = this.map.getView();
      const viewResolution = view.getResolution();

      // 取到加的所有图层
      const layerList = this.map.getLayers().array_.filter(item => item.get('name').indexOf(layerName) > -1);

      if (!layerList.length) {
        return;
      }
      // 取到最后一项 最后一项是最新加载的图层
      const currentLayer = layerList[layerList.length - 1];
      const name = currentLayer.get('name');

      // 如果是对应的图层
      if (name && name.indexOf(layerName) > -1) {
        // 配置
        const { projection = 'EPSG:4326', geoserverWorkspace = 'ja' } = tpl;
        const url1 = currentLayer.getSource().getFeatureInfoUrl(e.coordinate, viewResolution, projection, {
          INFO_FORMAT: 'application/json',
          QUERY_LAYERS: name.startsWith(geoserverWorkspace) ? name : `${geoserverWorkspace}:${name}`
        });

        if (url1) {
          axios.get(url1).then((res) => {
            // eslint-disable-next-line no-unused-expressions
            callback && callback(res, e);
          });
        }
      }
    });
  }


  // 增加信息弹窗
  addPolygonOverlay (element, layers) {
    this.polygonOverlay = new Overlay({
      element: document.getElementById(element),
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      },
      positioning: 'top-right'
    });
    this.map.addOverlay(this.polygonOverlay);
    this.polygonOverlay.setPosition(undefined);

    // 地图添加click事件
    this.probeClick = this.map.on('click', (evt) => {
      const view = this.map.getView();
      const viewResolution = view.getResolution();
      const url1 = this.WMSSource.getFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:4326', {
        INFO_FORMAT: 'application/json',
        QUERY_LAYERS: layers
      });

      if (url1) {
        axios.get(url1).then((res) => {
          if (res.data?.features[0]?.properties?.CODE) {
            document.getElementById('ol-popup').style.display = 'block';
            this.infoArray.name = `${res.data.features[0].properties.HHMC}(${res.data.features[0].properties.HDMC})`;
            if (this.polygonOverlay) {
              this.polygonOverlay.setPosition(evt.coordinate);
            }
          } else {
            // eslint-disable-next-line no-unused-expressions
            this.polygonOverlay?.setPosition(undefined);
          }
        });
      } else {
        // eslint-disable-next-line no-undefined
        // this.polygonOverlay?.setPosition(undefined);
      }
    });
  }

  removeLayerByName (name) {
    //name 默认选取后一段(ja:aa,则name为aa)
    const tempNameArr = name.split(':');
    const realName = tempNameArr[tempNameArr.length - 1];

    this.map.getLayers().forEach((ele) => {
      const layerName = ele?.get('name');

      if (layerName === realName || layerName === name) {
        this.map.removeLayer(ele);
        if (this.WMSLayers.has(realName)) {
          this.WMSLayers.delete(realName);
        }
        if (this.WMSLayers.has(name)) {
          this.WMSLayers.delete(name);
        }
      }
    });
  }

  // 根据featureId视角聚焦
  zoomToViewByFeature (condition, layerId) {
    let wfsUrl;

    if (condition) {
      wfsUrl = `${process.env.VUE_APP_GEOSERVER_IP}?service=WFS&version=2.0.0&request=GetFeature&typeNames=${layerId}&cql_filter=${condition}&count=50&outputFormat=application/json`;
    } else {
      wfsUrl = `${process.env.VUE_APP_GEOSERVER_IP}?service=WFS&version=2.0.0&request=GetFeature&typeNames=${layerId}&count=50&outputFormat=application/json`;
    }

    axios.get(wfsUrl).then((res) => {
      if (res.status >= 200 && res.status < 300) {
        let vecSource = new VectorSource();
        const features = new GeoJSON().readFeatures(res.data);

        vecSource.addFeatures(features);
        this.map
          .getView()
          .fit(vecSource.getExtent(), { size: this.map.getSize(), padding: [200, 500, 200, 400] });
      }
    });
  }
}

export default OLWMS;
