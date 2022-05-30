<template>
  <div id="sys_drought">
    <!-- 导航-->
    <Nav></Nav>
      <!--        表示当前页面的子路由会在这里展示-->
      <router-view />
  </div>
</template>

<script>
import Nav from "@/components/ming/Drought/Nav";

export default {
  name: "DroughtMain",
  components:{Nav},
  data() {
    return {
    };
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "style";
#sys_drought{
  height: 100%;
  width: 100%;
}
.map{
  position: absolute;
  left: 20%;
  height: 100%;
  width: 80%;
  background: #00b4ff;
}
</style>