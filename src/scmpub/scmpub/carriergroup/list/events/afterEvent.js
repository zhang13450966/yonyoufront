/*
 * @Author: zhaochyu
 * @PageInfo: 编辑后事件
 * @Date: 2020-02-12 20:26:07
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2020-03-19 10:26:07
 */
import { VOFIELD } from "../../constance";
export default function afterEvent(props, moduleId, item, value, rows, index) {
  if (item == "cpsndocid") {
    if (value.values) {
      this.props.editTable.setValByKeyAndIndex(moduleId, index, "vdrivername", {
        value: value.values.psndocname.value
      });
      this.props.editTable.setValByKeyAndIndex(moduleId, index, "cdeptid_v", {
        value: value.values.pk_dept.value,
        display: value.values.deptname.value,
        scale: null
      });
    } else {
      this.props.editTable.setValByKeyAndIndex(moduleId, index, "vdrivername", {
        value: null,
        display: null
      });
      this.props.editTable.setValByKeyAndIndex(moduleId, index, "cdeptid_v", {
        value: null,
        display: null
      });
    }
  } else if (item == "bcarrierflag") {
    VOFIELD.map(key => {
      this.props.editTable.setValByKeyAndIndex(moduleId, index, key, {
        value: null,
        display: null
      });
    });
  }
}
