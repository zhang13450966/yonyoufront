/*
 * @Author: zhangchangqing 
 * @PageInfo: 单据追溯
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2021-09-08 09:24:09
 */
import { BUYINGREQ_LIST, FBILLSTATUS } from '../../siconst';
export default function linkBtnClick(props) {
	// 获取选中行
	let pk;
	let fbillstatus = this.props.table.getCheckedRows(BUYINGREQ_LIST.formId)[0].data.values.fbillstatus.value;
	// 自由，审批中，审批不通过传递原始主键
	if (
		fbillstatus == FBILLSTATUS.free ||
		fbillstatus == FBILLSTATUS.approve ||
		fbillstatus == FBILLSTATUS.unapproved
	) {
		pk = this.props.table.getCheckedRows(BUYINGREQ_LIST.formId)[0].data.values.pk_srcpraybill.value;
	} else if (fbillstatus == FBILLSTATUS.approved) {
		pk = this.props.table.getCheckedRows(BUYINGREQ_LIST.formId)[0].data.values.pk_praybill.value;
	}
	this.setState({ pk: pk, showTrack: true });
}
