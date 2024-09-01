/*
 * @Author: zhangchangqing 
 * @PageInfo: 单据追溯
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: liangzhyf
 * @Last Modified time: 2020-07-23 20:11:02
 */
import { TARGET_LIST } from '../../siconst';
export default function linkBtnClick(props) {
	// 获取选中行
	let pk = this.props.cardTable.getCheckedRows(TARGET_LIST.formId)[0].data.values.pk_praybill.value;
	this.setState({ pk: pk, showTrack: true });
}
