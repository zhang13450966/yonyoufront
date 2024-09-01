/*
 * @Author: zhaochyu
 * @PageInfo:司机定义新增
 * @Date: 2020-02-10 12:36:38
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2020-03-19 10:15:19
 */
import { FILED, URL, STATUS, CARRIERDATASOURCE } from "../../constance";
import { getDefData } from "../../../pub/cache";
export function addBtnClick(props) {
  props.pushTo(URL.gotoCard, {
    from: FILED.list,
    cardStatus: STATUS.add,
    type: getDefData(CARRIERDATASOURCE.carrierdatasource, FILED.type)
  });
}
