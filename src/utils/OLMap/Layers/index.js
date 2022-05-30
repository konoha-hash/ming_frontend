/*
 * @Author: 范有度
 * @Date: 2020-12-29 09:54:32
 * @LastEditors: 范有度
 * @LastEditTime: 2021-03-23 13:57:24
 * @Description: openlayers地图和常用工具类
 * @FilePath: \src\utils\OLMap\Layers\index.js
 */

import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {
  Icon, Style, Stroke, Fill
} from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import axios from 'axios';
import { toSize } from 'ol/size';
import Overlay from 'ol/Overlay';
import GeoJSON from 'ol/format/GeoJSON';

/**
 * 高亮设置
 * @type {string}
 */
const HIGH_LIGHT_LAYER='highLightLayer';
const HIGH_LIGHT_STYLE_FILL = {
  // color: 'rgba(103,222,248,0.8)'
  color: 'rgba(103,222,248,1)'
};
const HIGH_LIGHT_STYLE_STROKE = {
  color: '#FF0000',
  // lineDash: [20,10],
  width: 4
};

let highLightLayer = null;

let overlay = null;

/**
 * @description 处理issue，从202012111200格式化成2020-10-11T00:00:00.004Z
 * @param {String} cycle 周期编码
 * @param {*} issue 时间 202012111200
 */
function getGeoTime (cycle, issue) {
  const copyIssue = issue;

  let cycleCode;

  let result = null;

  if (copyIssue){
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

    result=`${year}-${month}-${day}T${hour}:${minute}:${second}.${cycleCode}Z`;
  }
  return result;
}

