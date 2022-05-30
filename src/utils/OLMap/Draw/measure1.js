import Draw from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { LineString, Polygon } from 'ol/geom';
import Overlay from 'ol/Overlay';
import {
  Circle as CircleStyle, Fill, Stroke, Style
} from 'ol/style';
import { getArea, getLength } from 'ol/sphere';
import { unByKey } from 'ol/Observable';

// var map = null;
// var draw = null;
var sketch = null;
var helpTooltipElement = null;
var helpTooltip = null;
var measureTooltipElement = null;
var measureTooltip = null;
var continuePolygonMsg = '双击结束绘制多边形';
var continueLineMsg = '双击结束绘制线';
var count = 0;
var measureLayers = [];
var measureTooltips = [];
var currentType = 'length';

function pointerMoveHandler(evt){
  // if (evt.dragging) {
  //   return;
  // }
  /** @type {string} */
  let helpMsg = '请点击开始绘制';

  if (sketch) {
    const geom = sketch.getGeometry();

    if (geom instanceof Polygon) {
      helpMsg = continuePolygonMsg;
    } else if (geom instanceof LineString) {
      helpMsg = continueLineMsg;
    }
  }

  helpTooltipElement.innerHTML = helpMsg;
  helpTooltip.setPosition(evt.coordinate);

  helpTooltipElement.classList.remove('hidden');
}

// 创建提示tips
function createHelpTooltip (map) {
  if (helpTooltipElement) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  }
  helpTooltipElement = document.createElement('div');
  helpTooltipElement.className = 'ol-tooltip hidden';
  helpTooltip = new Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: 'center-left'
  });
  map.addOverlay(helpTooltip);
}

// 创建测量距离tips
function createMeasureTooltip (map) {
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement('div');
  measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
  measureTooltip = new Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: 'bottom-center',
    id: count
  });
  measureTooltips.push(measureTooltip);
  map.addOverlay(measureTooltip);
}

// 计算长度
function formatLength (line,map){
  const sourceProj = map.getView().getProjection();
  const length = getLength(line, {
    radius: 6371008.8,
    projection: sourceProj
  });

  let output;

  if (length > 100) {
    output = `${Math.round((length / 1000) * 100) / 100} km`;
  } else {
    output = `${Math.round(length * 100) / 100} m`;
  }
  return output;
}

// 计算面积
function formatArea (polygon,map) {
  const sourceProj = map.getView().getProjection();
  const area = getArea(polygon, {
    radius: 6371008.8,
    projection: sourceProj
  });

  let output;

  if (area > 10000) {
    output = `${Math.round((area / 1000000) * 100) / 100} km<sup>2</sup>`;
  } else {
    output = `${Math.round(area * 100) / 100} m<sup>2</sup>`;
  }
  return output;
}

// 新建删除按钮
function newPopupCloser () {
  const popupcloser = document.createElement('span');

  popupcloser.setAttribute('data-count', count);
  popupcloser.innerHTML = `<svg
      t="1610604227134"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="3116"
      width="15"
      height="15"
    >
      <path
        d="M799.2 874.4c0 34.4-28 62.4-62.368 62.4H287.2a62.496 62.496 0 0 1-62.4-62.4V212h574.4v662.4zM349.6 100c0-7.2 5.6-12.8 12.8-12.8h300c7.2 0 12.768 5.6 12.768 12.8v37.6H349.6V100z m636.8 37.6H749.6V100c0-48-39.2-87.2-87.2-87.2h-300a87.392 87.392 0 0 0-87.2 87.2v37.6H37.6C16.8 137.6 0 154.4 0 175.2s16.8 37.6 37.6 37.6h112v661.6A137.6 137.6 0 0 0 287.2 1012h449.6a137.6 137.6 0 0 0 137.6-137.6V212h112c20.8 0 37.6-16.8 37.6-37.6s-16.8-36.8-37.6-36.8zM512 824c20.8 0 37.6-16.8 37.6-37.6v-400c0-20.8-16.768-37.6-37.6-37.6-20.8 0-37.6 16.8-37.6 37.6v400c0 20.8 16.8 37.6 37.6 37.6m-175.2 0c20.8 0 37.6-16.8 37.6-37.6v-400c0-20.8-16.8-37.6-37.6-37.6s-37.6 16.8-37.6 37.6v400c0.8 20.8 17.6 37.6 37.6 37.6m350.4 0c20.8 0 37.632-16.8 37.632-37.6v-400c0-20.8-16.8-37.6-37.632-37.6-20.768 0-37.6 16.8-37.6 37.6v400c0 20.8 16.8 37.6 37.6 37.6"
        p-id="3117"
      ></path>
    </svg>`;
  popupcloser.classList.add('ol-popup-closer');
  return popupcloser;
}

