<template>
  <section>
    <div id="index">
      <div class="bg">
        <div class="host-body">
          <div class="head">
            <div class="title">
              <span class="title-text">大数据可视化平台</span>
            </div>
          </div>
          <div class="second-line">
            <div class="ehcarts-map">
              <!-- 地图-->
              <div class="map"><Map :params="{ init: true, tpl: mapTpl, olMap: olMap}" ref="Map"/></div>
              <div :class="['side-bar', switchvalue === true ? '' : 'side-bar-off']">bar
                <div id="button">
                  <el-switch
                      v-model="switchvalue"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                  </el-switch>
                </div>

              </div>
            </div>
            </div>
          </div>
      </div>
      </div>
  </section>
</template>

<script>
import mapTpl from '../../../public/tpl/BigScreen.json';
import OLMap from "@/utils/OLMap/OLMap";
import Map from "./Map";

export default {
  name: "home.vue",
  components:{Map},
  data(){
    return{
      switchvalue:false,
      mapTpl:mapTpl,
      olMap:null,
    }
  },
  mounted() {
    const param ={init: true, tpl: this.mapTpl}

    this.olMap = new OLMap(param);
  },
}
</script>

<style lang="scss" scoped>
#index{

  color: #d3d6dd;
  width: 100vw ;
  height: 100vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: left top;
  overflow: hidden;

  .bg {
    width: 100%;
    height: 100%;
    //padding: 16px 16px 0 16px;
    background-image: url("../../assets/pageBg.png");
    background-size: cover;
    background-position: center center;
  }

  .host-body{
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    .head{
      height: 8vh;
      width: 100%;
      background: blue;

      .title {
        position: relative;
        left: 50%;
        transform: translate(-50%);
        width: 500px;
        text-align: center;
        background-size: cover;
        background-repeat: no-repeat;

        .title-text {
          font-size: 24px;
          left: 50%;
          transform: translate(-50%);
        }

      }
    }

    .second-line{
      height: calc(100% - 8vh);
      width: 100%;
      //background: #00b4ff;

      .side-bar{
        position: absolute;
        height: 500px;
        width: 500px;
        background: lightgoldenrodyellow;
        left: 0px;
        transition: left  1s;
        z-index: 1;

        &.side-bar-off{
          left: -420px;
          transition: left 1s;
        }

        #button{
          position: relative;
          left: 87%;
        }
      }

      .ehcarts-map{
        position: relative;
        width: 100%;
        height: 100%;
        background: #42b983;

        .map{
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .side-bar{
          position: absolute;
          height: 500px;
          width: 500px;
          background: lightgoldenrodyellow;
          left: 0px;
          transition: left  1s;
          z-index: 1;

          &.side-bar-off{
            left: -420px;
            transition: left 1s;
          }

          #button{
            position: relative;
            left: 87%;
          }
        }
      }


    }

  }
}
</style>