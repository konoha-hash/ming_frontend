<template>

  <el-container style="height: 100vh;">
    <el-aside
      width="200px"
      style="background-color: rgb(238, 241, 246)"
    >
    <Aside></Aside>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px; border-bottom:1px solid #ccc;line-height:60px">
        <Header></Header>
      </el-header>

      <el-main>
<!--        表示当前页面的子路由会在这里展示-->
        <router-view />
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import Aside from "@/components/Aside.vue";
import Header from "@/components/Header.vue";

export default {
  name: 'Home',
  components:{Aside,Header},
  data () {
    return {
      tableData:[]
    }
  },
  created() {
    this.request.get("http://localhost:9090/user/page",{
      params:{
        pageNum: 1,
        pageSize: 3,
      }}).then(res=>{
      console.log(res)
      this.tableData = res.data;
    })
  }
}
</script>
