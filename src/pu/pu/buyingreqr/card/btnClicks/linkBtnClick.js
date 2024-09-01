/*
 * @Author: zhangchangqing 
 * @PageInfo: 单据追溯
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2021-09-18 13:44:15
 */
import { BUYINGREQ_CARD, ATTRCODE, FBILLSTATUS } from '../../siconst';
export default function linkBtnClick(props) {
	// 获取选中行

	let pk;
	let fbillstatus = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.fbillstatus).value;
	// 自由，审批中，审批不通过传递原始主键
	if (
		fbillstatus == FBILLSTATUS.free ||
		fbillstatus == FBILLSTATUS.approve ||
		fbillstatus == FBILLSTATUS.unapproved
	) {
		pk = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_srcpraybill).value;
	} else if (fbillstatus == FBILLSTATUS.approved || fbillstatus == FBILLSTATUS.other) {
		pk = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_praybill).value;
	}
	this.setState({ pk: pk, showTrack: true });
}
