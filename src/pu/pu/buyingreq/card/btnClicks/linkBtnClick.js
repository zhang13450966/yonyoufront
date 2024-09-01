/*
 * @Author: zhangchangqing 
 * @PageInfo: 单据追溯
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2021-09-23 10:18:01
 */
import { BUYINGREQ_CARD, ATTRCODE, FBILLSTATUS } from '../../siconst';
export default function linkBtnClick(props) {
	// 获取选中行
	let pk;
	let fbillstatus = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.fbillstatus).value;
	let modifystatus = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.modifystatus).value;
	// 修订的审批中心，审批不通过和审批中,审批通过单据追溯时传递原始主键
	if (modifystatus == 0 && (fbillstatus == FBILLSTATUS.unapproved || FBILLSTATUS.approve)) {
		pk = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_srcpraybill).value;
	} else {
		let pk_srcpraybill = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_srcpraybill).value;
		if (pk_srcpraybill) {
			pk = pk_srcpraybill;
		} else {
			pk = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_praybill).value;
		}
	}
	this.setState({ pk: pk, showTrack: true });
	//let pk = this.props.cardTable.getCheckedRows(BUYINGREQ_LIST.formId)[0].data.values.pk_praybill.value;
	//this.setState({pk: pk ,showTrack: true});
}
