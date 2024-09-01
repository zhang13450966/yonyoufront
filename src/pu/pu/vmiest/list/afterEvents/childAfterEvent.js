/*
 * @Author: zhangshqb 
 * @PageInfo: 费用项编辑后事件  
 * @Date: 2018-06-20 11:25:35 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-06-30 14:50:29
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD } from '../../constance';

export default function(props, moduleId, key, value, changedrows, index, record) {
	if (changedrows.length == 1 && key != FIELD.pk_supplier_v) {
		if (changedrows && changedrows[0].newvalue.value == changedrows[0].oldvalue.value) {
			return;
		}
	}
	//费用
	let bodyrows = this.props.editTable.getAllRows(moduleId);
	bodyrows[index] = record;
	let body = { po_vmi_fee: { areacode: 'po_vmi_fee', rows: bodyrows } };
	let headrows = this.props.editTable.getClickRowIndex(PAGECODE.tableId);
	if (!headrows) {
		headrows = {};
		headrows.record = this.props.editTable.getAllRows(PAGECODE.tableId)[0];
		headrows.index = 0;
	} else {
		headrows.record = this.props.editTable.getAllRows(PAGECODE.tableId)[headrows.index];
	}
	// let headrows = props.cardTable.getCheckedRows(PAGECODE.tableId, PAGECODE.childTableId)[0].data.values;
	let head = { po_vmi: { areacode: 'po_vmi', rows: [ { values: headrows.record.values } ] } };
	//编辑后事件：
	let data = {
		itemKey: key,
		body: body,
		head: head,
		value: value,
		changerows: changedrows,
		pagecode: PAGECODE.pagecode,
		index: index
	};
	ajax({
		url: URL.feeAfterEdit,
		data: data,
		method: 'POST',
		success: (res) => {
			if (res.data) {
				let resdata = res.data.body.po_vmi_fee.rows[index];
				// let redstockps = res.data.body.po_stockps_fee.rows[0];
				// this.props.editTable.updateDataByIndexs(moduleId, [
				// 	{
				// 		index: index,
				// 		data: resdata
				// 	}
				// ]);
				this.feeItems[resdata.values.pk_stockps_b.value].po_vmi_fee.rows[index] = resdata;
				let resstockpsdata = res.data.head.po_vmi.rows[0];

				this.props.editTable.updateDataByIndexs(PAGECODE.tableId, [
					{
						index: headrows.index,
						data: resstockpsdata
					}
				]);
				// 放在上面的话好像会导致下表的聚焦问题，导致再无法录入数据，放在下面好像就好了。。。
				this.props.editTable.updateDataByIndexs(moduleId, [
					{
						index: index,
						data: resdata
					}
				]);
			}
		}
	});
}
