/*
 * @Author: 周梦茹
 * @Date: 2021-06-08 11:22:44
 * @LastEditors: 周梦茹
 * @LastEditTime: 2021-07-15 14:06:23
 * @Description:
 * @FilePath: \src\utils\Region\index.js
 */
export function getList (value) {
  value.forEach((ele) => {
    const item = ele;

    item.value = item.name;
    item.label = item.name;
    if (item.children && item.children.length !== 0) {
      getList(item.children);
    }
    if (item.children.length === 0) {
      delete item.children;
    }
  });
  return value;
}
export function getListOne (value) {
  value.forEach((ele) => {
    const item = ele;

    item.value = item.name;
    item.label = item.name;
    if (item.children && item.children.length !== 0) {
      this.getList(item.children);
    }
    if (item.children.length === 0) {
      delete item.children;
    }
  });
  return value;
}
