<template>
  <el-menu
      :default-openeds="['1', '3']"
      style="min-height:100%;overflow-x:hidden"
      background-color='rgb(48,65,86)'
      text-color='#fff'
  >
    <el-submenu index="/">
      <template slot="title"><i class="el-icon-message"></i>首页</template>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title"><i class="el-icon-menu"></i>系统管理</template>
      <el-menu-item-group>
        <template slot="title" index="/user">用户管理</template>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "Aside"
}
</script>

<style scoped>

</style>