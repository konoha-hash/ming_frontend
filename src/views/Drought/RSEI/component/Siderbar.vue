<template>
  <div class="side-left">
<!--    检索条件-->
    <div class="search">
      <h1>检索条件</h1>
      <div class="item">
        <h2>数据选择</h2>
        <div id="time">
          <el-date-picker
              v-model="daterange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change = "getDateRange"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="item">
        <h2>区域选择</h2>
        <el-select v-model="value1" style="width: 180px;" @change = "areaSelected"  placeholder="请选择矿区">
          <el-option
              v-for="item in areaList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select v-model="value2" style="width: 180px; margin-left: 20px;"  placeholder="请选择煤田">
          <el-option
              v-for="item in placeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="search-button">
        <el-button type="primary" @click="getData">查找数据</el-button>
      </div>
    </div>
    <div class="searchRes">
      <h1>检索结果</h1>
      <template>
        <el-table
            :data="tableData"
            style="width: 100%"
            max-height="250">
          <el-table-column
              prop="dataname"
              label="名称"
              width="100">
          </el-table-column>
          <el-table-column
              prop="year"
              label="年"
              width="100">
          </el-table-column>
          <el-table-column
              prop="day"
              label="天"
              width="50"
          >
          </el-table-column>
          <el-table-column
              label="操作"
          >
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  @click="calRSEI(scope.row)">计算RSEI</el-button>
            </template>

            <div class="calbutton"><el-button type="primary" @click="calRSEI">计算RSEI</el-button></div>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import defaultTpl from "../../../../../public/tpl/default.json";
import OLMap from "@/utils/OLMap/OLMap";

export default {
  name: "Silderbar",
  data(){
    return{
      olMap:null,
      daterange:null,
      areaList:[
        {value: '1',
        label: '鄂尔多斯'},
        {value: '2',
        label: '锡林郭勒'}
      ],
      placeList:[],
      value1: '',
      value2: '',
      tableData:[],
    }
  },
  props: {
    params: {
      type: Object,
      data () {
        return {};
      }
    }
  },
  mounted() {

    this.$nextTick(
        ()=>{
          this.olMap = this.params.olMap;
        }
    )
  },
  methods:{
    //获取时间
    getDateRange(){
      console.log(this.daterange);
    },

    //获取煤田列表
    getPlaceList(areaCode){
      switch (areaCode)
      {
        case '1':
          this.placeList = [
            {value: '1', label: '东胜'},
            {value: '2', label: '准格尔'},
            {value: '3', label: '离柳'},
            {value: '4', label: '神木'},
            {value: '5', label: '华亭'},
          ];
          break;
        case '2':
          this.placeList = [
            {value: '1', label: '测试1'},
            {value: '2', label: '测试2'},
          ];
          break;
        default:
          this.placeList = [];
          break;
      }
    },

    //根据矿区切换煤田
    areaSelected(){
      this.getPlaceList(this.value1);
    },

    //参数转换
    getDataPram(daterange){
      const param = {startyear:null,startday:null,endyear:null,endday:null};

      param.startyear = daterange[0].getFullYear();
      param.startday = this.calDay(daterange[0]);
      param.endyear = daterange[1].getFullYear();
      param.endday = this.calDay(daterange[1]);

      return param;
    },

    //计算一年的第几天
    calDay(date){
      const currentYear = date.getFullYear().toString();
      const hasTimestamp = date - new Date(currentYear);
      const hasDays = Math.ceil(hasTimestamp/86400000) + 1
      return hasDays
    },

    //获取数据
    getData(){
      if(this.daterange !== null && this.value1 !== null && this.value2 !== null){
        const param = this.getDataPram(this.daterange);
        axios.post("http://localhost:8881/RSEI/getData",param).then((res) =>{
          if (code == "200"){

            this.$message.success('数据获取成功！');
            this.tableData = data;
          }else {
            this.$message.error('数据获取失败！');
          }
        })
      }else {
        if(this.daterange == null){
          this.$alert('请选择时间范围', '检索条件缺失', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: `action: ${ action }`
              });
            }
          });
        };
        if (this.value1 == ''){
          this.$alert('请选择矿区', '检索条件缺失', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: `action: ${ action }`
              });
            }
          });
        };
        if (this.value2 == ''){
          this.$alert('请选择煤田', '检索条件缺失', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: `action: ${ action }`
              });
            }
          });
        };
      }
    },

    //计算RSEI
    calRSEI(row){
      const dataPathList = []
      console.log(row.path);

      const param = {
        "datapath": ""
        // "outputpath": "E:\\python\\demo\\calRSEI\\data_dongsheng\\res_gee"
      };
      param.datapath = row.path;

      const loading = this.$loading({
        lock: true,
        text: '正在计算RSEI（遥感生态指数）',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      axios.post("http://localhost:8881/RSEI/doAlgorithm",param).then((res)=>{
        loading.close();
        const {code,data} = res.data;

        if (code == "200"){
          const layer = {
            "id": "0158336bce132v9282de583367510107",
              "alias": "",
              "name": "",
              "type": "wms",
              "url": "http://localhost:7070/geoserver/ming/wms"
          }
          layer.alias = data;

          layer.name = data;

          this.olMap.createLayer(layer);

          this.$message.success('RSEI(遥感生态指数)计算完成！');

        }else {
          this.$message.error('服务器端错误！');
        }
      })
    },

  }
}
</script>

<style lang="scss" scoped>
.side-left{
  position: absolute;
  height: 100%;
  width: 430px;
  padding: 0.1rem 0.05rem 0 0.05rem;
  background-color: #d9e7fc;

  h1{
    color: #00b4ff;
  }
  .search{
    position:relative;
    margin: 10px;
    padding:5px;
    border:  1px solid black;

    .search-button{
      position: relative;
      left: 150px;
      right: 0;
      margin: auto;
    }
  }

  .searchRes{
    position:relative;
    margin: 10px;
    padding:5px;
    border:  1px solid black;


  }

  .calRSEI{
    margin: 10px;
    .calbutton{
      position: relative;
      left: 150px;
      right: 0;
      margin: auto;
    }
  }

  .item{
    margin-top: 10px;
    margin-bottom: 10px;
  }




}
</style>