// 获取sld xml
function getStyle (colorValue, mark) {
  if (!colorValue) {
    return '';
  }
  const colors = [];
  const { reMaps } = colorValue;

  reMaps.forEach((item) => {
    colors.push({
      color: item.color,
      value: parseFloat(item.value),
      opacity: item.color && item.color[3]
    });
  });

  let colorsString = '';

  colors.forEach((item) => {
    colorsString += `<ColorMapEntry color="${item.color}" quantity="${item.value}" />`;
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

/**
 * 创建高亮展示图层
 * @param features 高亮展示的json
 * @param map 地图map
 */
function addHighLightLayer (features, map) {

  const highLightStyle = new Style({
    fill: new Fill(HIGH_LIGHT_STYLE_FILL),
    stroke: new Stroke(HIGH_LIGHT_STYLE_STROKE)
  });

  const highLightFeatures= new GeoJSON().readFeatures(features);

  map.getLayers().forEach((layer) => {
    const layerType = layer?.get('name');

    if (layerType === HIGH_LIGHT_LAYER) {
      highLightLayer = layer;
    }
  });

  if (!highLightLayer){
    highLightLayer = new VectorLayer({
      opacity: 0.8,
      source: new VectorSource(),
      zIndex: 100,
      style: highLightStyle
    });
    highLightLayer.set('name', HIGH_LIGHT_LAYER);
    map.addLayer(highLightLayer);
  } else {
    highLightLayer.getSource().clear();
  }
  highLightLayer.getSource().addFeatures(highLightFeatures);
}

// 隐藏弹窗
function hideOverlayAndHighLight () {
  if (overlay) {
    overlay.setPosition(undefined);
    // overlay = null;
  }
  if (highLightLayer) {
    highLightLayer.getSource().clear();
  }
}

/**
 * 生成wmslayers
 * @param option
 * @returns {*} 图层
 */
function creatWmsLayer (option) {
  const {
    name, type, url, alias, group, visible = true, index, cycle, time, colorArr
  } = option;

  let layer;
  const wmsParams = {
    SERVICE: 'WMS',
    FORMAT: 'image/png',
    VERSION: '1.1.1',
    transparent: true,
    LAYERS: name
  };

  if (colorArr){
    wmsParams.sld_body=getStyle(colorArr, name);
  }

  layer = new ImageLayer({
    visible: visible,
    zIndex: !index ? 10: index,
    source: new ImageWMS({
      url,
      params: wmsParams
    })
  });

  if (option.click === true){
    layer.on('singleclick',(param) => {
      hideOverlayAndHighLight();
      const viewResolution = param.ol.viewer?.getResolution();
      const projection = param.ol.viewer?.getProjection();
      const {element, callBack, target={} } = param;
      const {values_={}} = target;
      const {name: layerName} = values_;
      const url1 = layer.getSource().getFeatureInfoUrl(param.event.coordinate, viewResolution, projection, {
        INFO_FORMAT: 'application/json',
        QUERY_LAYERS: name
      });

      if (!overlay) {
        overlay = new Overlay({
          element,
          autoPan: true,
          autoPanAnimation: {
            duration: 250
          }
        });
      }

      if (url1) {
        axios.get(url1).then((res) => {
          if (res.data?.features?.length>0) {
            const { properties, geometry } = res.data.features[0];

            addHighLightLayer(res.data,param.ol.map);

            overlay.setPosition(param.event.coordinate);
            if (callBack){
              callBack(layerName,properties);
            }
            param.ol.map.addOverlay(overlay);

          } else {
            overlay.setPosition(undefined);
            if (highLightLayer) {
              highLightLayer.getSource().clear();
            }
          }

        });
      }
    });
  }
  layer.set('name', name);
  return layer;
}

// 增加标记点
function creatPointLayer (option = {}, opts = {}) {
  // 点图标大小,1=原始大小
  const { iconScale = 1 } = opts;
  const { src, name  } = option;

  let pointFeatures = [];

  option.data.forEach((item) => {
    // console.log(item);
    const lon = item.x ? item.x : item.lon;
    const lat = item.y ? item.y : item.lat;
    const coor = [lon, lat];

    // 定义feature点
    const iconFeature = new Feature({
      geometry: new Point(coor),
      attribute: {
        ...item
      }
    });

    // 给feature点设置样式
    iconFeature.setStyle(
      new Style({
        image: new Icon({
          src: src,
          scale: toSize(iconScale)
        })
      })
    );

    if (option.click === true){
      iconFeature.on('singleclick',param => {
        hideOverlayAndHighLight();
        const {element, callBack, target={} } = param;
        const {values_={}} = target;
        const {attribute} = values_;

        // if (!overlay){
        overlay = new Overlay({
          element,
          autoPan: true,
          autoPanAnimation: {
            duration: 250
          }
        });
        // }
        if (attribute){
          overlay.setPosition(param.event.coordinate);
          if (callBack){
            callBack(name,attribute);
          }
          param.ol.map.addOverlay(overlay);
        } else {
          overlay.setPosition(undefined);
        }
      });
    }

    pointFeatures.push(iconFeature);
  });

  const layer = new VectorLayer({
    source: new VectorSource(
      {
        features: pointFeatures
      }
    ),
    zIndex: 20
  });

  layer.set('name', name); // 添加图层类别标识
  return layer;
}

/**
 * 生成layer
 * @param option
 * @returns {*}
 */
function createLayer (option,opts) {
  const {
    name, type, url, alias, group, visible = true, index, cycle, time, colorArr
  } = option;

  let layer;

  switch (type) {
  case 'tms':
    layer = new TileLayer({
      source: new XYZ({
        title: alias,
        url: url
      }),
      zIndex: index === null ? 0: index,
      visible: visible,
      className: name
    });
    layer.set('name', name);
    layer.set('group', group);
    return layer;
  case 'wms':
    return creatWmsLayer(option);
  case 'pointVector':
    return creatPointLayer(option,opts);
  default:
    break;
  }
}

/**
 * 显示对应图层
 * @param layers 图层总数
 * @param field 对应字段
 * @param value 对应值
 */
function showLayers (layers,field='name',value) {
  layers.forEach((ele) => {
    const layer = ele.get(field);

    if (layer) {
      if (value === layer){
        ele.setVisible(true);
      }
    }
  });
}

/**
 * 隐藏对应图层
 * @param layers 图层总数
 * @param field 对应字段
 * @param value 对应值
 */
function hideLayers (layers,field='name',value) {
  layers.forEach((ele) => {
    const layer = ele.get(field);

    if (layer) {
      if (value === layer){
        ele.setVisible(false);
      }
    }
  });
}

/**
 * 显示或隐藏图层
 * @param layers 图层总数
 * @param field 对应字段
 * @param value 对应值
 * @param flag  对应值的显示隐藏
 */
function showOrHideLayers (layers,field='name',value,flag=true) {
  layers.forEach((ele) => {
    const layer = ele.get(field);

    if (layer) {
      if (value === layer){
        ele.setVisible(flag);
      } else {
        ele.setVisible(!flag);
      }
    }
  });
}

/**
 * 获取图层图层
 * @param layers 图层总数
 * @param value name值
 */
function getLayerByName (layers,value){
  let result=null;

  layers.forEach((ele) => {
    const layer = ele.get('name');

    if (layer) {
      if (value === layer){
        result = ele;
        return result;
      }
    }
  });
  return result;
}

export {
  createLayer, showLayers, hideLayers, showOrHideLayers, getLayerByName, hideOverlayAndHighLight
};
