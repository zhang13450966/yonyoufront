/*
 * @Author: zhangchangqing 
 * @PageInfo: 修改按钮事件
 * @Date: 2018-04-19 10:35:28 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:26:59
 */
import pageInfoClick from './pageInfoClick';
import { STOREREQ_CARD, ATTRCODE, STOREREQ_LIST } from '../../siconst';
import { ajax } from 'nc-lightapp-front';
import { buttonController } from '../viewControl';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { addCacheData, updateCacheData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
export default function clickEditBtn(props) {
	let formId = STOREREQ_CARD.formId;
	let pk_storereq = this.props.form.getFormItemsValue(formId, ATTRCODE.pk_storereq).value;
	changeUrlParam(props, { status: STOREREQ_CARD.edit, id: pk_storereq, copy: false, option: 'edit' });
	let data = { keyword: pk_storereq, pageid: STOREREQ_CARD.cardpageid, type: STOREREQ_CARD.card };

	ajax({
		url: STOREREQ_CARD.editCardInfoURL,
		data: data,
		success: (res) => {
			//拉单标识
			let transfer = this.props.getUrlParam(STOREREQ_CARD.type);
			this.props.cardTable.selectAllRows(STOREREQ_CARD.tableId, false);
			if (transfer) {
				this.props.form.setFormStatus(formId, STOREREQ_CARD.edit);
				setTimeout(() => {
					this.props.cardTable.setStatus(formId, STOREREQ_CARD.edit);
				}, 0);
				this.setState({
					lineShowType: [],
					status: STOREREQ_CARD.edit
				});
				this.indexstatus[this.state.index] = STOREREQ_CARD.edit;
				this.toggleShow();
			} else {
				props.pushTo(STOREREQ_CARD.cardUrl, {
					status: STOREREQ_CARD.edit,
					id: this.props.getUrlParam(STOREREQ_CARD.id),
					option: 'edit',
					pagecode: STOREREQ_CARD.cardpageid
				});
				buttonController.setCardPaginationVisible(this.props, false); //设置翻页不显示
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(res.formulamsg);
				}
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
					vbillcode: props.form.getFormItemsValue(formId, ATTRCODE.vbillcode).value,
					billId: props.form.getFormItemsValue(formId, ATTRCODE.pk_storereq).value
				});
				// 设置按钮可用性
				//this.isActionEnable();
				//修改组织的可编辑状态
				this.props.form.setFormItemsDisabled(formId, { [STOREREQ_CARD.pk_org_v]: true });
				this.props.cardTable.selectAllRows(STOREREQ_CARD.tableId, false);
				this.toggleShow();
			}
		}
	});
}
