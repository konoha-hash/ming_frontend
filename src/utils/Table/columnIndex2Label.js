/*
 * @Author: 屈梦婷
 * @Date: 2021-03-31 09:59:54
 * @LastEditors: 屈梦婷
 * @LastEditTime: 2021-08-31 14:05:04
 * @Description:
 * @FilePath: \bussiness\src\utils\Table\columnIndex2Label.js
 */
export function columnIndex2LabelWater (columnIndex) {
  let label = '';

  switch (columnIndex) {
  case 3:
    label = 'totalPhosphorusOnlineAnalyzer';
    break;
  case 4:
    label = 'totalNitrogenOnlineAnalyzer';
    break;
  case 5:
    label = 'ammoniaNitrogenOnlineAnalyzer';
    break;
  case 6:
    label = 'temperatureSensor';
    break;
  case 7:
    label = 'phSensor';
    break;
  case 8:
    label = 'dissolvedOxygenSensor';
    break;
  case 9:
    label = 'conductivitySensor';
    break;
  case 10:
    label = 'turbiditySensor';
    break;
  case 11:
    label = 'permanganateIndexOnlineAnalyzer';
    break;
  default:
    break;
  }
  return label;
}
export function columnIndex2LabelWaterEq (columnIndex) {
  let label = '';

  switch (columnIndex) {
  case 1:
    label = 'linkStatus';
    break;
  case 2:
    label = 'totalPhosphorusOnlineAnalyzer';
    break;
  case 3:
    label = 'totalNitrogenOnlineAnalyzer';
    break;
  case 4:
    label = 'ammoniaNitrogenOnlineAnalyzer';
    break;
  case 5:
    label = 'temperatureSensor';
    break;
  case 6:
    label = 'phSensor';
    break;
  case 7:
    label = 'dissolvedOxygenSensor';
    break;
  case 8:
    label = 'conductivitySensor';
    break;
  case 9:
    label = 'turbiditySensor';
    break;
  case 10:
    label = 'permanganateIndexOnlineAnalyzer';
    break;
  default:
    break;
  }
  return label;
}
export function columnIndex2LabelMonitorPoint (columnIndex) {
  let label = '';

  switch (columnIndex) {
  case 0:
    label = 'monitoringStation';
    break;
  case 1:
    label = 'waterTemperature';
    break;
  case 2:
    label = 'phValue';
    break;
  case 3:
    label = 'dissolvedOxygen';
    break;
  case 4:
    label = 'conductivity';
    break;
  case 5:
    label = 'turbidity';
    break;
  case 6:
    label = 'ammoniaNitrogen';
    break;
  case 7:
    label = 'totalPhosphorus';
    break;
  case 8:
    label = 'totalNitrogen';
    break;
  case 9:
    label = 'codMn';
    break;
  default:
    break;
  }
  return label;
}
export function columnIndex2LabelPipEq (columnIndex) {
  let label = '';

  switch (columnIndex) {
  case 0:
    label = 'order';
    break;
  case 1:
    label = 'street';
    break;
  case 2:
    label = 'eqNum';
    break;
  case 3:
    label = 'eqType';
    break;
  case 4:
    label = 'monitorType';
    break;
  case 5:
    label = 'monitorTime';
    break;
  case 6:
    label = 'deviceRunStatus';
    break;
  case 7:
    label = 'flowVelocity';
    break;
  case 8:
    label = 'waterDepth';
    break;
  case 9:
    label = 'temperature';
    break;
  case 10:
    label = 'liquidLevel';
    break;
  default:
    break;
  }
  return label;
}
export function columnIndex2LabelWaterQuilty (columnIndex) {
  let label = '';

  switch (columnIndex) {
  case 0:
    label = 'sort';
    break;
  case 1:
    label = 'monitorStation';
    break;
  case 2:
    label = 'dateTimeVo';
    break;
  case 3:
    label = 'waterTemperature';
    break;
  case 4:
    label = 'phValueVo';
    break;
  case 5:
    label = 'dissolvedOxygenVo';
    break;
  case 6:
    label = 'conductivityVo';
    break;
  case 7:
    label = 'turbidityVo';
    break;
  case 8:
    label = 'ammoniaNitrogenVo';
    break;
  case 9:
    label = 'totalPhosphorusVo';
    break;
  case 10:
    label = 'totalNitrogenVo';
    break;
  case 11:
    label = 'codMnVo';
    break;
  default:
    break;
  }
  return label;
}
export function columnIndexLakerManage (columnIndex) {
  let label = '';

  switch (columnIndex) {
  case 0:
    label = 'state';
    break;
  case 1:
    label = 'nodeName';
    break;
  case 2:
    label = 'handOpinions';
    break;
  default:
    break;
  }
  return label;
}
