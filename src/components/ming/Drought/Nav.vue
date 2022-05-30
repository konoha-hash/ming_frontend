<template>
  <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
    <el-menu-item><h1 style="color: #4186ef">荒漠化监测分析子系统</h1></el-menu-item>

    <el-menu-item index="1">
      <router-link to="/drought/maininfo">实时信息</router-link>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">数据管理</template>
        <el-menu-item index="2-1">
        <router-link to="/drought/imgDataMan">影像数据管理</router-link>
        </el-menu-item>
      <el-menu-item index="2-2">
        <router-link to="/drought/thematicData">专题图数据管理</router-link>
        </el-menu-item>
    </el-submenu>
    <el-submenu index="3" >
      <template slot="title">设备监测</template>
      <el-menu-item index="3-1">
        <router-link to="/drought/monitoringEquip">监测设备管理</router-link>
      </el-menu-item>
      <el-menu-item index="3-2">
        <router-link to="/drought/monitoringEquip">设备信息</router-link>
      </el-menu-item>
      </el-submenu>
    <el-menu-item index="4" >
      <router-link to="/drought/algorithmDoc">算法调度</router-link>
    </el-menu-item>
    <el-submenu index="5">
      <template slot="title">干旱指数</template>
      <el-menu-item index="5-1">
        <router-link to="/drought/TVDIMonth">逐月干旱指数</router-link>
      </el-menu-item>
      <el-menu-item index="5-2">
        <router-link to="/drought/thematicData">干旱数据管理</router-link>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="6">
      <template slot="title">遥感生态指数</template>
      <el-menu-item index="6-1">
        <router-link to="/drought/RSEI">在线分析</router-link>
      </el-menu-item>
      <el-menu-item index="6-2">
        <router-link to="/drought/thematicData">RSEI数据管理</router-link>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "Nav"
}
</script>

<style scoped>

</style>