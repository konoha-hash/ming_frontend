<template>
  <div class="main">
    <h1>Ming main</h1>
  <router-view class="container" />
  </div>
</template>

<script>

export default {
  name: "MingMain",
  components: {
  },
  data () {
    return {
    };
  },
}
</script>


<style lang="scss">
.main {
  width: 100%;
  height: 100%;

  iframe {
    width: 100%;
    height: 100%;
  }

  > .container {
    height: calc(100% - 0.6rem);

    > .content {
      height: 100%;

      > .wrapper,
      > .wrapper .second-wrapper {
        height: 100%;
        // background-color: rgb(233, 233, 233);
      }
    }
  }
}
</style>