/*
 * @Author: 周梦茹
 * @Date: 2021-04-20 16:41:55
 * @LastEditors: 周梦茹
 * @LastEditTime: 2021-11-01 11:19:09
 * @Description:
 * @FilePath: \bussiness\src\utils\OLMap\ColorBlendingScheme.js
 */

// rgb转16进制
function to16 (color) {
  const r = parseInt(color[0], 10);
  const g = parseInt(color[1], 10);
  const b = parseInt(color[2], 10);
  const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

  return hex;
}

// 根据图例生成图形
function setColorStrokeByxmlData (currentLegend, style, val) {

  for (let i = 0; i < currentLegend.reMaps.length; i++) {
    if (Number(val) < Number(currentLegend.reMaps[i].value)) {
      if (currentLegend.reMaps[i].color) {
        style.getFill().setColor(to16(currentLegend.reMaps[i].color));
      }
      style.getStroke().setColor('#595959');
      style.getStroke().setWidth(0.6);
      break;
    }
  }
  return style;
}

// 水资源承载力分层设色
export function setColorStroke (vectorIdValue, val, style, currentLegend) {
  const vectorId = vectorIdValue.substring(0, 9);

  if (Object.prototype.hasOwnProperty.call(currentLegend, 'reMaps')) {
    setColorStrokeByxmlData(currentLegend, style, val);
  } else if (vectorId === 'water_CZL' || vectorId === 'water_STA') {
    if (val < 0.2) {
      style.getFill().setColor('#f47f92');
      style.getStroke().setColor('#595959');
      style.getStroke().setWidth(0.6);
    } else if (val >= 0.2 && val < 0.4) {
      style.getFill().setColor('#fbdb5a');
      style.getStroke().setColor('#595959');
      style.getStroke().setWidth(0.6);
    } else if (val >= 0.4 && val < 0.6) {
      style.getFill().setColor('#4ecb73');
      style.getStroke().setColor('#595959');
      style.getStroke().setWidth(0.6);
    } else if (val >= 0.6 && val < 0.8) {
      style.getFill().setColor('#59d4d4');
      style.getStroke().setColor('#595959');
      style.getStroke().setWidth(0.6);
    } else {
      style.getFill().setColor('#3aa1ff');
      style.getStroke().setColor('#595959');
      style.getStroke().setWidth(0.6);
    }
  }
  if (vectorId === 'water_STG') {
    if (val < 20) {
      style.getFill().setColor('#f47f92');
      style.getStroke().setColor('#595959');
      style.getStroke().setWidth(0.6);
    } else if (val >= 20 && val < 40) {
      style.getFill().setColor('#fbdb5a');
      style.getStroke().setColor('#595959');
      style.getStroke().setWidth(0.6);
    } else if (val >= 40 && val < 60) {
      style.getFill().setColor('#4ecb73');
      style.getStroke().setColor('#595959');
      style.getStroke().setWidth(0.6);
    } else if (val >= 60 && val < 80) {
      style.getFill().setColor('#59d4d4');
      style.getStroke().setColor('#595959');
      style.getStroke().setWidth(0.6);
    } else {
      style.getFill().setColor('#3aa1ff');
      style.getStroke().setColor('#595959');
      style.getStroke().setWidth(0.6);
    }
  }
  if (vectorId === 'water_STW') {
    if (val < 40) {
      style.getFill().setColor('#f47f92');
      style.getStroke().setColor('#595959');
      style.getStroke().setWidth(0.6);
    } else if (val >= 40 && val < 60) {
      style.getFill().setColor('#fbdb5a');
      style.getStroke().setColor('#595959');
      style.getStroke().setWidth(0.6);
    } else if (val >= 60 && val < 70) {
      style.getFill().setColor('#4ecb73');
      style.getStroke().setColor('#595959');
      style.getStroke().setWidth(0.6);
    } else if (val >= 70 && val < 80) {
      style.getFill().setColor('#59d4d4');
      style.getStroke().setColor('#595959');
      style.getStroke().setWidth(0.6);
    } else {
      style.getFill().setColor('#3aa1ff');
      style.getStroke().setColor('#595959');
      style.getStroke().setWidth(0.6);
    }
  }
  if (vectorId === 'water_sou') {
    if (val === '1101') {
      style.getFill().setColor('#9FD7FC');
      style.getStroke().setColor('#9FD7FC');
      style.getStroke().setWidth(0.1);
    } else if (val === '1102') {
      style.getFill().setColor('#5275F8');
      style.getStroke().setColor('#5275F8');
      style.getStroke().setWidth(0.6);
    } else if (val === '1103') {
      style.getFill().setColor('#65E093');
      style.getStroke().setColor('#65E093');
      style.getStroke().setWidth(0.6);
    } else if (val === '1104') {
      style.getFill().setColor('#CD5EFB');
      style.getStroke().setColor('#CD5EFB');
      style.getStroke().setWidth(0.6);
    } else {
      style.getFill().setColor('#595959');
      // style.getStroke().setColor('#595959');
      // style.getStroke().setWidth(0.6);
    }
  }
  return style;
}

export function setColorStrokeOther () {}
