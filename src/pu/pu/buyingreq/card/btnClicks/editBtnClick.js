/*
 * @Author: zhangchangqing 
 * @PageInfo: 修改按钮事件
 * @Date: 2018-04-19 10:35:28 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 17:19:56
 */
import { BUYINGREQ_CARD, ATTRCODE, BUYINGREQ_LIST } from '../../siconst';
import { buttonController } from '../viewControl';
import { ajax } from 'nc-lightapp-front';
export default function clickEditBtn(props) {
	let formId = BUYINGREQ_CARD.formId;
	let pk_praybill = this.props.form.getFormItemsValue(formId, ATTRCODE.pk_praybill).value;
	let data = { keyword: pk_praybill, pageid: BUYINGREQ_LIST.cardpageid, type: BUYINGREQ_CARD.card };
	ajax({
		url: BUYINGREQ_CARD.editCardInfoURL,
		data: data,
		success: (res) => {
			//推单标识
			let channelType = this.props.getUrlParam(BUYINGREQ_CARD.channelType);
			let transfer = this.props.getUrlParam(BUYINGREQ_CARD.type);
			this.props.cardTable.selectAllRows(BUYINGREQ_CARD.tableId, false);
			if (transfer || channelType) {
				this.props.form.setFormStatus(formId, BUYINGREQ_CARD.edit);
				setTimeout(() => {
					this.props.cardTable.setStatus(formId, BUYINGREQ_CARD.edit);
				}, 0);
				this.setState({
					lineShowType: [],
					status: BUYINGREQ_CARD.edit
				});
				this.indexstatus[this.state.index] = BUYINGREQ_CARD.edit;
				this.toggleShow();
			} else {
				props.pushTo(BUYINGREQ_CARD.cardUrl, {
					status: BUYINGREQ_CARD.edit,
					id: this.props.getUrlParam(BUYINGREQ_CARD.id),
					pagecode: BUYINGREQ_CARD.cardpageid
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
					vbillcode: props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.vbillcode).value,
					billId: props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_praybill).value
				});
				//修改组织的可编辑状态
				this.props.form.setFormItemsDisabled(BUYINGREQ_CARD.formId, { [BUYINGREQ_CARD.pk_org_v]: true });
				this.props.cardTable.selectAllRows(BUYINGREQ_CARD.tableId, false);
				this.toggleShow();
			}
		}
	});
}
