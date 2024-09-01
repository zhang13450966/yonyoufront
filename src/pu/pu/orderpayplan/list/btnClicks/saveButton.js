/*
 * @Author: CongKe 
 * @PageInfo: 采购订单付款计划保存
 * @Date: 2018-06-11 19:59:12 
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-05-23 14:33:29
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD, STATUS } from '../../constance';
import { showErrorInfo, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewController/index';
import { simplifyData, simplifyDataByFields } from '../../../../../scmpub/scmpub/pub/tool/simplifyDataUtil';

export default function saveButton(props) {
	props.editTable.filterEmptyRows(PAGECODE.tableId);
	//创建保存的VO
	//暂时修改为changedrow
	let allRows = props.editTable.getChangedRows(PAGECODE.tableId, true);
	// 简化allRows
	let simpleDate = simplifyData({ rows: allRows });
	allRows = simpleDate.rows;
	// 获取有更改的行
	//let changedRows = props.editTable.getChangedRows(PAGECODE.tableId, true);
	//let changedRowsRowid_PkMap = {};
	//创建rowid和主键的映射
	// changedRows.map((row) => {
	// 	changedRowsRowid_PkMap[row.values.pk_order_payplan.value] = row.rowid;
	// });
	let data = {};
	let pseudoccolumns = []; //rowId数组
	let pseudocindex = 0; //记录rowID的下标，存在伪列里
	allRows.forEach((row, index) => {
		if (row.status != '3') {
			pseudoccolumns.push(row.rowid);
			row.values.pseudocolumn = { value: '' + pseudocindex };
			pseudocindex++;
			if (row.values.iitermdays) {
				row.values.iitermdays.value = isNaN(row.values.iitermdays.value) ? '' : row.values.iitermdays.value;
				row.values.iitermdays.value = row.values.iitermdays.value + '';
			}
		}
	});
	if (allRows != undefined) {
		let model = {
			areacode: PAGECODE.tableId,
			areaType: 'table',
			rows: allRows
		};
		data = {
			pageid: PAGECODE.listcode,
			model: model
		};
	}
	delete data.attrcode;
	props.validateToSave(data, () => {
		ajax({
			method: 'post',
			url: URL.save,
			data: data,
			success: (res) => {
				let { success, data, error, message } = res;
				if (error) {
					showErrorInfo('', getLangByResId(this, '4004OPAYPLAN-000012')); /* 国际化处理： 保存失败*/
					return;
				}
				if (success) {
					// 卡片界面，在浏览态时勾选行，点修改后去掉勾选
					props.beforeUpdatePage();
					this.setState({ status: STATUS.browse });
					if (data) {
						// 给返回的数据添加rowid
						data[PAGECODE.tableId].rows.map((row) => {
							let index = row.values.pseudocolumn && row.values.pseudocolumn.value;
							row.rowid = pseudoccolumns[index];
						});
						// data[PAGECODE.tableId].rows.map((row) => {
						// 	row.index = row.values.pseudocolumn;
						// });
						// 更新数据
						props.editTable.updateTableData(PAGECODE.tableId, data[PAGECODE.tableId]);
					}
					this.props.editTable.selectAllRows(PAGECODE.tableId, false);
					this.setState({ status: STATUS.browse });
					buttonController.cancelBtn.call(this);
					buttonController.togglePageShow.call(this, props, STATUS.browse);
					props.updatePage(PAGECODE.tableId);
					showSuccessInfo('', getLangByResId(this, '4004OPAYPLAN-000013')); /* 国际化处理： 保存成功!*/
				}
			}
		});
	});
}
