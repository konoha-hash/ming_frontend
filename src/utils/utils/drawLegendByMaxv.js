/*
 * @Author: 周梦茹
 * @Date: 2021-10-13 14:17:42
 * @LastEditors: 周梦茹
 * @LastEditTime: 2021-10-25 13:57:30
 * @Description:绘制竖向图例
 * @FilePath: \bussiness\src\utils\utils\drawLegendByMaxv.js
 */
export default function drawLegendByMaxv (style = {}, width = 35, height = 12, id = 'legend-canvas', changeWidth = 40) {
  if (!Object.keys(style).length) {
    document.getElementById('legend').style.display = 'none';
    return;
  }
  document.getElementById('legend').style.display = 'block';
  let legendName = '图例';
  const {
    colorArr = [], useLabel, unit, showVlaue
  } = style;

  if (unit) {
    legendName += ` （单位：${unit}）`;
  }
  let useforReMaps = colorArr;
  // 如果设置了透明度为0，则不显示

  useforReMaps = colorArr.filter((item) => item.color[3] !== 0);

  const colorArray = useforReMaps.map((item) => item.label && item.color).filter(Boolean);
  const valueArray = useforReMaps.map((item) => (showVlaue ? item.value : '')).filter(Boolean);

  let labelArray = [];

  if (useLabel && !showVlaue) {
    labelArray = useforReMaps.map((item) => (useLabel ? item.label || false : item.value)).filter(Boolean);
  }
  if (useLabel && showVlaue) {
    labelArray = useforReMaps
      .slice(1)
      .map((item, index) => `${item.label}(${valueArray[index]}-${valueArray[index + 1]})`);
  }

  const lens = labelArray.map((item) => item && item.length);
  const maxLens = useLabel ? Math.max.apply(null, lens) : 0;

  const widen1 = maxLens * 5; //55

  let widen2 = 10;

  if (legendName.length > 8) {
    widen2 = (legendName.length - 8) * 10;
  }
  const widen = widen1 > widen2 ? widen1 : widen2; //label的宽度

  const dataObj = [];

  if (colorArray) {
    colorArray.forEach((element) => {
      if (element) {
        const a = element[0];
        const b = element[1];
        const c = element[2];
        const d = element[3];
        const color = `rgba(${a},${b},${c},${d})`;

        dataObj.push(color);
      }
    });
  }

  const canvas = document.getElementById(id);
  const ctx = canvas.getContext('2d');
  const xheight = dataObj.length * (height + 8); // 计算canvas宽度

  canvas.width = width + widen + changeWidth*1.2;
  canvas.height = xheight + 30;
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, 200, xheight); // 绘制底图
  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#0e0e0e';

  ctx.fillText(legendName, canvas.width / 3, 15);

  for (let i = 0; i < labelArray.length; i++) {
    // 实现文字
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#0e0e0e';
    const txt = labelArray[i];

    ctx.fillText(txt, 10, useLabel ? 40 + i * height + 8 * i : 30 + i * height);
  }
  for (let i = 0; i < dataObj.length; i++) {
    // 实现文字前面带色块
    ctx.fillStyle = dataObj[i]; // 块颜色
    ctx.fillRect(changeWidth + widen, 30 + i * height + 8 * i, width, height); // 颜色块：x,y,w,h
  }
}
