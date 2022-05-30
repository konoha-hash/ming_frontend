/*
 * @Author: 屈梦婷
 * @Date: 2021-05-10 11:40:04
 * @LastEditors: 屈梦婷
 * @LastEditTime: 2021-10-27 18:22:49
 * @Description:  searchBox组件查询功能
 * @FilePath: \bussiness\src\utils\Search\searchBoxFunction.js
 */
import moment from 'moment';

export function searchFunction (value, a) {
  const paramsNew = {};

  value.forEach(({ lable, key }) => {
    if (a[key]) {
      switch (lable) {
      case '开始日期':
        paramsNew.startTime = moment(a[key]).format('yyyy-MM-DD HH:mm:ss');
        break;
      case '结束日期':
        paramsNew.endTime = moment(a[key]).format('yyyy-MM-DD HH:mm:ss');
        break;
      case '监测因子':
        paramsNew.monitoringFactors = a[key];
        break;
      case '监测站名称':
        paramsNew.monitorStation = a[key];
        break;
      case '监测设备':
        paramsNew.monitorEquipment = a[key];
        break;
      case '设备运行状态':
        paramsNew.deviceRunStatus = a[key];
        break;
      case '所在街道':
        paramsNew.street = a[key];
        break;
      case '设备类型':
        paramsNew.deviceType = a[key];
        break;
      case '测站名称':
        paramsNew.stationName = a[key];
        break;
      case '所属监测站':
        paramsNew.stationName = a[key];
        break;
      case '所在河段':
        paramsNew.river = a[key];
        break;
      case '监测项目':
        paramsNew.monitorProject = a[key];
        break;
      case '街道名称':
        paramsNew.street = a[key];
        break;
      case '管网类型':
        paramsNew.pipeNetworkType = a[key];
        break;
      case '启用状态':
        paramsNew.isEnable = a[key];
        break;
      case '是否支持远程':
        paramsNew.isRemoteControl = a[key];
        break;
      case '所在管网':
        paramsNew.street = a[key];
        break;
      case '是否超标':
        paramsNew.limits = a[key];
        break;
      case '设备编号':
        paramsNew.deviceCode = a[key];
        break;
      case '告警信息':
        paramsNew.alertInfo = a[key];
        break;
      case '所属管网':
        paramsNew.pipeLine = a[key];
        break;
      case '水质类别':
        paramsNew.waterType = a[key];
        break;
      case '监测类型':
        paramsNew.deviceType = a[key];
        break;
      case '测站类型':
        paramsNew.stationType = a[key];
        break;
      case '设备状态':
        paramsNew.deviceStatus = a[key];
        break;
      case '断面名称':
        paramsNew.riseName = a[key];
        break;
      case '所属地区':
        if (a[key].length === 3) {
          paramsNew.adName = `${a[key][0]}-${a[key][1]}-${a[key][2]}`;
        } else if (a[key].length === 2) {
          paramsNew.adName = `${a[key][0]}-${a[key][1]}`;
        } else {
          paramsNew.adName = `${a[key][0]}`;
        }
        break;

      case '入河排污口名称':
        paramsNew.pdoName = a[key];
        break;
      case '污水处理厂名称':
        paramsNew.stpName = a[key];
        break;
      case '开始入库时间':
        paramsNew.startTime = moment(a[key]).format('yyyy-MM-DD');
        break;
      case '结束入库时间':
        paramsNew.endTime = moment(a[key]).format('yyyy-MM-DD');
        break;
      case '文件名称':
        paramsNew.fileName = a[key];
        break;
      case '组织类型':
        paramsNew.orgType = a[key];
        break;
      case '行政级别':
        paramsNew.grade = a[key];
        break;
      case '角色名称':
        paramsNew.roleName = a[key];
        break;
      case '人员名称':
        paramsNew.name = a[key];
        break;
      case '人员性质':
        paramsNew.inOut = a[key];
        break;
      case '巡河所属区域':
        paramsNew.zone = a[key];
        break;
      case '巡河开始时间':
        paramsNew.startTime = moment(a[key]).format('yyyy-MM-DD');
        break;
      case '巡河结束时间':
        paramsNew.endTime = moment(a[key]).format('yyyy-MM-DD');
        break;
      case '河流名称':
        paramsNew.river = a[key];
        break;
      case '巡河人员':
        paramsNew.user = a[key];
        break;
      case '人员状态':
        paramsNew.tenure = a[key];
        break;
      default:
        break;
      }
    }
  });

  return paramsNew;
}

