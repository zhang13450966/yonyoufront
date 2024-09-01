/*
 * @Author: zhangchangqing 
 * @PageInfo: 修改按钮事件
 * @Date: 2018-04-19 10:35:28 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 15:00:20
 */
import { TARGETADJ_CARD, ATTRCODE, TARGETADJ_LIST } from '../../siconst';
import { buttonController } from '../viewControl';
import { ajax } from 'nc-lightapp-front';
export default function clickEditBtn(props) {
	let formId = TARGETADJ_CARD.formId;
	let pk_targetadj = this.props.form.getFormItemsValue(formId, ATTRCODE.pk_targetadj).value;
	let data = { keyword: pk_targetadj, pageid: TARGETADJ_LIST.cardpageid, type: TARGETADJ_CARD.card };
	ajax({
		url: TARGETADJ_CARD.editCardInfoURL,
		data: data,
		success: (res) => {
			if (res.data && res.data.fcyclesetflag) {
				this.fcyclesetflag = res.data.fcyclesetflag;
			}
			this.props.cardTable.selectAllRows(TARGETADJ_CARD.tableId, false);
			props.pushTo(TARGETADJ_CARD.cardUrl, {
				status: TARGETADJ_CARD.edit,
				id: this.props.getUrlParam(TARGETADJ_CARD.id),
				pagecode: TARGETADJ_CARD.cardpageid
			});
			buttonController.setCardPaginationVisible(this.props, false); //设置翻页不显示
			if (data === undefined) {
				//订单编号
				this.setState({
					vbillcode: '',
					billId: ''
				});
				return;
			}
			this.setState({
				lineShowType: [],
				vbillcode: props.form.getFormItemsValue(TARGETADJ_CARD.formId, ATTRCODE.vbillcode).value,
				billId: props.form.getFormItemsValue(TARGETADJ_CARD.formId, ATTRCODE.pk_targetadj).value
			});
			//修改组织的可编辑状态
			this.props.form.setFormItemsDisabled(TARGETADJ_CARD.headf, {
				[ATTRCODE.pk_org]: false,
				[ATTRCODE.ctargetid]: false
			});
			this.props.cardTable.selectAllRows(TARGETADJ_CARD.tableId, false);
			this.toggleShow();
		}
	});
}
