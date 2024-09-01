/*
 * @Author: zhangshqb
 * @PageInfo: 编辑后事件
 * @Date: 2018-05-26 11:25:08
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-06-15 17:22:57
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD } from '../../constance';
import { getDataByIndex } from '../../../pub/utils/getDataByIndex';

export default function(props, moduleId, key, value, changedrows, index, record) {
	if (changedrows.length == 1) {
		if ('onebillselect' != key && changedrows && changedrows[0].newvalue.value == changedrows[0].oldvalue.value) {
			return;
		}
	}

	if (moduleId === PAGECODE.tableId) {
		// props.cardTable.filterEmptyRows(PAGECODE.tableId);
		if (key == 'onebillselect') {
			let pk_stockps = record.values.pk_stockps.value;
			let indexs = [];
			let rows = props.editTable.getAllRows(PAGECODE.tableId);
			rows.forEach((item, index) => {
				if (item.values.pk_stockps.value == pk_stockps) {
					indexs.push(index);
				}
			});
			let datas = getDataByIndex(props, PAGECODE.tableId, indexs);
			let flag = false;
			let updatas = datas.map((item, index) => {
				if (!item.values.onebillselect) {
					item.values.onebillselect = {};
				}
				if (!record.values.onebillselect.value) {
					flag = true;
					item.values.onebillselect.display = false;
					item.values.onebillselect.isEdit = false;
					item.values.onebillselect.value = false;
				} else {
					flag = false;
					item.values.onebillselect.display = true;
					item.values.onebillselect.isEdit = false;
					item.values.onebillselect.value = true;
				}

				return {
					//index: item.key,
					index: indexs[index],
					data: item
				};
			});
			props.editTable.updateDataByIndexs(PAGECODE.tableId, updatas);
			this.forceUpdate();
			if (flag) {
				props.editTable.selectTableRows(PAGECODE.tableId, indexs, false);
			} else {
				props.editTable.selectTableRows(PAGECODE.tableId, indexs, true);
			}
			this.onSelect();
			return;
		}
		let head = {
			po_stockps: {
				areacode: 'po_stockps',
				rows: [
					{
						values: record.values
					}
				]
			}
		};
		let isonbillselect = false;
		if (record.values.onebillselect) {
			isonbillselect = record.values.onebillselect.value;
		}
		//货物行编辑后事件：
		let data = { key: key, header: head, value: value, changerows: changedrows, pagecode: PAGECODE.pagecode };
		ajax({
			url: URL.afteredit,
			data: data,
			method: 'POST',
			success: (res) => {
				if (res.data) {
					let resdata = res.data.po_stockps.rows[0];
					// resdata.values.onebillselect
					if (!resdata.values.onebillselect) {
						resdata.values.onebillselect = {};
					}
					if (!isonbillselect) {
						resdata.values.onebillselect.display = false;
						resdata.values.onebillselect.isEdit = false;
						resdata.values.onebillselect.value = false;
					} else {
						resdata.values.onebillselect.display = true;
						resdata.values.onebillselect.isEdit = false;
						resdata.values.onebillselect.value = true;
					}
					props.editTable.updateDataByIndexs(PAGECODE.tableId, [
						{
							index: index,
							data: resdata
						}
					]);
				}
				this.onSelect();
			}
		});
	} else if (moduleId === PAGECODE.childTableId) {
		// props.cardTable.filterEmptyRows(PAGECODE.childTableId);
		//费用行

		let fee = { po_stockps_fee: { areacode: 'po_stockps_fee', rows: [ { values: record.values } ] } };
		//货物行编辑后事件：
		let data = { key: key, fee: fee, value: value, changerows: changedrows };
		ajax({
			url: URL.feeAfterEdit,
			data: data,
			method: 'POST',
			success: (res) => {
				if (res.data) {
					let resdata = res.data.po_stockps_fee.rows[0];
					props.editTable.updateDataByIndexs(PAGECODE.childTableId, [
						{
							index: index,
							data: resdata
						}
					]);
				}
				this.onSelect();
			}
		});
	} else if (moduleId === PAGECODE.modaltablecode) {
		// props.editTable.filterEmptyRows(PAGECODE.modaltablecode);
		//费用分摊界面
		let body = {
			po_stockps_fee_modal: {
				areacode: 'po_stockps_fee_modal',
				rows: [
					{
						values: record.values
					}
				]
			}
		};

		let headrows = props.editTable.getCheckedRows(PAGECODE.tableId)[0].data.values;
		let head = { po_stockps: { areacode: 'po_stockps', rows: [ { values: headrows } ] } };
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
					let resdata = res.data.body.po_stockps_fee.rows[0];
					this.props.editTable.updateDataByIndexs(PAGECODE.modaltablecode, [
						{
							index: index,
							data: resdata
						}
					]);
				}
				this.onSelect();
			}
		});
	}
}
