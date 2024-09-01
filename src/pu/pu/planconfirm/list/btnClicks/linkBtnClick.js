/*
 * @Author: zhangchangqing 
 * @PageInfo: 单据追溯
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-02-28 10:27:38
 */
import { AREA } from '../../constance';
export default function linkBtnClick(props) {
	// 获取选中行
	let pk = this.props.table.getCheckedRows(AREA.head)[0].data.values.pk_planconfirm.value;
	this.setState({ pk_planconfirm: pk, showTrack: true });
}
