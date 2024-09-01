/*
 * @Author: 王龙华 
 * @PageInfo: 保存按钮事件 
 * @Date: 2018-04-11 15:41:12 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-03-17 17:20:32
 */
import { ajax } from 'nc-lightapp-front';
import { INVSOURCE_CONST } from '../../const';
import { showErrorInfo, showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getChangedRows, updateEditTableRows } from '../../../pub/tool/editTableTools';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import buttonController from '../../list/viewController/buttonController';

export default function saveBtnClick(props) {
	// 过滤空行
	props.editTable.filterEmptyRows(INVSOURCE_CONST.TABLEID, [ 'pk_marbasclass.name' ]);
	// 校验必输项
	let allData = props.editTable.getAllRows(INVSOURCE_CONST.TABLEID, true);
	let msg = props.editTable.checkRequired(INVSOURCE_CONST.TABLEID, allData);
	if (!msg) {
		return;
	}

	let changedRows = props.editTable.getChangedRows(INVSOURCE_CONST.TABLEID, true);
	if (changedRows.length == 0) {
		buttonController.call(this, props, INVSOURCE_CONST.BROWSER_STATUS);
		showSuccessInfo(getLangByResId(this, '4001INVSOURCE-000014')); /* 国际化处理： 保存成功*/
		return;
	}
	// 前台校验需求库存组织和物料基本分类在当前界面所有数据中不能存在重复
	if (allData && allData.length > 1) {
		let allDatamap = {};
		let index = 1;
		let errormsg = '';
		allData.forEach((everyRow) => {
			let key = everyRow.values.pk_stockorgreq.value + everyRow.values.pk_marbasclass.value;
			if (allDatamap[key] == undefined && everyRow.status != '3') {
				allDatamap[key] = index;
			} else if (everyRow.status != '3') {
				errormsg +=
					getLangByResId(this, '4001INVSOURCE-000009') /* 国际化处理： 第*/ +
					allDatamap[key] +
					getLangByResId(this, '4001INVSOURCE-000010') /* 国际化处理： 行：{需求库存组织：*/ +
					everyRow.values.pk_stockorgreq.display +
					getLangByResId(this, '4001INVSOURCE-000011') /* 国际化处理： ，物料基本分类编码：*/ +
					everyRow.values.pk_marbasclass.display +
					getLangByResId(this, '4001INVSOURCE-000012') /* 国际化处理： }与第*/ +
					index +
					getLangByResId(this, '4001INVSOURCE-000013'); /* 国际化处理： 行数据重复，请修改后再保存。\n*/
			}
			index++;
		});
		if (errormsg != '') {
			showErrorInfo(null, errormsg);
			return;
		}
	}

	let rows = getChangedRows(props, INVSOURCE_CONST.TABLEID, true);
	let data = {
		pageid: INVSOURCE_CONST.PAGECODE,
		table: {
			areaType: INVSOURCE_CONST.AREATYPE,
			pageinfo: null,
			rows: rows,
			areacode: INVSOURCE_CONST.TABLEID
		}
	};

	props.validateToSave(data, () => {
		ajax({
			url: INVSOURCE_CONST.SAVE_URL,
			data,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				showSuccessInfo(getLangByResId(this, '4001INVSOURCE-000014')); /* 国际化处理： 保存成功*/
				if (res.data === undefined || !res.data) {
					props.editTable.setTableData(INVSOURCE_CONST.TABLEID, { rows: [] });
				} else {
					let allrows = props.editTable.getAllRows(INVSOURCE_CONST.TABLEID);
					let updRows = res.data[INVSOURCE_CONST.TABLEID].rows;
					let newrows = [];
					let delRows = [];
					updRows.forEach((row) => {
						row.index = Number(row.values.pseudocolumn.value);

						//delRows.set(row.rowid,row.status)
						//delRows[row.values.pseudocolumn] = row.status;
						if (row.status == 3) {
							delRows.push(row.rowid);
						}
					});
					if (delRows.length > 0) {
						props.editTable.deleteTableRowsByRowId(INVSOURCE_CONST.TABLEID, delRows, true);
					}
					//props.editTable.updateDataByIndexs(INVSOURCE_CONST.TABLEID, updRows, true, true);
					// allrows.forEach((row) => {
					// 	if(delRows.get(row.rowid) && delRows.get(row.rowid) != 3) {
					// 		newrows.push(row);
					// 	}
					// })
					//props.editTable.updateTableData(INVSOURCE_CONST.TABLEID,{rows:newrows});
					updateEditTableRows(props, INVSOURCE_CONST.TABLEID, res.data[INVSOURCE_CONST.TABLEID].rows);
				}
				buttonController.call(this, props, INVSOURCE_CONST.BROWSER_STATUS);
			}
		});
	});
}
