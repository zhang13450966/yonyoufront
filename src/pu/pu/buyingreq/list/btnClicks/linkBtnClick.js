/*
 * @Author: zhangchangqing 
 * @PageInfo: 单据追溯
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-11-04 09:21:42
 */
import { BUYINGREQ_LIST } from '../../siconst';
export default function linkBtnClick(props) {
	// 获取选中行
	let pk = this.props.table.getCheckedRows(BUYINGREQ_LIST.formId)[0].data.values.pk_praybill.value;
	this.setState({ pk: pk, showTrack: true });
}
