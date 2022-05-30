<template>
  <div>
    <el-table :data="tableData">
      <el-table-column
          prop="username"
          label="用户名"
          width="140"
      >
      </el-table-column>
      <el-table-column
          prop="nickname"
          label="昵称"
          width="120"
      >
      </el-table-column>
      <el-table-column
          prop="phone"
          label="电话"
      >
      </el-table-column>
      <el-table-column
          prop="address"
          label="地址"
      >
      </el-table-column><el-table-column
        label="操作"
    >
    </el-table-column>

    </el-table>
  </div>
</template>

<script>
export default {
  name: "User",
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

<style scoped>

</style>