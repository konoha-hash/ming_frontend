<template>
  <div class="algorithmDoc">
    <h1>荒漠化算法分析说明</h1>
    <div class="pdf">
      <pdf
          ref="pdf"
          :src="pdfUrl">
      </pdf>
    </div>

  </div>
</template>

<script>
import pdf from 'vue-pdf';

export default {
  name: "AlgorithmDoc",
  components:{
    pdf
  },
  data(){
    return {
          pdfUrl:"/static/desertAlgorithm.pdf",
        }
  },
}
</script>

<style lang="scss">
.algorithmDoc{
  height: 100%;
  width: 100%;
  background: #00b4ff;

  .pdf{
    height: 100%;
    width: 100%;
    background: #000919;
    pdf{
      height: 500px;
      width: 500px;
      background: #00b4ff;
    }
  }
}
</style>