// 开始测量距离或者面积
function addInteraction (value,map) {
  currentType = value;

  count += 1;

  // eslint-disable-next-line no-use-before-define,no-shadow
  const pointerMoveHandler = map.on('pointermove', pointerMoveHandler);

  map.getViewport().addEventListener('mouseout', () => {
    helpTooltipElement.classList.add('hidden');
  });

  const type = value === 'area' ? 'Polygon' : 'LineString';

  const source = new VectorSource();
  const vector = new VectorLayer({
    source,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 2
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33'
        })
      })
    }),
    zIndex: 1000
  });

  // vector.id = this.count;
  vector.needClear = true;
  // this.measureLayers.push(vector);
  map.addLayer(vector);

  const draw = new Draw({
    source,
    type,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2
      }),
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.7)'
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        })
      })
    })
  });

  map.addInteraction(draw);

  createMeasureTooltip(map);
  createHelpTooltip(map);

  let listener;
  // 创建清空按钮
  const popupcloser = newPopupCloser(count);

  draw.on('drawstart', (evt) => {
    // set sketch
    sketch = evt.feature;

    let tooltipCoord = evt.coordinate;

    listener = sketch.getGeometry().on('change', (e) => {
      const geom = e.target;

      let output;

      if (geom instanceof Polygon) {
        output = formatArea(geom,map);
        tooltipCoord = geom.getInteriorPoint().getCoordinates();
      } else if (geom instanceof LineString) {
        output = formatLength(geom,map);
        tooltipCoord = geom.getLastCoordinate();
      }
      measureTooltipElement.innerHTML = `<span>${output}</span>`;
      measureTooltip.setPosition(tooltipCoord);
    });
  });

  draw.on('drawend', (res) => {
    const { feature } = res;

    console.log(`drawend的res${res}`);

    // let curFeature;
    // curFeature = feature;
    measureTooltipElement.appendChild(popupcloser);
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
    measureTooltip.setOffset([0, -7]);
    // eslint-disable-next-line no-use-before-define
    removeInteraction(map);
    unByKey(listener);
    unByKey(pointerMoveHandler);
    addInteraction(currentType);
  });

  // 点击删除按钮删除对应测量内容
  popupcloser.onclick = () => {
    measureTooltip = null;
    // eslint-disable-next-line no-shadow
    const count = popupcloser.getAttribute('data-count');
    const overLays = map.getOverlays().getArray();
    const layers = map.getLayers().getArray();

    overLays.forEach((item) => {
      if (item.id === Number(count)) {
        map.removeOverlay(item);
      }
    });

    layers.forEach((item) => {
      if (item.id === Number(count)) {
        map.removeLayer(item);
      }
    });
  };
  //   this.measureTooltip = null;
  //   // map.getOverlays().clear();
  //   // eslint-disable-next-line no-underscore-dangle
  //   const overlays = map.getOverlays().array_;
  //   for (let i = 1; i < overlays.length; i++) {
  //     const ids = overlays[i].id;
  //     if (ids === 1) {
  //       const curOverlay = map.getOverlayById(ids);
  //       map.removeOverlay(curOverlay);
  //     }
  //   }
  //   self.source.removeFeature(popupcloser.relateFeature);
  // };
}

// 移除测量距离或者面积
function removeInteraction (draw,map) {
  console.log('执行了removeInteraction');
  if (draw) {
    sketch = null;
    measureTooltipElement = null;
    map.removeInteraction(this.draw);
    helpTooltipElement.classList.add('hidden');
    map.removeOverlay(this.helpTooltip);
  }
}

// 清除所有测量图层
function removeAllMeasureLayers () {
  // 清除所有测量图层
  if (this.measureLayers.length) {
    this.measureLayers.forEach((item) => {
      this.map.removeLayer(item);
    });
  }

  // 清除所有测量tip
  if (this.measureTooltips.length) {
    this.measureTooltips.forEach((item) => {
      this.map.removeOverlay(item);
    });
  }
}


export {
  pointerMoveHandler, createHelpTooltip, createMeasureTooltip, formatLength, formatArea, newPopupCloser, addInteraction, removeInteraction, removeAllMeasureLayers
};
