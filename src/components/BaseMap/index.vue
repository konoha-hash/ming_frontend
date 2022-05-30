<!--
 * @Author: 王磊
 * @Date: 2021-03-18 11:31:55
 * @LastEditors: 王佳宾
 * @LastEditTime: 2021-10-29 10:44:39
 * @Description: 地图组件
 * @FilePath: \src\components\BaseMap\index.vue
-->
<template>
  <section id="map-widget" class="map-widget">
    <div id="map-container" :class="['basemap', splitMapVisible && current === 'splitMap' ? 'split_map' : null]"></div>
    <div class="split_line" v-if="splitMapVisible"></div>
    <div id="map-split-container" class="split_map" v-show="splitMapVisible"></div>
    <div class="tools_class">
      <ul>
        <!-- 底图切换 -->
        <li :class="[current === 'switchBaseMap' ? 'active' : '']" v-if="baseMapToolVisible">
          <span title="底图切换" class="iconfont icona-huaban1fuben3" @click="handleClick('switchBaseMap')"></span>
          <div class="basemap_switch_container" v-if="current === 'switchBaseMap'">
            <div :class="mapType === 'vec' ? 'select-class' : null">
              <img :src="tdtStreetMap" @click="switchBaseMap({ mapType: 'vec' })" />
              <span>天地图街道</span>
            </div>
            <div :class="mapType === 'img' ? 'select-class' : null">
              <img :src="tdtImgMap" @click="switchBaseMap({ mapType: 'img' })" />
              <span>天地图影像</span>
            </div>
          </div>
        </li>
        <!-- 行政区域 -->
        <li :class="[current === 'administrativeRegion' ? 'active' : '']" v-if="adminRegionToolVisible">
          <span title="行政区域" class="iconfont icona-huaban1fuben4" @click="handleClick('administrativeRegion')"></span>
          <div v-if="Object.keys(adminRegionData).length > 0 && current === 'administrativeRegion'"
            class="region_container">
            <ul>
              <li v-for="item in adminRegionData.value" :key="item.value" @click="selectRegion(item)"
                :class="currentSelect === item.value ? 'select_class' : null">
                <span>{{item.value}}</span>
              </li>
            </ul>
          </div>
        </li>
        <!-- 双屏切换 -->
        <li @click="handleClick('splitMap')" :class="[current === 'splitMap' ? 'active' : '']"
          v-if="splitMapToolVisible">
          <span class="iconfont iconfenping-Splitscreen" title="双屏切换"></span>
        </li>
        <!-- 地图测量 -->
        <li :class="[current === 'measure' ? 'active' : '']" v-if="meatureToolVisible">
          <span class="iconfont iconshuiziyuantubiaosheji-15" @click="handleClick('measure')" title="测量工具"></span>
          <div class="container_measure_tools" v-if="current === 'measure'">
            <el-radio-group v-model="measureType" @change="measureTypeChange">
              <el-radio label="length">测量长度</el-radio>
              <el-radio label="area">测量面积</el-radio>
            </el-radio-group>
          </div>
        </li>
        <!-- 放大 -->
        <li @click="handleClick('zoomOut')" :class="[current === 'zoomOut' ? 'active' : '']" v-if="zoomOutToolVisible">
          <span class="iconfont iconshuiziyuantubiaosheji-13" title="放大"></span>
        </li>
        <!-- 缩小 -->
        <li @click="handleClick('zoomIn')" :class="[current === 'zoomIn' ? 'active' : '']" v-if="zoomInToolVisible">
          <span class="iconfont iconshuiziyuantubiaosheji-14" title="缩小"></span>
        </li>

        <!-- 图例 -->
        <!-- <li @click="handleClick('legend')" :class="[current === 'legend' ? 'active' : '']" v-if="legendToolVisible">
          <span title="图例" class="iconfont icona-huaban1fuben5"></span>
        </li> -->
        <!-- 刷新 -->
        <!-- <li @click="handleClick('refresh')" :class="[current === 'refresh' ? 'active' : '']" v-if="refreshToolVisible">
          <span title="刷新" class="iconfont iconshuaxin"></span>
        </li> -->
      </ul>
    </div>

    <div v-if="dataListVisible" class="map-right-content">
      <LayerTree @getSingleData="getSingleData" :options="dataListOption" :theme="mapType" :map="olMap"></LayerTree>
    </div>
    <!-- 弹窗信息 -->
    <section id="ol-popup-custom">
      <img src="../../static/images/MonitorSys/icon_close.png" class="img-class" alt="" @click="closePopup" />
      <section class="legend-title-content">
        <section class="tips-title">
          <span>{{ popInfos.title }}</span>
        </section>
      </section>

      <section class="tips-content">
        <ul>
          <li v-for="ele in popInfos.infos" :key="ele.label">
            <span class="label">{{ ele.label }}：</span>
            <span class="value">{{ ele.value }}{{ ele.unit || '' }}</span>
          </li>
        </ul>
      </section>
    </section>
  </section>
