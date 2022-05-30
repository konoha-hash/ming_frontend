<!--
 * @Author: 王磊
 * @Date: 2021-03-12 14:12:55
 * @LastEditors: 周梦茹
 * @LastEditTime: 2021-05-10 16:40:19
 * @Description: 根据有没有子项返回不同
 * @FilePath: \src\components\NavBar\NavItem.vue
-->
<template>
  <div>
    <el-submenu
      v-if="menuData.children && menuData.children.length >= 1"
      :index="menuData.path"
      :hide-timeout="500"
      :show-timeout="100"
      mode="horizontal"
    >
      <template slot="title">{{ menuData.name }}</template>
      <NavItem v-for="item in menuData.children" :key="item.path" :menuData="item"></NavItem>
    </el-submenu>

    <el-menu-item v-else-if="!(menuData.meta && menuData.meta.hide)" :index="menuData.path">
      {{ menuData.name }}
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: 'NavItem',
  props: {
    menuData: {
      type: Object,
      require: true
    }
  },
  methods: {}
};
</script>

<style lang="scss"></style>
