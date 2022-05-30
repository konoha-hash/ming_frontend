import {Stroke, Style} from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
import {Vector as VectorLayer} from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import {getCenter} from 'ol/extent';

class Draw1 {
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
}
