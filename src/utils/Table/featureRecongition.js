/*
 * @Author: 周梦茹
 * @Date: 2021-04-20 16:41:55
 * @LastEditors: 周梦茹
 * @LastEditTime: 2021-07-15 14:06:40
 * @Description:
 * @FilePath: \src\utils\Table\featureRecongition.js
 */
export function featureRecongition (label, num) {
  let styleStr = '';

  switch (label) {
  case 'monitoringStation':
    break;
  case 'waterTemperature':
    if (num >= 26 && num <= 27) {
      styleStr = '正常';
    } else if ((num < 26 && num >= 25) || (num > 27 && num <= 29)) {
      styleStr = '警告';
    } else {
      styleStr = '报警';
    }
    break;
  case 'phValue':
    if (num >= 6 && num <= 9) {
      styleStr = '正常';
    } else if ((num < 6 && num >= 5) || (num > 9 && num <= 10)) {
      styleStr = '警告';
    } else {
      styleStr = '报警';
    }
    break;
  case 'dissolvedOxygen':
    if (num >= 5) {
      styleStr = '正常';
    } else if (num < 5 && num >= 4) {
      styleStr = '警告';
    } else {
      styleStr = '报警';
    }
    break;
  case 'conductivity':
    if (num === 7.92) {
      styleStr = '正常';
    } else if ((num < 26 && num >= 25) || (num > 27 && num <= 29)) {
      styleStr = '警告';
    } else {
      styleStr = '报警';
    }
    break;
  case 'turbidity':
    if (num === 3.8) {
      styleStr = '正常';
    } else if ((num < 26 && num >= 25) || (num > 27 && num <= 29)) {
      styleStr = '警告';
    } else {
      styleStr = '报警';
    }
    break;
  case 'ammoniaNitrogen':
    if (num === 0.007) {
      styleStr = '正常';
    } else if ((num < 26 && num >= 25) || (num > 27 && num <= 29)) {
      styleStr = '警告';
    } else {
      styleStr = '报警';
    }
    break;
  case 'totalPhosphorus':
    if (num === 0.039) {
      styleStr = '正常';
    } else if ((num < 26 && num >= 25) || (num > 27 && num <= 29)) {
      styleStr = '警告';
    } else {
      styleStr = '报警';
    }
    break;
  case 'totalNitrogen':
    if (num === 0.63) {
      styleStr = '正常';
    } else if ((num < 26 && num >= 25) || (num > 27 && num <= 29)) {
      styleStr = '警告';
    } else {
      styleStr = '报警';
    }
    break;
  case 'codmn':
    if (num === 1.16) {
      styleStr = '正常';
    } else if ((num < 26 && num >= 25) || (num > 27 && num <= 29)) {
      styleStr = '警告';
    } else {
      styleStr = '报警';
    }
    break;

  default:
    break;
  }
  return styleStr;
}

export function featureUpORDown (label, num) {
  return label + num;
}
