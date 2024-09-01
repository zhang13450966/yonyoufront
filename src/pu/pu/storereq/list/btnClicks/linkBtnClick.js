/*
 * @Author: zhangchangqing 
 * @PageInfo: 单据追溯
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-14 17:52:37
 */
import { STOREREQ_LIST } from '../../siconst';
export default function linkBtnClick(props) {
	// 获取选中行
	let pk = this.props.table.getCheckedRows(STOREREQ_LIST.formId)[0].data.values.pk_storereq.value;
	this.setState({ pk: pk, showTrack: true });
}
