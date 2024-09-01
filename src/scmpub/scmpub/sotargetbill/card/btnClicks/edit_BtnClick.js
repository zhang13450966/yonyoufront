/*
 * @Author: cuijun 
 * @PageInfo: 修改按钮事件  
 * @Date: 2018-05-14 21:36:49 
 * @Last Modified by: huoyzh
 * @Last Modified time: 2020-11-18 09:56:30
 */
import buttonController from '../viewController/buttonController';
import { TARGETBILL_CONST, FIELD } from '../../const';
import { ajax } from 'nc-lightapp-front';

export default function clickEditBtn(props) {
	let bill = props.createMasterChildDataSimple(
		TARGETBILL_CONST.cardPageId,
		TARGETBILL_CONST.formId,
		TARGETBILL_CONST.tableId
	);
	this.oldformdata = props.form.getAllFormValue(TARGETBILL_CONST.formId);
	// this.oldtabledata = props.cardTable.getAllRows(TARGETBILL_CONST.tableId);
	this.oldtabledata = props.cardTable.getAllData(TARGETBILL_CONST.tableId);
	this.oldbilldata = bill;
	let pk_org = (props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.pk_org) || {}).value;
	let pks = [ (props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.ctargetid) || {}).value ];
	let data = {
		pks: pks,
		pk_org: pk_org,
		card: bill,
		pageid: TARGETBILL_CONST.cardPageId
	};
	ajax({
		url: TARGETBILL_CONST.editUrl,
		data: data,
		success: (res) => {
			if (res.success) {
				this.lastId = this.props.getUrlParam(TARGETBILL_CONST.id);
				props.setUrlParam({
					status: TARGETBILL_CONST.edit,
					id: this.props.getUrlParam(TARGETBILL_CONST.id)
				});

				this.meta[TARGETBILL_CONST.tableId].items.forEach((item) => {
					if (item.attrcode == 'opr') {
						item.visible = true;
					}
				});
				let bodydata = props.cardTable.getAllRows(TARGETBILL_CONST.tableId);
				if (bodydata.length == 0) {
					this.props.cardTable.addRow(TARGETBILL_CONST.tableId, null, {});
				}
				buttonController.call(this);
				// 去除复选框的打钩
				props.cardTable.selectAllRows(TARGETBILL_CONST.tableId, false);
			}
		}
	});
}