export function searchFunctionOne (value, a) {
  const paramsNew = {};

  value.forEach(({ lable, key }) => {
    if (a[key]) {
      switch (lable) {
      case '结束日期':
        paramsNew.endTime = moment(a[key]).format('yyyy-MM-DD');
        break;
      case '开始日期':
        paramsNew.startTime = moment(a[key]).format('yyyy-MM-DD');
        break;
      case '监测站名称':
        paramsNew.monitorStation = a[key];
        break;
      case '监测设备':
        paramsNew.monitorEquipment = a[key];
        break;
      case '设备运行状态':
        paramsNew.deviceRunStatus = a[key];
        break;
      case '所在街道':
        paramsNew.street = a[key];
        break;
      case '设备类型':
        paramsNew.deviceName = a[key];
        break;
      case '测站名称':
        paramsNew.stationName = a[key];
        break;
      case '所属监测站':
        paramsNew.stationName = a[key];
        break;
      case '所在河段':
        paramsNew.river = a[key];
        break;
      case '监测项目':
        paramsNew.monitorProject = a[key];
        break;
      case '街道名称':
        paramsNew.street = a[key];
        break;
      case '管网类型':
        paramsNew.pipeNetworkType = a[key];
        break;
      case '启用状态':
        paramsNew.isEnable = a[key];
        break;
      case '监测类型':
        paramsNew.deviceType = a[key];
        break;
      case '是否支持远程':
        paramsNew.isRemoteControl = a[key];
        break;
      case '所在管网':
        paramsNew.street = a[key];
        break;
      case '是否超标':
        paramsNew.limits = a[key];
        break;
      case '设备编号':
        paramsNew.deviceCode = a[key];
        break;
      case '告警信息':
        paramsNew.alertInfo = a[key];
        break;
      case '所属管网':
        paramsNew.pipeLine = a[key];
        break;
      case '水质类别':
        paramsNew.waterType = a[key];
        break;
      case '测站类型':
        paramsNew.stationType = a[key];
        break;
      case '设备状态':
        paramsNew.deviceStatus = a[key];
        break;
      case '所属区域':
        paramsNew.adName = a[key];
        break;
      case '养殖场名称':
        paramsNew.farmName = a[key];
        break;
      case '水库名称':
        paramsNew.resName = a[key];
        break;
      case '水库类型':
        paramsNew.resType = a[key];
        break;
      case '工程规模':
        paramsNew.engScal = a[key];
        break;
      case '建设开始时间':
        paramsNew.startTime = moment(a[key]).format('yyyy-MM-DD HH:mm:ss');
        break;
      case '建设结束时间':
        paramsNew.endTime = moment(a[key]).format('yyyy-MM-DD HH:mm:ss');
        break;
      case '巡查员名称':
        paramsNew.name = a[key];
        break;
      case '职位类型':
        paramsNew.userType = a[key];
        break;
      case '账户':
        paramsNew.username = a[key];
        break;
      case '开始时间':
        paramsNew.startTime = moment(a[key]).format('yyyy-MM-DD HH:mm:ss');
        break;
      case '结束时间':
        paramsNew.endTime = moment(a[key]).format('yyyy-MM-DD HH:mm:ss');
        break;
      case '系统':
        paramsNew.sys = a[key];
        break;
      case '添加方式':
        paramsNew.type = a[key];
        break;
      case '模式':
        paramsNew.module = a[key];
        break;
      case '河段名称':
        paramsNew.freeReachName = a[key];
        break;
      case '河长名称':
        paramsNew.name = a[key];
        break;
      case '巡河所属区域':
        paramsNew.town = a[key];
        break;
      case '巡河开始时间':
        paramsNew.startTime = moment(a[key]).format('yyyy-MM-DD');
        break;
      case '巡河结束时间':
        paramsNew.endTime = moment(a[key]).format('yyyy-MM-DD');
        break;
      default:
        break;
      }
    }
  });
  return paramsNew;
}
