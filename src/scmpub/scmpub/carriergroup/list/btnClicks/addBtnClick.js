/*
 * @Author: zhaochyu
 * @PageInfo:司机定义新增
 * @Date: 2020-02-10 12:36:38
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2020-02-21 14:59:02
 */
import { FILED, URL, STATUS } from "../../constance";
export function addBtnClick(props) {
  props.pushTo(URL.gotoCard, {
    from: FILED.list,
    cardStatus: STATUS.add
  });
}
