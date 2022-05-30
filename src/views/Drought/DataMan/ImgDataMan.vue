<template>
  <div id="imgDataMan">
    <h1>影像数据管理页面</h1>
    <div class="tab-operation">
      <el-button type="success">新增</el-button>
      <el-button type="primary">修改</el-button>
      <el-button type="danger">删除</el-button>
    </div>
    <div class="table">
      <el-table
          :data="tableData"
          style="width: 100%">
        <el-table-column
            prop="title"
            label="影像"
            width="250">
        </el-table-column>
        <el-table-column
            prop="time"
            label="时间"
            width="250">
        </el-table-column>
        <el-table-column
            prop="sensor"
            label="传感器"
            width="250">
        </el-table-column>
        <el-table-column
            prop="format"
            label="格式"
            width="200">
        </el-table-column>
        <el-table-column
            prop="uploadtime"
            label="数据上传时间"
            width="200">
        </el-table-column>
        <el-table-column
            prop="isprocess"
            label="处理情况"
            width="150">
        </el-table-column>
        <el-table-column
          prop="isrelease"
          label="发布情况"
          width="150">
      </el-table-column>
        <el-table-column
            prop="operation"
            label="操作"
            width="400">
          <el-button type="primary" >修改</el-button>
          <el-button type="primary" @click="doProcess">执行算法</el-button>
          <el-button type="primary" @click="mapup">发布服务</el-button>
          <el-button type="danger">删除</el-button>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ImgDataMan",
  data() {
    return {
      tableData: [
        {
          'title':'影像名称',
          'time':'2021-10-10',
          'sensor':'无人机',
          'format':'hdr',
          'uploadtime':'2022-2-10',
          'isprocess':'未处理',
          'isrelease':'未发布',
        },
        {
          'title':'锡林郭勒',
          'time':'2021-10-10',
          'sensor':'无人机',
          'format':'hdr',
          'uploadtime':'2022-2-15',
          'isprocess':'处理中',
          'isrelease':'未发布',
        },
        {
          'title':'鄂尔多斯',
          'time':'2021-10-10',
          'sensor':'无人机',
          'format':'hdr',
          'uploadtime':'2022-2-10',
          'isprocess':'已处理',
          'isrelease':'已发布',
        }
      ]
    }
  },
  methods:{
    doProcess(){
      console.log("执行算法！");
    },
    mapup(){
      // console.log("上传结果");
      axios.get('http://localhost:9090/mapup').then((res)=>{
        console.log(res.data)
        this.$message.info(res.data);
      })
    }
  }
}
</script>

<style lang="scss">
#imgDataMan{
  height: 100%;
  width: 95vw;
  margin: 40px;

  .tab-operation{
    margin: 20px;
  }

  .table{
    width: 100%;
    height: 600px;
    background: #686868;
  }
}
</style>