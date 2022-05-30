/*
 * @Author: 周梦茹
 * @Date: 2021-05-17 15:55:48
 * @LastEditors: 屈梦婷
 * @LastEditTime: 2021-09-23 10:57:19
 * @Description:表格导出
 * @FilePath: \bussiness\src\utils\Table\exportTable.js
 */
import axios from 'axios';

export default function exportExcel (sys, api, excelName, requestParams) {
  let exportUrl;

  if (sys === 1) {
    exportUrl = `${process.env.VUE_APP_BASE_API}${api}`;
  } else if (sys === 2) {
    exportUrl = `${process.env.VUE_APP_BASE_API_DATA}${api}`;
  } else if (sys === 3) {
    exportUrl = `${process.env.VUE_APP_BASE_API_DECISION}${api}`;
  } else if (sys === 4) {
    exportUrl = `${process.env.VUE_APP_BASE_API_APP}${api}`;
  }
  axios({
    method: 'POST',
    url: exportUrl,
    data: requestParams,
    responseType: 'blob'
  }).then((res) => {
    // console.log(res);
    if (res.status === 200) {
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      });
      const url = window.URL.createObjectURL(blob);
      const aLink = document.createElement('a');

      aLink.style.display = 'none';
      aLink.href = url;
      aLink.setAttribute('download', excelName);
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
      window.URL.revokeObjectURL(url);
    }
  });
}
