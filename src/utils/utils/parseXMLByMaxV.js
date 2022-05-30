/*
 * @Author: wanglei
 * @Date: 2020-11-23 10:15:05
 * @LastEditTime: 2021-11-01 10:31:11
 * @LastEditors: 王佳宾
 * @Description: 将算法渲染方案xml解析成数组对象方便调用
 * @FilePath: \src\utils\utils\parseXMLByMaxV.js
 */
/**
 * @param {xml} data
 * @return {Array}
 */
export default function parseXMLByMaxV (data) {
  const result = [];
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data, 'text/xml');
  const pluginArray = xmlDoc.getElementsByTagName('Plugin');
  const len = pluginArray.length;

  let unit = ''; // 单位

  for (let i = 0; i < len; i += 1) {
    const ele1 = pluginArray[i];

    let obj = {};
    const prodName = ele1.getAttribute('ProdName');
    const useLabel = ele1.getAttribute('label');
    const reMapArr = ele1.getElementsByTagName('ReMaps')[0].children;

    unit = ele1.getElementsByTagName('ReMaps')[0].getAttribute('Unit');
    const reMaps = [];

    for (let j = 0; j < reMapArr.length; j += 1) {
      const ele2 = reMapArr[j];
      const color = ele2
        .getAttribute('Color')
        .split(',')
        .map((item) => Number(item));

      const opacity = ele2.getAttribute('opacity');
      // 如果长度是三，说明没有设置透明色，默认设置为1

      if (color.length === 3) {
        color.push(1);
      }

      // 第一行插入第一个分级的最小值
      if (j === 0) {
        reMaps.push({
          color,
          value: ele2.getAttribute('MinV'),
          label: ''
        });
      }


      const maxV = ele2.getAttribute('MaxV');
      const label = ele2.getAttribute('Label');

      reMaps.push({
        color,
        value: maxV,
        label
      });
    }

    obj = {
      prodName,
      reMaps,
      useLabel,
      unit
    };
    result.push(obj);
  }
  return result;
}