</template>

<script>
import OLMap from '@/utils/OLMap/OLMap';
import LayerTree from '@/components/LayerTree/index.vue';

import selectIconYingyongshui from '@/static/images/LayerImage/icon_yinyong_s_big.png';
import selectIconRuhe from '@/static/images/LayerImage/icon_ruhe_s_big.png';
import selectIconShuiku from '@/static/images/LayerImage/icon_shuiku_s_big.png';
import selectIconWurangqiye from '@/static/images/LayerImage/icon_wuranqiye_s_big.png';
import selectIconYangzhiqiye from '@/static/images/LayerImage/icon_yangzhi_s_big.png';
import selectIconShuihuanjing from '@/static/images/LayerImage/icon_shuihuanjing_s_big.png';
import selectIconShuili from '@/static/images/LayerImage/icon_shuili_s_big.png';
import { Icon, Style } from 'ol/style';
import { toSize } from 'ol/size';
import Vector from 'ol/source/Vector';
import axios from 'axios';
import OLWMS from '../../utils/OLMap/OLWMS';
import * as layersUtils from '@/utils/OLMap/Layers/index';

import Measure from '@/utils/OLMap/Measure';
// eslint-disable-next-line import/extensions
import { addInteraction, removeInteraction } from '@/utils/OLMap/Draw/measure1.js';
// eslint-disable-next-line import/named,import/extensions
// import { measure } from '@/utils/OLMap/Draw/meaSure.js';

import 'ol/ol.css';
// import { Map, View } from 'ol';
// import XYZ from 'ol/source/XYZ';
// import TileLayer from 'ol/layer/Tile';
// import { defaults } from 'ol/control';
// import mapConfig from '../../utils/OLMap/mapConfig';

import defaultTpl from '../../../public/tpl/default.json';
import splitDefaultMap from '../../../public/tpl/splitDefaultMap.json';

import tdtStreetMap from '../../static/images/map/tools/bg-tdt-street.png';
import tdtImgMap from '../../static/images/map/tools/bg-tdt-img.png';


// const {
//   projection1, center1, zoom1
// } = mapConfig;

const selectIconYingyongshuiStyle = new Style({
  image: new Icon({
    src: selectIconYingyongshui,
    scale: toSize(1)
  })
});
const selectIconRuheStyle = new Style({
  image: new Icon({
    src: selectIconRuhe,
    scale: toSize(1)
  })
});
const selectIconShuikuStyle = new Style({
  image: new Icon({
    src: selectIconShuiku,
    scale: toSize(1)
  })
});
const selectIconWurangqiyeStyle = new Style({
  image: new Icon({
    src: selectIconWurangqiye,
    scale: toSize(1)
  })
});
const selectIconYangzhiqiyeStyle = new Style({
  image: new Icon({
    src: selectIconYangzhiqiye,
    scale: toSize(1)
  })
});
const selectIconShuihuanjinStyle = new Style({
  image: new Icon({
    src: selectIconShuihuanjing,
    scale: toSize(1)
  })
});

const selectIconShuiliStyle = new Style({
  image: new Icon({
    src: selectIconShuili,
    scale: toSize(1)
  })
});

