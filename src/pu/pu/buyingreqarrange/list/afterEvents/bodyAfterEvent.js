/*
 * @Author: zhangchangqing 
 * @PageInfo: 表体编辑后事件  
 * @Date: 2018-05-03 14:38:54 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-06-30 09:56:15
 */

import { ajax, base, toast } from 'nc-lightapp-front';
//import { AREA, UISTATE, FIELD, URL } from '../../constance';
import { ATTRCODE, ATTRCODES, BUYINGREQ_LIST } from '../../siconst';
import { updateGridDataForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
const { NCMessage } = base;
let formId = BUYINGREQ_LIST.formId;
export default function afterEvent(props, moduleId, key, value, index, record) {
	//采购组织，采购员,供应商
	//if (key === ATTRCODES.pk_purchaseorg_v || key === ATTRCODES.pk_employee || key === ATTRCODES.pk_suggestsupplier) {
	let editRow = [];
	let allRows = props.editTable.getAllRows(formId, true);
	let _index = index;
	editRow[0] = allRows[index];
	let data = {};
	if (key === ATTRCODES.pk_purchaseorg_v) {
		//过滤空行
		if (allRows != undefined) {
			let formData = {
				areacode: formId,
				areaType: 'table',
				rows: editRow
			};
			data.grid = {
				pageid: BUYINGREQ_LIST.listpageid,
				model: formData
			};
		}
		data.attrcode = key;
		data.index = 0;
		ajax({
			url: BUYINGREQ_LIST.bodyAfterEditURL,
			data: data,
			method: 'POST',
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data === undefined) {
						props.editTable.setTableData(formId, { rows: [] });
					} else {
						updateGridDataForCompareByPk(this.props, data, BUYINGREQ_LIST.config);
					}
				}
			}
		});
	} else if (key == 'pk_praybill_b.pk_purchaseorg_v') {
		//批量安排的采购组织编辑后需要采购组织oid

		//过滤空行
		let pk_purchaseorg_v = {
			value: null,
			display: null,
			scale: '-1'
		};
		let pk_purchaseorg = {
			value: null,
			display: null,
			scale: '-1'
		};
		pk_purchaseorg_v.value = value.refpk;
		pk_purchaseorg_v.display = value.refname;
		//props.editTable.setValByKeyAndIndex(formId, index, 'pk_purchaseorg_v', pk_purchaseorg_v);
		//let checkData = props.editTable.getCheckedRows(formId);
		editRow[0].values.pk_purchaseorg_v = pk_purchaseorg_v;
		//清空oid,避免差异更新返回没有数据
		editRow[0].values.pk_purchaseorg = pk_purchaseorg;
		if (allRows != undefined) {
			let formData = {
				areacode: formId,
				areaType: 'table',
				rows: editRow
			};
			data.grid = {
				pageid: BUYINGREQ_LIST.listpageid,
				model: formData
			};
		}
		data.attrcode = ATTRCODES.pk_purchaseorg_v;
		data.index = 0;
		ajax({
			url: BUYINGREQ_LIST.bodyAfterEditURL,
			data: data,
			method: 'POST',
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data === undefined) {
						props.editTable.setTableData(formId, { rows: [] });
					} else {
						let pk_purchaseorg = {
							value: data[formId].rows[0].values.pk_purchaseorg.value,
							display: data[formId].rows[0].values.pk_purchaseorg.display,
							scale: '-1'
						};
						this.setState({
							pk_suggestsupplier_v: {},
							employee: {},
							pk_purchaseorg: pk_purchaseorg
						});
					}
				}
			}
		});
	}
}
