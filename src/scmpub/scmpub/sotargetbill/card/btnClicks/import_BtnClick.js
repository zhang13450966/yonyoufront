/*
 * @Author: sunxxf 
 * @PageInfo: 销售指标维护导入 
 * @Date: 2020-03-18 13:47:21 
 * @Last Modified by: wangpju
 * @Last Modified time: yyyy-09-Sa 02:28:02
 */
import { TARGETBILL_CONST, BUTTONS, FIELD } from '../../const/const';
import { showErrorInfo } from '../../../pub/tool/messageUtil';
import targetBillTableHeadUtil from '../../utils/targetBillTableHeadUtil';
import buttonController from '../viewController/buttonController';
import { deepClone } from '../../../pub/tool';
export default function clickIxportBtn(props) {
	let pk_org = (props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.pk_org) || {}).value;
	let ctargetid = (props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.ctargetid) || {}).value;
	let bill = props.createMasterChildDataSimple(
		TARGETBILL_CONST.cardPageId,
		TARGETBILL_CONST.formId,
		TARGETBILL_CONST.tableId
	);
	this.oldformdata = props.form.getAllFormValue(TARGETBILL_CONST.formId);
	this.oldtabledata = props.cardTable.getAllRows(TARGETBILL_CONST.tableId);
	this.oldbilldata = bill;
	let tabledata = this.props.cardTable.getAllRows(TARGETBILL_CONST.tableId);

	const config = {
		action: TARGETBILL_CONST.importexcelUrl,
		headers: {
			authorization: 'authorization-text'
		},
		data: {
			pk_org: pk_org,
			ctargetid: ctargetid
		},
		onChange: (info) => {
			const status = info.file.status;
			let response = info.file.response;
			if (status === 'done') {
				if (response.success) {
					//设置表格编辑态
					props.cardTable.setStatus(TARGETBILL_CONST.tableId, TARGETBILL_CONST.edit);
					//返回数据VO
					let { data, extra } = response.data;
					if (data) {
						let multiData = {
							bodyDownCloumsYear: data.retmap.bodyDownCloumsYear,
							bodyDownCloumsOther: data.retmap.bodyDownCloumsOther,
							bodyUpCloumsOther: data.retmap.bodyUpCloumsOther,
							bodyUpCloumsYear: data.retmap.bodyUpCloumsYear,
							formId: TARGETBILL_CONST.formId,
							tableId: TARGETBILL_CONST.tableId,
							headCloum: data.retmap.headCloum
							// multiData: data.multiData
						};
						targetBillTableHeadUtil.call(this, this.props, multiData);

						let vperiodValue = {};
						let cmardimenidValue = {};
						if (data.retcard) {
							data.retcard.head[TARGETBILL_CONST.formId].rows.forEach((row) => {
								vperiodValue = row.values.vperiod;
								cmardimenidValue = row.values.cmardimenid;
							});
						}
						if (vperiodValue) {
							this.props.form.setFormItemsValue(TARGETBILL_CONST.formId, {
								vperiod: { value: vperiodValue.value, display: vperiodValue.display }
							});
						} else if (cmardimenidValue) {
							this.props.form.setFormItemsValue(TARGETBILL_CONST.formId, {
								cmardimenid: { value: cmardimenidValue.value, display: cmardimenidValue.display }
							});
						}
						// let tabledata = this.props.cardTable.getAllRows(TARGETBILL_CONST.tableId);
						let customerid = {};
						//界面数据index
						let oldrowindex = [];
						for (let i = 0; i < tabledata.length; i++) {
							oldrowindex.push(i);
							let customervalue = tabledata[i].values.ccustomerid.value;
							if (customervalue) {
								customerid[customervalue] = tabledata[i].rowid;
							}
						}
						// tabledata.map((row) => {
						// 	let customervalue = row.values.ccustomerid.value;
						// 	oldrowindex.push()
						// 	if (customervalue) {
						// 		customerid[customervalue] = row.rowid;
						// 	}
						// });
						let newRows = [];
						for (let i = 0; i < tabledata.length; i++) {
							tabledata[i].status = '1';
							newRows.push(tabledata[i]);
						}
						if (data.retcard) {
							if (data.retcard.body && data.retcard.body[TARGETBILL_CONST.tableId]) {
								for (let i = 0; i < data.retcard.body[TARGETBILL_CONST.tableId].rows.length; i++) {
									data.retcard.body[TARGETBILL_CONST.tableId].rows[i].status = '2';
									newRows.push(data.retcard.body[TARGETBILL_CONST.tableId].rows[i]);
								}

								// data.retcard.body[TARGETBILL_CONST.tableId].rows.forEach((item) => {
								// if (customerid[item.values.ccustomerid.value]) {
								// 	item.rowid = customerid[item.values.ccustomerid.value];
								// } else {
								// 	this.props.cardTable.addRow(TARGETBILL_CONST.tableId, null, item.values);
								// }
								// });
								// this.props.cardTable.updateDataByRowId(TARGETBILL_CONST.tableId, data.retcard.body[TARGETBILL_CONST.tableId]);
							}
						}

						let rows = {
							rows: newRows
						};
						// let body = {
						// 	[TARGETBILL_CONST.tableId]: rows
						// };
						props.cardTable.setTableData(TARGETBILL_CONST.tableId, rows, null, false);
						// props.cardTable.updateTableData(TARGETBILL_CONST.tableId, rows);
						props.setUrlParam({
							status: TARGETBILL_CONST.edit
							// id: this.props.getUrlParam(TARGETBILL_CONST.id)
						});
						buttonController.call(this);
					}
				} else {
					showErrorInfo(response.error.message);
				}
			}
		}
	};
	props.button.setUploadConfig(BUTTONS.IMPORTEXCEL, config);
}