export default {
  name: 'BaseMap',
  components: {
    LayerTree
  },
  data () {
    return {
      mapTpl: null,
      dataListVisible: false,
      dataListOption: null,
      olMap: null,

      // 是否显示弹窗
      popVisible: false,
      // 弹窗信息
      popInfos: {
        title: '',
        infos: [
          {
            label: '',
            value: ''
          }
        ]
      }, // 点击图标弹窗信息
      backupFeature: null,
      backupStyle: null,

      // 分屏是否可见
      splitMapVisible: false,
      splitMapToolVisible: false,
      splitMap: null,
      current: '', // 双屏状态

      meatureToolVisible: false, // 测量工具条是否可见，current === 1
      measureType: 'length', // 默认选中测量长度
      // measureType: 'area',

      baseMapToolVisible: false,
      tdtStreetMap,
      tdtImgMap,
      // 当前底图类型。默认是矢量(街道)
      mapType: 'vec',

      adminRegionToolVisible: false,
      adminRegionData: {},
      currentSelect: '靖安县',
      olWMS: null,

      // legendToolVisible: false,
      // refreshToolVisible: false,

      zoomOutToolVisible: false,
      zoomInToolVisible: false
    };
  },
  props: {
    params: {
      type: Object,
      data () {
        return {};
      }
    }
  },
  watch: {
    /**
     * @description 监听底图切换 派发事件
     * @todo getMapType 监听函数
     */
    mapType (val) {
      this.$emit('getMapType', val);
    }
  },
  mounted () {
    const { init, tpl = defaultTpl } = this.params;

    this.mapTpl = tpl;
    const widgets = tpl?.content?.widgets;
    const tools = tpl?.content?.tools;

    tools.forEach((value) => {
      if (value?.id === 'split-map') {
        this.splitMapVisible = value.visible;
        this.splitMapToolVisible = value.visible;
      } else if (value?.id === 'measure') {
        this.meatureToolVisible = value.visible;
      } else if (value?.id === 'switchBaseMap') {
        this.baseMapToolVisible = value.visible;
        this.mapType = value?.config?.default;
      } else if (value?.id === 'administrativeRegion') {
        this.adminRegionToolVisible = value.visible;
        // 存储行政区域数据
        this.adminRegionData = value.config;
        // } else if (value?.id === 'legend') {
        //   this.legendToolVisible = value.visible;
        // } else if (value?.id === 'refresh') {
        //   this.refreshToolVisible = value.visible;
        // }
      } else if (value?.id === 'zoomOut') {
        this.zoomOutToolVisible = value.visible;
      } else if (value?.id === 'zoomIn') {
        this.zoomInToolVisible = value.visible;
      }
    });

    this.$nextTick(() => {
      // 渲染分屏地图

      if (this.splitMapVisible) {
        this.splitMap = new OLMap({ init, tpl: splitDefaultMap });
      }

      widgets.forEach((value) => {
        if (value?.id === 'data-list') {
          this.dataListOption = value;
          this.dataListVisible = value?.visible ? value.visible : false;
        } else if (value?.id === 'feature-popinfo') {
          // 图层弹窗信息
          this.popVisible = value?.visible || false;
        }
      });
      this.olMap = new OLMap({ init, tpl });

      if (this.splitMapVisible) {
        this.olMap.map.setView(this.splitMap.map.getView());
      }

      // 添加弹窗

      const olPopup = document.getElementById('ol-popup-custom');

      // this.olMap.addPointOverlay(olPopup);
      this.olMap.addEvent('click', (e) => {
        // 获取当前center和zoom
        // console.log(111, this.olMap.map.getView().getCenter(),this.olMap.map.getView().getZoom());
        // 点击事件是否命中feature
        const pixel = this.olMap.map.getEventPixel(e.originalEvent);
        const hit = this.olMap.map.hasFeatureAtPixel(pixel);

        if (hit) {
          // 矢量要素选择
          this.olMap.map.forEachFeatureAtPixel(e.pixel, (feature) => {
            // 为移动到的feature发送自定义的singleclick消息
            feature.dispatchEvent({
              type: 'singleclick',
              event: e,
              ol: this.olMap,
              element: olPopup,
              callBack: this.createPopup
            });

            const { values_ } = feature;
            const { attribute } = values_;
            const { type } = attribute;

            // （2）图标高亮选择
            // 存储/恢复原始图标信息
            if (this.backupFeature) {
              this.backupFeature.setStyle(this.backupStyle);
            }
            this.backupFeature = feature;
            this.backupStyle = feature.getStyle();
            // 根据要素feature定位所在的图层
            let layerName = '';

            this.olMap.map.getLayers().forEach((ele) => {
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
            } else if (layerName === 'waterProject') {
              // 水环境监测点
              // eslint-disable-next-line no-param-reassign
              feature.setStyle(selectIconShuiliStyle);
            }

          });
        } else {
          // wms服务图层要素选择
          // this.olMap.pointOverlay.setPosition(null);
          // if (this.backupFeature) {
          //   this.backupFeature.setStyle(this.backupStyle);
          // }

          this.olMap.map.forEachLayerAtPixel(e.pixel, (layer) => {
            layer.dispatchEvent({
              type:'singleclick',
              event: e,
              ol: this.olMap,
              element: olPopup,
              callBack: this.createPopup
            });
          });
        }
      });

      if (this.adminRegionToolVisible) {
        this.olWMS = new OLWMS(this.olMap.map);
      }
    });
  },
  methods: {
    closePopup () {
      layersUtils.hideOverlayAndHighLight();
    },
    handleClick (current) {
      // 工具栏切换
      if (this.current !== current) {
        // 复原上一次选中的状态,例如双屏复原为单屏
        this.resetTools(this.current);
        this.current = current;
        // 切换到当前工具
        this.turnToTools(current);
      } else {
        // eslint-disable-next-line no-lonely-if
        if (current === 'zoomIn' || current === 'zoomOut' || current === 'refresh') {
          // 如果是放大和缩小则不切换tools状态，并触发点击事件
          this.turnToTools(current);
        } else {
          this.resetTools(current);
          this.current = null;
        }
      }
    },
    measureTypeChange (val) {
      this.measure.removeInteraction();
      this.measure.addInteraction(val);
      // measure.typeSelect.onChange();
      // measure.removeInteraction();
      // measure.addInteraction();
      // measure.removeInteraction();
      // measure(this.olMap.map,this.measureType).addInteraction();
    },
    getMap () {
      return this.olMap.map;
    },
    // 恢复上一次工具的状态
    resetTools (current) {
      if (current === 'splitMap') {
        this.splitMapVisible = false;
        // 更新地图
        this.$nextTick(() => {
          this.olMap.map.updateSize();
        });
      } else if (current === 'measure') {
        this.measure.removeInteraction();
      } else if (current === 'switchBaseMap') {
        // this.measure.removeInteraction();
      } else if (current === 'administrativeRegion') {
        // this.measure.removeInteraction();
      } else if (current === 'legend') {
        // this.measure.removeInteraction();
      } else if (current === 'refresh') {
        // this.measure.removeInteraction();
      } else if (current === 'zoomOut') {
        // this.measure.removeInteraction();
      } else if (current === 'zoomIn') {
        // this.measure.removeInteraction();
      }
    },
    // 切换工具状态
    turnToTools (current) {
      if (current === 'splitMap') {
        this.splitMapVisible = true;
        // 更新地图
        this.$nextTick(() => {
          this.olMap.map.updateSize();
        });
      } else if (current === 'measure') {
        // let vector = null;
        if (!this.measure) {
          this.measure = new Measure({ map: this.olMap.map });
          this.measure.removeInteraction();
          this.measure.addInteraction(this.measureType);
          // removeInteraction();
          // addInteraction(this.measureType,this.olMap.map);
          // measure.removeInteraction();
          measure(this.olMap.map,this.measureType);
        } else {
          this.measure.removeInteraction();
          this.measure.addInteraction(this.measureType);
          // measure(this.olMap.map,this.measureType);
        }
      } else if (current === 'switchBaseMap') {
        // this.measure.removeInteraction();
      } else if (current === 'administrativeRegion') {
        // this.measure.removeInteraction();
      } else if (current === 'legend') {
        // this.measure.removeInteraction();
      } else if (current === 'refresh') {
        // this.measure.removeInteraction();
      } else if (current === 'zoomOut') {
        this.olMap.zoomOutIn('zoomOut');
      } else if (current === 'zoomIn') {
        this.olMap.zoomOutIn('zoomIn');
      }
    },
    switchBaseMap (options) {
      const { mapType } = options;

      this.mapType = mapType;
      this.olMap.switchBaseMap(options);
    },

    selectRegion (item) {
      if (this.currentSelect !== item.value) {
        this.currentSelect = item.value;
        // 重新加载图层
        this.olWMS.removeLayerByName(this.adminRegionData.layers);
        const layers = this.adminRegionData.layers.includes(`${this.mapTpl?.geoserverWorkspace}:`) ?
          this.adminRegionData.layers :
          `ja:${this.adminRegionData.layers}`;
        const options = {
          url: process.env.VUE_APP_GEOSERVER_IP,
          params: {
            layers
          }
        };

        // 选中靖安县，加载整个图层
        if (this.currentSelect !== this.adminRegionData.value[0].value) {
          options.params.cql_filter = `strTrim(${this.adminRegionData.key}) = '${this.currentSelect}'`;
        }
        this.olWMS.addWMSLayer(options);
        const layersWfs = this.adminRegionData.layersWfs.includes(`${this.mapTpl?.geoserverWorkspace}:`) ?
          this.adminRegionData.layersWfs :
          `ja:${this.adminRegionData.layersWfs}`;

        if (this.currentSelect !== this.adminRegionData.value[0].value) {
          this.olWMS.zoomToViewByFeature(`strTrim(${this.adminRegionData.key}) = '${this.currentSelect}'`, layersWfs);
        } else {
          this.olWMS.zoomToViewByFeature(null, layersWfs);
        }
      }
    },
    // 单选图层时触发的事件
    getSingleData (val) {
      this.$emit('getSingleData', val);
    },
    // 组织弹窗内容
    createPopup (layerName, properties){
      const layerTree = this.dataListOption?.layers;

      this.popInfos.title = null;
      this.popInfos.infos = [];

      layerTree.forEach( item =>{
        const {info={} } = item;
        const { title, field } = info;

        if (item.name === layerName) {
          this.popInfos.title = title;

          Object.entries(properties).forEach((value) => {
            if (value[0] === title){
              const [, poptitle]= value;

              this.popInfos.title = poptitle;
            }
            if (Object.prototype.hasOwnProperty.call(field,value[0])){
              const [popNmae, popValue] = value;
              const popInfo={
                label: field[popNmae]?.name,
                value: field[popNmae]?.type?.toLowerCase() === 'string' ? popValue : field[popNmae]?.type?.toLowerCase() ==='number' ? popValue.toFixed(4) : popValue
              };

              this.popInfos.infos.push(popInfo);
            }
          });
        }
      });

      if (this.popInfos.title === null && this.popInfos.infos.length ===0){
        layersUtils.hideOverlayAndHighLight();
      }
    }
  }
};
</script>

<style lang="scss">
.map-widget {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .tools_class {
    position: absolute;
    right: 0.1rem;
    top: 5.4rem;
    display: flex;
    user-select: none;
    z-index: 1000;

    ul {
      display: flex;
      flex-direction: column;
      border-radius: 0.04rem;
      background-color: #fff;
      padding: 0;
      list-style: none;
      li {
        width: 0.48rem;
        height: 0.4rem;
        box-shadow: 0px 0px 20px 0px rgba(0, 23, 67, 0.1);
        background: #ffffff;
        color: #989898;
        font-weight: bolder;
        text-align: center;
        vertical-align: middle;
        line-height: 0.4rem;

        &.active {
          color: #1559bd;
        }

        > span {
          font-size: 0.2rem;
          cursor: pointer;
        }

        .container_measure_tools {
          position: absolute;
          right: 0.56rem;
          top: 0.13rem;
          padding: 0.1rem;
          border-radius: 0.05rem;
          background: #fff;
          .el-radio-group {
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-around;
            height: 0.4rem;
            label {
              margin-right: 0 !important;
              span {
                font-size: 0.14rem;
              }
            }
          }
        }

        .basemap_switch_container {
          position: absolute;
          right: 0.56rem;
          top: 0.13rem;
          display: flex;
          padding: 0.1rem;
          border-radius: 0.05rem;
          background: #fff;
          div {
            display: flex;
            flex-direction: column;

            img {
              width: 1.09rem;
              height: 0.84rem;
              cursor: pointer;
            }
            span {
              font-size: 0.14rem;
              font-family: PingFang SC;
              font-weight: 500;
              color: #000000;
              line-height: 0.39rem;
            }
          }
          div:first-child {
            margin-right: 0.1rem;
          }
        }

        .select-class {
          box-shadow: 0px 0px 2px #6591eb;
          border: 1px solid #316ce5;
        }

        .region_container {
          position: absolute;
          right: 0.56rem;
          top: 0.13rem;
          height: 1.64rem;
          min-width: 0.9rem;
          overflow-y: scroll;
          padding: 0.1rem 0.1rem 0.1rem 0.1rem;
          border-radius: 0.05rem;
          background: #fff;

          span {
            font-size: 0.1rem;
            font-family: PingFang SC;
            font-weight: 500;
            color: #333333;
          }

          li {
            width: 100%;
            height: 0.26rem;
            vertical-align: middle;
            line-height: 0.26rem;
          }

          .select_class {
            background-color: #eff4ff;
          }
        }
      }
    }
  }
}
.basemap {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.split_map {
  float: left;
  width: calc(50% - 0.01rem) !important;
  height: 100%;
  overflow: hidden;
}
.split_line {
  float: left;
  width: 0rem;
  width: 0.02rem;
  height: 100%;
  background: #ffffff;
}

.map-right-content {
  position: fixed;
  right: 0.1rem;
  top: 0.7rem;
  display: flex;
  justify-content: flex-end;
  transition: 0.5s;
}
.ol-overlaycontainer-stopevent {
  z-index: 999 !important;
}

#ol-popup-custom {
  background: #ffffff;
  padding: 0.1rem;
  border-radius: 0.04rem;
  min-width: 2.68rem;
  // height: 2.86rem;
  box-shadow: 0px 0px 16px 0px rgba(22, 40, 76, 0.06);

  position: absolute;
  background-color: white;
  bottom: 10px;
  left: -48px;
  .legend-title-content {
    display: flex;
    align-items: center;
    font-size: 0.2rem;
    font-weight: 600;
    line-height: 0.4rem;
    // border-bottom: 1px #000 solid;

    .tips-title {
      font-size: 0.18rem;
      color: #000919;
      padding-left: 0.16rem;
      // padding-right: 0.2rem;
    }
    .circul1 {
      width: 0.16rem;
      height: 0.16rem;
      border-radius: 50%;
    }
    .circul2 {
      position: relative;
      top: 0.03rem;
      left: 0.03rem;
      width: 0.1rem;
      height: 0.1rem;
      border-radius: 50%;
    }
    .blue1 {
      background-color: #d9e7fc;
    }
    .blue2 {
      background-color: #4186ef;
    }
  }
  .img-class {
    position: absolute;
    right: 0.1rem;
    top: 0.1rem;
    width: 0.2rem;
    height: 0.2rem;
    cursor: pointer;
  }

  .tips-content {
    line-height: 0.4rem;
    font-size: 0.16rem;
    padding: 0 0.1rem;
    background-color: #f6f7f8;
    width: 2.48rem;
    // height: 2.2rem;
    margin-bottom: 0.05rem;
    .tips-item {
      // height: 0.3rem;
      margin: 0.05rem 0;
      font-size: 0.16rem;
      color: #000919;
      font-family: PingFang SC;
      font-weight: 500;

      .text-item {
        color: #888888;
        // font-weight: 700;
      }
    }

    ul {
      list-style: none;
      width: 100%;
      padding: 0 0;
      padding-left: 0.03rem;
      margin-bottom: 0.05rem;

      li {
        line-height: 0.3rem;
        letter-spacing: 0.01rem;
      }
    }
  }
}

#ol-popup-custom:after,
#ol-popup-custom:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
#ol-popup-custom:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

/* 测量tip样式 */
.ol-tooltip {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0.04rem;
  color: white;
  padding: 0.04rem 0.08rem;
  opacity: 0.7;
  white-space: nowrap;
  font-size: 0.12rem;
}
.ol-tooltip-measure {
  opacity: 1;
  font-weight: bold;
}
.ol-tooltip-static {
  background-color: #ffcc33;
  color: black;
  border: 0.01rem solid white;
}
.ol-tooltip-measure:before,
.ol-tooltip-static:before {
  border-top: 0.06rem solid rgba(0, 0, 0, 0.5);
  border-right: 0.06rem solid transparent;
  border-left: 0.06rem solid transparent;
  content: '';
  position: absolute;
  bottom: -0.06rem;
  margin-left: -0.07rem;
  left: 50%;
}
.ol-tooltip-static:before {
  border-top-color: #ffcc33;
}
#ol-demos-measure {
  width: 100%;
  height: 100%;
}

.hiden {
  display: none !important;
}
</style>
