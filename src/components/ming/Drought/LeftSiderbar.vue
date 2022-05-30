<template>
  <div class="side-left">
    <div class="item">
      <div class="title">
        <i class="iconfont icona-renwu1"></i>
        <span>数据处理情况</span>
      </div>
      <div id="bar-echart"></div>
    </div>
    <div class="item">
      <div class="title">
        <i class="iconfont iconshuiwuju1"></i>
        <span>专题产品处理情况</span>
        <div class="count">
          <span>总计：</span>
          <span>34</span>
        </div>
      </div>
      <div class="select1">
        <el-radio-group
            v-model="radio"
            size="mini"
        >
          <el-radio-button label="月度"></el-radio-button>
          <el-radio-button label="季度"></el-radio-button>
          <el-radio-button label="年度"></el-radio-button>
        </el-radio-group>
      </div>
      <div id="line-echart"></div>
      <div class="item">
        <div class="title">
          <i class="iconfont icona-renwu1"></i>
          <span>荒漠化指数</span>
        </div>
        <div id="gauge-echart"></div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "MainLeft",
  data(){
    return{

    }
  },
  mounted() {
    this.makeLineEchart();
    this.makeBarEchart();
    this.makeGaugeEchart();
  },
  methods:{
    makeLineEchart () {
      const myEchart = this.echarts.init(document.getElementById('line-echart'));
      const option = {
        xAxis: {
          type: 'category',
          axisLabel: {
            color: '#6795DA'
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(181,181,181,0.4)',
              width: 2
            }
          },
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#6795DA'
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(181,181,181,0.2)',
              width: 2
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '30%',
          bottom: '',
          containLabel: true
        },
        color: '#3A84E8',
        series: {
          data: [50, 30, 40, 48, 35, 47, 56, 55, 34, 56, 33],
          type: 'line',
          symbolSize: 8,
          lineStyle: {
            width: 2,
            shadowColor: 'rgba(0,0,0,0.3)',
            shadowBlur: 10,
            shadowOffsetY: 8
          }
        }
      };

      myEchart.setOption(option);
    },
    makeBarEchart(){
      const myEchart = this.echarts.init(document.getElementById('bar-echart'));

      var option = {
        title: {
          text: '',
          subtext: 'Data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: '处理完成' },
              { value: 735, name: '正在处理' },
              { value: 580, name: '待处理' },
              { value: 484, name: '上传中' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      myEchart.setOption(option);
    },
    makeGaugeEchart(){
      const myEchart = this.echarts.init(document.getElementById('gauge-echart'));
      var option = {
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 1,
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                width: 6,
                color: [
                  [0.2, '#AA3801'],
                  [0.4, '#E79802'],
                  [0.6, '#FFFFBF'],
                  [0.8, '#CFFF73'],
                  [1, '#38A801']
                ]
              }
            },
            pointer: {
              icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
              length: '12%',
              width: 20,
              offsetCenter: [0, '-60%'],
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              length: 12,
              lineStyle: {
                color: 'auto',
                width: 2
              }
            },
            splitLine: {
              length: 20,
              lineStyle: {
                color: 'auto',
                width: 5
              }
            },
            axisLabel: {
              color: '#464646',
              fontSize: 15,
              distance: -80,
              formatter: function (value) {
                if (value==0.9) {
                  return '非荒漠化';
                } else if (value==0.7) {
                  return '轻度荒漠化';
                } else if (value==0.5) {
                  return '中度荒漠化';
                } else if (value==0.3) {
                  return '重度荒漠化';
                }else if (value==0.1) {
                  return '极重度荒漠化';
                }
                return '';
              }
            },
            title: {
              offsetCenter: [0, '-20%'],
              fontSize: 30
            },
            detail: {
              fontSize: 30,
              offsetCenter: [0, '0%'],
              valueAnimation: true,
              formatter: function (value) {
                return Math.round(value * 100) + '分';
              },
              color: 'auto'
            },
            data: [
              {
                value: 0.7,
                name: '轻度荒漠化'
              }
            ]
          }
        ]
      };

      myEchart.setOption(option);
    },
  }
}
</script>

<style lang="scss">
.side-left{
  position: absolute;
  height: 100%;
  width: 20%;
  padding: 0.1rem 0.05rem 0 0.05rem;
  background-color: #d9e7fc;

  .item{

  }

  #bar-echart {
    width: 100%;
    height: 200px;
  }
  #line-echart {
    width: 100%;
    height: 200px;
  }
  #gauge-echart{
    width: 100%;
    height: 500px;
  }
}
</style>