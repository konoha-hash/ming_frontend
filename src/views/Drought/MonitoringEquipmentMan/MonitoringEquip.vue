<template>
  <div class="monitoringEquip">
    <!-- 地图-->
    <div class="map"><BaseMap :params="{ init: true, tpl: mapTpl }" ref="map" /></div>

<!--    收缩table-->
    <div class="bottom" :class="showList[2].flag === true ? '' : 'bottom1'">
      <div class="bottom-close">
      </div>
      <div class="table-more">
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import BaseMap from '@/components/BaseMap/Basemap1';
import mapTpl from "../../../../public/tpl/default.json";
import OLMap from "@/utils/OLMap/OLMap";
import OLMarkPoints from "@/utils/OLMap/OLMarkPoints";
import iconCamera from '@/assets/img/MonitorEquipment/icon_camera.png';

export default {
  name: "MonitoringEquip",
  components:{BaseMap},
  data() {
    return {
      mapTpl: mapTpl, //地图模板


      defaultProps: {
        children: 'children',
        label: 'label'
      },
      showList: [
        { index: 0, flag: true },
        { index: 1, flag: true },
        { index: 2, flag: true }
      ],
      olMap: null,
      oLMarkPoints: null,
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
    };
  },
  computed:{
    ...mapState('monitoringEquip',['videoMonitorPoints'])
  },
  created() {
    this.getVideoMonitorPoints();
  },

  mounted(){
    // 初始化mark点
    this.$nextTick(() => {

      this.olMap = new OLMap();

      this.oLMarkPoints = new OLMarkPoints();

      const olPopup = document.getElementById('ol-popup');

      this.oLMarkPoints.addPointOverlay(olPopup);

      //const value = Getattribute(this.olMap,this.oLMarkPoints, this.showtract,this.popInfos,this.backupFeature,this.backupStyle,this.mapTpl,this.fuzhi);
      this.olMap.addEvent('click', (e) => {
        // 点击事件是否命中feature
        const pixel = this.olMap.map.getEventPixel(e.originalEvent);

        const hit = this.olMap.map.hasFeatureAtPixel(pixel);

        if (hit) {
          const feature1 = this.olMap.map.forEachFeatureAtPixel(e.pixel, (feature) => {
            const { values_ } = feature;
            const { attribute } = values_;
            const { type } = attribute;

            console.log(type);

            // 更新弹窗信息popInfos
            // （1）更新title/infos
            if (type === 'event') {
              this.showtract = false;
              this.popInfos.title = '事件信息';
              this.popInfos.infos = [
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
              // 图标高亮选择
              const position = feature.getGeometry().getCoordinates();

              this.oLMarkPoints.pointOverlay.setPosition(position);
            } else if (type === 'camera') {
              this.showtract = false;
              this.popInfos.title = '监控点';
              this.popInfos.infos = [
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
              // 图标高亮选择
              const position = feature.getGeometry().getCoordinates();

              this.oLMarkPoints.pointOverlay.setPosition(position);
            } else if (type === 'inspector') {
              this.showtract = true;
              this.popInfos.title = '巡查员信息';
              this.popInfos.infos = [
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
              this.getInspectorPointInfo(this.popInfos.infos);
              // 图标高亮选择
              const position = feature.getGeometry().getCoordinates();

              this.oLMarkPoints.pointOverlay.setPosition(position);
            }
            return feature;
          });
        }
      });
    });
    this.timer = setInterval(() => {
      this.getInspectorInfo();
    }, 1000 * 30);
  },

  watch:{
    videoMonitorPoints(val){
      console.log('val',val);
      if (val.length > 0) {
        this.$nextTick(() => {
          // 初始化mark点
          console.log('执行了videoMonitorPoints');
          this.olMap = new OLMap();
          this.oLMarkPoints = new OLMarkPoints();
          const olPopup = document.getElementById('ol-popup');

          this.oLMarkPoints.addPointOverlay(olPopup);
          val.forEach((ele) => {
            // eslint-disable-next-line no-param-reassign
            ele.icon = iconCamera;
            // eslint-disable-next-line no-param-reassign
            ele.type = 'camera';
          });
          console.log(val);
          this.oLMarkPoints.add(val,{
            iconScale: 1,
            isLocation: true,
            zoom: 18
          });
          console.log(this.oLMarkPoints);
        })
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods:{
    ...mapActions('monitoringEquip',['getVideoMonitorPoints']),
  }
}
</script>

<style lang="scss" scoped>
.monitoringEquip{
  height: 80%;
  width: 100%;

  .map{
    position: absolute;
    height: 100%;
    width: 100%;
    background: #00b4ff;
}

  .bottom {
    width: 79%;
    height: 3rem;
    border-radius: 0.08rem;
    transition: all 0.5s;


    th {
      padding: 0 !important;
      height: 0.4rem !important;
    }
    td {
      padding: 0 !important;
      height: 0.34rem !important;
    }

    .table-more {
      width: 100%;
      height: 3rem;
      padding: 0.15rem 0.05rem 0.05rem;
      background: rgb(255, 255, 255);
      border-radius: 0.08rem 0.08rem 0 0;

      .load-more-container {
        text-align: center;
        color: #32aceb;
        font-size: 0.15rem;
        font-weight: 700;
        text-decoration: underline;
        cursor: pointer;
        margin-top: 0.05rem;
      }

      .el-table__row {
        height: 0.34rem;
      }
    }
  }
}


</style>