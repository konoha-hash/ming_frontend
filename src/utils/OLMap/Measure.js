/* eslint-disable max-len */
/*
 * @Author: 王磊
 * @Date: 2021-01-07 14:28:07
 * @LastEditors: 张仕山
 * @LastEditTime: 2021-08-17 11:41:55
 * @Description: 测距和侧面
 * @FilePath: \src\utils\OLMap\Measure.js
 */
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

class Measure {

  constructor (props) {
    const { map } = props;

    this.map = map;
    this.draw = null;
    this.sketch = null;
    this.helpTooltipElement = null;
    this.helpTooltip = null;
    this.measureTooltipElement = null;
    this.measureTooltip = null;
    this.continuePolygonMsg = '双击结束绘制多边形';
    this.continueLineMsg = '双击结束绘制线';
    this.count = 0;
    this.measureLayers = []; // 所有测量图层
    this.measureTooltips = []; // 所有测量tip图层
    this.currentType = 'length';
  }

  pointerMoveHandler = (evt) => {
    // if (evt.dragging) {
    //   return;
    // }
    /** @type {string} */
    let helpMsg = '请点击开始绘制';

    if (this.sketch) {
      const geom = this.sketch.getGeometry();

      if (geom instanceof Polygon) {
        helpMsg = this.continuePolygonMsg;
      } else if (geom instanceof LineString) {
        helpMsg = this.continueLineMsg;
      }
    }

    this.helpTooltipElement.innerHTML = helpMsg;
    this.helpTooltip.setPosition(evt.coordinate);

    this.helpTooltipElement.classList.remove('hidden');
  };

  // 创建提示tips
  createHelpTooltip () {
    if (this.helpTooltipElement) {
      this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
    }
    this.helpTooltipElement = document.createElement('div');
    this.helpTooltipElement.className = 'ol-tooltip hidden';
    this.helpTooltip = new Overlay({
      element: this.helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left'
    });
    this.map.addOverlay(this.helpTooltip);
  }

  // 创建测量距离tips
  createMeasureTooltip () {
    if (this.measureTooltipElement) {
      this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
    }
    this.measureTooltipElement = document.createElement('div');
    this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    this.measureTooltip = new Overlay({
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center',
      id: this.count
    });
    this.measureTooltips.push(this.measureTooltip);
    this.map.addOverlay(this.measureTooltip);
  }

  // 计算长度
  formatLength = (line) => {
    const sourceProj = this.map.getView().getProjection();
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
  };

  // 计算面积
  formatArea = (polygon) => {
    const sourceProj = this.map.getView().getProjection();
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
  };

  // 新建删除按钮
  newPopupCloser () {
    const popupcloser = document.createElement('span');

    popupcloser.setAttribute('data-count', this.count);
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
  addInteraction (value) {
    this.currentType = value;
    this.count += 1;
    const pointerMoveHandler = this.map.on('pointermove', this.pointerMoveHandler);

    this.map.getViewport().addEventListener('mouseout', () => {
      this.helpTooltipElement.classList.add('hidden');
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

    vector.id = this.count;
    vector.needClear = true;
    this.measureLayers.push(vector);
    this.map.addLayer(vector);

    this.draw = new Draw({
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
    this.map.addInteraction(this.draw);

    this.createMeasureTooltip();
    this.createHelpTooltip();

    let listener;
    // 创建清空按钮
    const popupcloser = this.newPopupCloser();

    this.draw.on('drawstart', (evt) => {
      // set sketch
      this.sketch = evt.feature;

      let tooltipCoord = evt.coordinate;

      listener = this.sketch.getGeometry().on('change', (e) => {
        const geom = e.target;

        let output;

        if (geom instanceof Polygon) {
          output = this.formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof LineString) {
          output = this.formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        this.measureTooltipElement.innerHTML = `<span>${output}</span>`;
        this.measureTooltip.setPosition(tooltipCoord);
      });
    });

    this.draw.on('drawend', (res) => {
      const { feature } = res;

      this.curFeature = feature;
      this.measureTooltipElement.appendChild(popupcloser);
      this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
      this.measureTooltip.setOffset([0, -7]);
      this.removeInteraction();
      unByKey(listener);
      unByKey(pointerMoveHandler);
      this.addInteraction(this.currentType);
    });

    // 点击删除按钮删除对应测量内容
    popupcloser.onclick = () => {
      this.measureTooltip = null;
      const count = popupcloser.getAttribute('data-count');
      const overLays = this.map.getOverlays().getArray();
      const layers = this.map.getLayers().getArray();

      overLays.forEach((item) => {
        if (item.id === Number(count)) {
          this.map.removeOverlay(item);
        }
      });

      layers.forEach((item) => {
        if (item.id === Number(count)) {
          this.map.removeLayer(item);
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
  removeInteraction () {
    if (this.draw) {
      this.sketch = null;
      this.measureTooltipElement = null;
      this.map.removeInteraction(this.draw);
      this.helpTooltipElement.classList.add('hidden');
      this.map.removeOverlay(this.helpTooltip);
    }
  }

  // 清除所有测量图层
  removeAllMeasureLayers () {
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
}

export default Measure;
