/*
 * @Author: zhaochyu
 * @PageInfo: 司机定义编辑前
 * @Date: 2020-02-12 16:51:00
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2020-03-19 10:26:13
 */
export default function beforeEvent(
  props,
  moduleId,
  item,
  index,
  value,
  record
) {
  let flag = true;
  let bcarrierflag = record.values.bcarrierflag.value;
  if (item.attrcode == "vdrivername" || item.attrcode == "ccarrierid") {
    if (bcarrierflag == true) {
      flag = true;
    } else {
      flag = false;
    }
  } else if (item.attrcode == "cpsndocid" || item.attrcode == "cdeptid_v") {
    if (bcarrierflag == true) {
      flag = false;
    } else {
      flag = true;
    }
  }
  return flag;
}
