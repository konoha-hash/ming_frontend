import Vector from 'ol/source/Vector';
import axios from 'axios';



function Getattribute(olMap, oLMarkPoints, showtract, popInfos, backupFeature, backupStyle, mapTpl, callback){
  console.log('执行了import方法，尚未执行click');


  olMap.addEvent('click', (e) => {
    console.log('执行了click事件');
    // 点击事件是否命中feature
    const pixel = olMap.map.getEventPixel(e.originalEvent);

    const hit = olMap.map.hasFeatureAtPixel(pixel);

    if (hit) {
      const feature1 = olMap.map.forEachFeatureAtPixel(e.pixel, (feature) => {
        const { values_ } = feature;
        const { attribute } = values_;
        const { type } = attribute;

        console.log('type的值');
        console.log(type);
        // 更新弹窗信息popInfos
        // （1）更新title/infos
        if (type === 'event') {
          // eslint-disable-next-line no-param-reassign
          showtract = false;
          // eslint-disable-next-line no-param-reassign
          popInfos.title = '事件信息';
          // eslint-disable-next-line no-param-reassign
          popInfos.infos = [
            {
              label: '事件类别：',
              value: attribute.typeVo.name
            },
            {
              label: '事件来源：',
              value: attribute.sourceVo.name
            },
            {
              label: '所属河段：',
              value: attribute.reaName
            },
            {
              label: '所属区域：',
              value: attribute.address
            }
          ];
        } else if (type === 'camera') {
          // eslint-disable-next-line no-param-reassign
          showtract = false;
          // eslint-disable-next-line no-param-reassign
          popInfos.title = '监控点';
          // eslint-disable-next-line no-param-reassign
          popInfos.infos = [
            {
              label: '所在乡镇：',
              value: attribute['所在乡镇']
            },
            {
              label: '地点名称：',
              value: attribute['地点名称']
            },
            {
              label: '设备编号：',
              value: attribute['设备编号']
            }
          ];
        } else if (type === 'inspector') {
          // eslint-disable-next-line no-param-reassign
          showtract = true;
          // eslint-disable-next-line no-param-reassign
          popInfos.title = '巡查员信息';
          // eslint-disable-next-line no-param-reassign
          popInfos.infos = [
            {
              label: '巡查员名称：',
              value: attribute.name
            },
            {
              label: '巡查员编号：',
              value: attribute.id
            },
            {
              label: '联系方式：',
              value: attribute.mobilePhone
            },
            {
              label: '地址：',
              value: attribute.address
            }
          ];
          getInspectorPointInfo(popInfos.infos);
        } else if (type === 'reservoirInfo') {
          // eslint-disable-next-line no-param-reassign
          showtract = false;
          // eslint-disable-next-line no-param-reassign
          popInfos.title = '水库';
          // eslint-disable-next-line no-param-reassign
          popInfos.infos = [
            {
              label: '名称：',
              value: attribute.name
            },
            {
              label: '库容：',
              value: attribute.storage,
              unit: '万m³'
            },
            {
              label: '面积：',
              value: attribute.area,
              unit: 'km²'
            }
          ];
        } else if (type === 'waterSource') {
          // eslint-disable-next-line no-param-reassign
          showtract = false;
          // eslint-disable-next-line no-param-reassign
          popInfos.title = '饮用水源地';
          // eslint-disable-next-line no-param-reassign
          popInfos.infos = [
            {
              label: '名称：',
              value: attribute.name
            }
          ];
        } else if (type === 'breedEnterprises') {
          // eslint-disable-next-line no-param-reassign
          showtract = false;
          // eslint-disable-next-line no-param-reassign
          popInfos.title = '养殖企业分布';
          // eslint-disable-next-line no-param-reassign
          popInfos.infos = [
            {
              label: '名称：',
              value: attribute.name
            }
          ];
        } else if (type === 'polluteEnterprises') {
          // eslint-disable-next-line no-param-reassign
          showtract = false;
          // eslint-disable-next-line no-param-reassign
          popInfos.title = '污染企业分布';
          // eslint-disable-next-line no-param-reassign
          popInfos.infos = [
            {
              label: '名称：',
              value: attribute.name
            }
          ];
        } else if (type === 'envMonitorPoin') {
          // eslint-disable-next-line no-param-reassign
          showtract = false;
          // eslint-disable-next-line no-param-reassign
          popInfos.title = '水环境监测点';
          // eslint-disable-next-line no-param-reassign
          popInfos.infos = [
            {
              label: '站名：',
              value: attribute.name
            },
            {
              label: '地址：',
              value: attribute.stationAddress
            }
          ];
        } else if (type === 'riverPollution') {
          // eslint-disable-next-line no-param-reassign
          showtract = false;
          // eslint-disable-next-line no-param-reassign
          popInfos.title = '入河排污口';
          // eslint-disable-next-line no-param-reassign
          popInfos.infos = [
            {
              label: '名称：',
              value: attribute.name
            },
            {
              label: '位置：',
              value: attribute.position
            },
            {
              label: '污染物：',
              value: attribute.pollute
            },
            {
              label: '污水处理工厂：',
              value: attribute.factory
            }
          ];
        }

        console.log(showtract);
        console.log(popInfos.title,popInfos.infos);

        // （2）图标高亮选择
        // 存储/恢复原始图标信息
        if (backupFeature) {
          backupFeature.setStyle(backupStyle);
        }
        // eslint-disable-next-line no-param-reassign
        backupFeature = feature;
        // eslint-disable-next-line no-param-reassign
        backupStyle = feature.getStyle();
        // 根据要素feature定位所在的图层
        let layerName = '';

        olMap.map.getLayers().forEach((ele) => {
          const source = ele.getSource();

          if (source instanceof Vector) {
            source.getFeatures().forEach((item) => {
              if (item === feature) {
                // 图层名
                layerName = ele?.get('name');
              }
            });
          }
        });
        // 饮用水源地
        if (layerName === 'waterSource') {
          // eslint-disable-next-line no-param-reassign
          feature.setStyle(selectIconYingyongshuiStyle);
        } else if (layerName === 'riverPollution') {
          // 入河排污口
          // eslint-disable-next-line no-param-reassign
          feature.setStyle(selectIconRuheStyle);
        } else if (layerName === 'reservoirInfo') {
          // 水库信息
          // eslint-disable-next-line no-param-reassign
          feature.setStyle(selectIconShuikuStyle);
        } else if (layerName === 'polluteEnterprises') {
          // 污染企业分布
          // eslint-disable-next-line no-param-reassign
          feature.setStyle(selectIconWurangqiyeStyle);
        } else if (layerName === 'breedEnterprises') {
          // 养殖企业分布
          // eslint-disable-next-line no-param-reassign
          feature.setStyle(selectIconYangzhiqiyeStyle);
        } else if (layerName === 'envMonitorPoin') {
          // 水环境监测点
          // eslint-disable-next-line no-param-reassign
          feature.setStyle(selectIconShuihuanjinStyle);
        }
        // 图标高亮选择
        const position = feature.getGeometry().getCoordinates();

        console.log('有position吗？');
        console.log(position);
        oLMarkPoints.pointOverlay.setPosition(position);
        return feature;
      });

      // if (!feature1) {
      //   this.oLMarkPoints.pointOverlay.setPosition(null);
      //   if (this.backupFeature) {
      //     this.backupFeature.setStyle(this.backupStyle);
      //   }
      // }
    } else {
      oLMarkPoints.pointOverlay.setPosition(null);
      if (backupFeature) {
        backupFeature.setStyle(backupStyle);
      }

      // 未命中fearue，则判断是否命中wms图层
      // 检索是否命中的wms图层
      const view = olMap.map.getView();
      const viewResolution = view.getResolution();

      olMap.map.forEachLayerAtPixel(e.pixel, (layer) => {
        const name = layer.get('name');

        // 河湖
        if (name === 'water_source') {
          const { projection, geoserverWorkspace = 'ja' } = mapTpl; // 'EPSG:4326'

          const url1 = layer.getSource().getFeatureInfoUrl(e.coordinate, viewResolution, projection, {
            INFO_FORMAT: 'application/json',
            QUERY_LAYERS: `${geoserverWorkspace}:${name}`
          });

          if (url1) {
            axios.get(url1).then((res) => {
              if (res.data?.features[0]?.properties?.LXDM) {
                const { properties } = res.data.features[0];

                // eslint-disable-next-line no-param-reassign
                popInfos.title = properties.HHMC;
                // eslint-disable-next-line no-param-reassign
                popInfos.infos = [
                  {
                    label: '河段名称：',
                    value: properties.HDMC
                  },
                  {
                    label: '河湖名称：',
                    value: properties.HHMC
                  },
                  {
                    label: '类型：',
                    value: properties.LXMC
                  },
                  {
                    label: '负责人：',
                    value: properties['负责人']
                  },
                  {
                    label: '面积：',
                    value: Number.parseFloat(properties.Area).toFixed(4),
                    unit: 'km²'
                  }
                ];
                oLMarkPoints.pointOverlay.setPosition(e.coordinate);
              } else {
                oLMarkPoints.pointOverlay.setPosition(undefined);
              }
            });
          } else {
            oLMarkPoints.pointOverlay.setPosition(undefined);
          }
        } else if (name === 'water_SYAX') {
          const { projection, geoserverWorkspace = 'ja' } = mapTpl; // 'EPSG:4326'

          const url1 = layer.getSource().getFeatureInfoUrl(e.coordinate, viewResolution, projection, {
            INFO_FORMAT: 'application/json',
            QUERY_LAYERS: `${geoserverWorkspace}:${name}`
          });

          if (url1) {
            axios.get(url1).then((res) => {
              if (res.data?.features[0]?.properties?.LXDM) {
                const { properties } = res.data.features[0];

                // eslint-disable-next-line no-param-reassign
                popInfos.title = properties.HHMC;
                // eslint-disable-next-line no-param-reassign
                popInfos.infos = [
                  {
                    label: '河段名称：',
                    value: properties.HDMC
                  },
                  {
                    label: '河湖名称：',
                    value: properties.HHMC
                  },
                  {
                    label: '类型：',
                    value: properties.LXMC
                  },
                  {
                    label: '负责人：',
                    value: properties['负责人']
                  },
                  {
                    label: '面积：',
                    value: Number.parseFloat(properties.Area).toFixed(4),
                    unit: 'km²'
                  }
                ];
                oLMarkPoints.pointOverlay.setPosition(e.coordinate);
              } else {
                oLMarkPoints.pointOverlay.setPosition(undefined);
              }
            });
          } else {
            oLMarkPoints.pointOverlay.setPosition(undefined);
          }
        } else if (name === 'gw_line') {
          const { projection, geoserverWorkspace = 'ja' } = mapTpl; // 'EPSG:4326'

          const url1 = layer.getSource().getFeatureInfoUrl(e.coordinate, viewResolution, projection, {
            INFO_FORMAT: 'application/json',
            QUERY_LAYERS: `${geoserverWorkspace}:${name}`
          });

          if (url1) {
            axios.get(url1).then((res) => {
              if (res.data?.features[0]?.properties?.Layer) {
                const { properties } = res.data.features[0];

                // eslint-disable-next-line no-param-reassign
                popInfos.title = properties.Layer;
                // eslint-disable-next-line no-param-reassign
                popInfos.infos = [
                  {
                    label: '管线类型：',
                    value: properties.Layer
                  },
                  {
                    label: '管线宽度：',
                    value: properties.LineWt,
                    unit: '厘米'
                  }
                  // {
                  //   label: '高度：',
                  //   value: properties.Elevatioon,
                  //   unit: '米'
                  // }
                ];
                oLMarkPoints.pointOverlay.setPosition(e.coordinate);
              } else {
                oLMarkPoints.pointOverlay.setPosition(undefined);
              }
            });
          } else {
            oLMarkPoints.pointOverlay.setPosition(undefined);
          }
        }
      });
    }

    callback(showtract, popInfos);
    console.log(showtract, popInfos);
    return showtract, popInfos;
  });
}

export default Getattribute;
