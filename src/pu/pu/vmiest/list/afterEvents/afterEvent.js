/*
 * @Author: zhangshqb 
 * @PageInfo: 编辑后事件  
 * @Date: 2018-06-26 11:38:21 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-28 15:19:51
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD } from '../../constance';

export default function(props, moduleId, key, value, changedrows, record, index) {
	if (changedrows.length == 1) {
		if (changedrows && changedrows[0].newvalue.value == changedrows[0].oldvalue.value) {
			return;
		}
	}

	if (moduleId === PAGECODE.tableId) {
		props.editTable.filterEmptyRows(PAGECODE.tableId);
		let head = {
			po_vmi: {
				areacode: 'po_vmi',
				rows: [
					{
						values: index.values
					}
				]
			}
		};
		//货物行编辑后事件：
		let data = { key: key, header: head, value: value, changerows: changedrows, pagecode: PAGECODE.pagecode };
		ajax({
			url: URL.afteredit,
			data: data,
			method: 'POST',
			success: (res) => {
				if (res.data) {
					let resdata = res.data.po_vmi.rows[0];
					props.editTable.updateDataByIndexs(PAGECODE.tableId, [
						{
							index: record,
							data: resdata
						}
					]);
				}
				this.onSelect();
			}
		});
	} else if (moduleId === PAGECODE.childTableId) {
		props.editTable.filterEmptyRows(PAGECODE.childTableId);
		//费用行

		let fee = { po_vmi_fee: { areacode: 'po_vmi_fee', rows: [ { values: index.values } ] } };
		//货物行编辑后事件：
		let data = { key: key, fee: fee, value: value, changerows: changedrows };
		ajax({
			url: URL.feeAfterEdit,
			data: data,
			method: 'POST',
			success: (res) => {
				if (res.data) {
					let resdata = res.data.po_vmi_fee.rows[0];
					props.editTable.updateDataByIndexs(PAGECODE.childTableId, [
						{
							index: record,
							data: resdata
						}
					]);
				}
				this.onSelect();
			}
		});
	} else if (moduleId === PAGECODE.modaltablecode) {
		props.editTable.filterEmptyRows(PAGECODE.modaltablecode);
		//费用分摊界面
		let body = {
			po_vmi_fee_modal: {
				areacode: 'po_vmi_fee_modal',
				rows: [
					{
						values: index.values
					}
				]
			}
		};

		let headrows = props.editTable.getCheckedRows(PAGECODE.tableId)[0].data.values;
		let head = { po_vmi: { areacode: 'po_vmi', rows: [ { values: headrows } ] } };
		//编辑后事件：
		let data = {
			itemKey: key,
			body: body,
			head: head,
			value: value,
			changerows: changedrows,
			pagecode: PAGECODE.pagecode
		};
		ajax({
			url: URL.feeAfterEdit,
			data: data,
			method: 'POST',
			success: (res) => {
				if (res.data) {
					let resdata = res.data.body.po_vmi_fee.rows[0];
					this.props.editTable.updateDataByIndexs(moduleId, [
						{
							index: record,
							data: resdata
						}
					]);
				}
				this.onSelect();
			}
		});
	}
}
