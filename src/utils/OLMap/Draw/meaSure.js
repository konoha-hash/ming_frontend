import 'ol/ol.css';
import Draw from 'ol/interaction/Draw';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import View from 'ol/View';
import {
  Circle as CircleStyle, Fill, Stroke, Style
} from 'ol/style';
import {LineString, Polygon} from 'ol/geom';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {getArea, getLength} from 'ol/sphere';
import {unByKey} from 'ol/Observable';


// eslint-disable-next-line import/prefer-default-export
export function measure (map,typeSelect) {
  console.log('执行了import方法');
  console.log(map);
  console.log(typeSelect);

  /**
 * Currently drawn feature.
 * @type {import("../src/ol/Feature.js").default}
 */
  let sketch;

  /**
 * The help tooltip element.
 * @type {HTMLElement}
 */
  let helpTooltipElement;

  /**
 * Overlay to show the help messages.
 * @type {Overlay}
 */
  let helpTooltip;

  /**
 * The measure tooltip element.
 * @type {HTMLElement}
 */
  let measureTooltipElement;

  /**
 * Overlay to show the measurement.
 * @type {Overlay}
 */
  let measureTooltip;

  /**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
  const continuePolygonMsg = 'Click to continue drawing the polygon';

  /**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
  const continueLineMsg = 'Click to continue drawing the line';

  /**
 * Handle pointer move.
 * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
 */
  const pointerMoveHandler = function (evt) {
    if (evt.dragging) {
      return;
    }
    /** @type {string} */
    let helpMsg = 'Click to start drawing';

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
  };

  /**
const map = new Map({
    layers: [raster, vector],
    target: 'map',
    view: new View({
        center: [-11000000, 4600000],
        zoom: 15,
    }),
});

 **/
  let count=0;

  let measureLayers = [];//所有测量图层

  let measureTooltips = []; // 所有测量tip图层

  map.on('pointermove', pointerMoveHandler);

  map.getViewport().addEventListener('mouseout', () => {
    helpTooltipElement.classList.add('hidden');
  });

  // const typeSelect = document.getElementById('type');

  let draw; // global so we can remove it later

  /**
 * Format length output.
 * @param {LineString} line The line.
 * @return {string} The formatted length.
 */
  const formatLength = function (line) {
    const sourceProj = map.getView().getProjection();
    const length = getLength(line, {
      radius: 6371008.8,
      projection: sourceProj
    });

    let output;

    if (length > 100) {
      // eslint-disable-next-line no-useless-concat
      output = `${Math.round((length / 1000) * 100) / 100} ` + `km`;
    } else {
      // eslint-disable-next-line no-useless-concat
      output = `${Math.round(length * 100) / 100} ` + `m`;
    }
    return output;
  };

  /**
 * Format area output.
 * @param {Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
  const formatArea = function (polygon) {
    const sourceProj = map.getView().getProjection();
    const area = getArea(polygon, {
      radius: 6371008.8,
      projection: sourceProj
    });

    let output;

    if (area > 10000) {
      // eslint-disable-next-line no-useless-concat
      output = `${Math.round((area / 1000000) * 100) / 100} ` + `km<sup>2</sup>`;
    } else {
      // eslint-disable-next-line no-useless-concat
      output = `${Math.round(area * 100) / 100} ` + `m<sup>2</sup>`;
    }
    return output;
  };

  // 新建删除按钮
  function newPopupCloser () {
    const popupcloser = document.createElement('span');

    popupcloser.setAttribute('data-count', count);
    console.log(`删除按钮的count${count}`);
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

  function addInteraction () {
    // eslint-disable-next-line eqeqeq
    const type = typeSelect == 'area' ? 'Polygon' : 'LineString';

    console.log(type);

    count += 1;

    console.log(`绘制的第${count}条线`);

    const source = new VectorSource();

    const vector = new VectorLayer({
      source: source,
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

    vector.id = count;
    vector.needClear = true;
    measureLayers.push(vector);

    map.addLayer(vector);

    draw = new Draw({
      source: source,
      type: type,
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

    // eslint-disable-next-line no-use-before-define
    createMeasureTooltip();
    // eslint-disable-next-line no-use-before-define
    createHelpTooltip();

    let listener;

    // 创建清空按钮
    const popupcloser = newPopupCloser();

    draw.on('drawstart', (evt) => {
      // set sketch
      sketch = evt.feature;

      /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
      let tooltipCoord = evt.coordinate;

      // eslint-disable-next-line no-shadow
      listener = sketch.getGeometry().on('change', (evt) => {
        const geom = evt.target;

        let output;

        if (geom instanceof Polygon) {
          output = formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof LineString) {
          output = formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        measureTooltipElement.innerHTML = `<span>${output}</span>`;
        measureTooltip.setPosition(tooltipCoord);
      });
    });

    draw.on('drawend', () => {
      measureTooltipElement.appendChild(popupcloser);
      measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
      measureTooltip.setOffset([0, -7]);
      // unset sketch
      sketch = null;
      // unset tooltip so that a new one can be created
      measureTooltipElement = null;
      // eslint-disable-next-line no-use-before-define
      createMeasureTooltip();

      // this.removeInteraction();
      unByKey(listener);
      unByKey(pointerMoveHandler);
      addInteraction();
    });

    // 点击删除按钮删除对应测量内容
    popupcloser.onclick = () => {
      const count1 = popupcloser.getAttribute('data-count');
      const overLays = map.getOverlays().getArray();
      const layers = map.getLayers().getArray();

      console.log('执行了删除按钮点击事件');
      overLays.forEach((item) => {
        if (item.id === Number(count1)) {
          map.removeOverlay(item);
        }
      });

      layers.forEach((item) => {
        if (item.id === Number(count1)) {
          map.removeLayer(item);
        }
      });
    };
  }

  /**
 * Creates a new help tooltip
 */
  function createHelpTooltip () {
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

  /**
 * Creates a new measure tooltip
 */
  function createMeasureTooltip () {
    if (measureTooltipElement) {
      measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    measureTooltip = new Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center',
      stopEvent: false,
      insertFirst: false
    });
    map.addOverlay(measureTooltip);
  }

  /**
 * Let user change the geometry type.
 */
  //eslint-disable-next-line no-param-reassign
  // typeSelect.onchange = function () {
  //   map.removeInteraction(draw);
  //   addInteraction();
  // };

  // 移除测量距离或者面积
  function removeInteraction () {
    console.log('执行了meaSure中的removeInteraction');
    if (draw) {
      sketch = null;
      measureTooltipElement = null;
      map.removeInteraction(draw);
      helpTooltipElement.classList.add('hidden');
      map.removeOverlay(helpTooltip);
    }
  }

  addInteraction();

}
