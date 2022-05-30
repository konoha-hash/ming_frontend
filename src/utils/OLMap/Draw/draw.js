import {LineString, Polygon} from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import {
  Circle as CircleStyle, Fill, Stroke, Style
} from 'ol/style';
import Draw from 'ol/interaction/Draw';
import {unByKey} from 'ol/Observable';



function pointerMoveHandler (evt) {
  console.log('执行力封装的 pointerMoveHandler');
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

  //this.helpTooltipElement.innerHTML = helpMsg;
  //this.helpTooltip.setPosition(evt.coordinate);

  //this.helpTooltipElement.classList.remove('hidden');
}

function drawMethod (value,map) {
  console.log('执行封装方法');

  this.map = map;
  this.currentType = value;
  this.count += 1;
  // eslint-disable-next-line no-shadow
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

  //绘制的tip
  /**
  this.createMeasureTooltip();
  this.createHelpTooltip();
   **/

  let listener;
  //创建清空菜单
  //   const popupcloser = this.newPopupCloser();

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
      //this.measureTooltipElement.innerHTML = `<span>${output}</span>`;
      //this.measureTooltip.setPosition(tooltipCoord);
    });
  });

  this.draw.on('drawend', (res) => {
    const { feature } = res;

    this.curFeature = feature;
    //this.measureTooltipElement.appendChild(popupcloser);
    //this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
    //this.measureTooltip.setOffset([0, -7]);
    this.removeInteraction();
    unByKey(listener);
    //unByKey(pointerMoveHandler);
    this.addInteraction(this.currentType);
  });
}

function hello(a) {

  console.log(`hello${a}`);
}

// eslint-disable-next-line import/prefer-default-export
export { drawMethod, hello};
