/*
 * @Author: zhangshqb
 * @PageInfo: 暂估处理
 * @Date: 2018-05-26 11:17:41
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-05-03 19:18:06
 */
import { ajax, toast } from 'nc-lightapp-front';
import { PAGECODE, URL, LIST_BUTTON } from '../../constance';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
export default function estBtnClick(props) {
	//获取选中的货物行
	let data = this.props.editTable.getCheckedRows(PAGECODE.tableId);
	let edittableerror = true;
	let errMsg = '';
	if (data) {
		this.props.editTable.filterEmptyRows('po_stockps_fee', 'pk_supplier');
		//构造前后台传递的数据结构
		let condata = data.map((item) => {
			// 错误信息前缀 begin
			let name = item.data.values['pk_material.name'].display;
			let errPrefix = getLangByResId(this, '4004EST-000017');
			let errMsgIndex = `${name}${errPrefix}`;
			// 错误信息前缀 end
			let newChildData = [];
			let childData = item.data.childData;
			let fee = this.feeItems[item.data.values.pk_stockps_b.value];
			if (fee && fee.po_stockps_fee) {
				for (let i = 0; i < fee.po_stockps_fee.rows.length; i++) {
					if (fee.po_stockps_fee.rows[i].values.pk_supplier.value) {
						newChildData.push(fee.po_stockps_fee.rows[i]);
					}
				}
				childData = newChildData;
			}
			if (childData) {
				// edittableerror = this.props.editTable.checkRequired('po_stockps_fee', childData);
				// 校验必输项，因为table只可以校验页面显示的，页面显示不了的就校验不了了，所以这里自己处理
				childData.forEach((item) => {
					this.po_stockps_fee_mustCol.forEach((element) => {
						let value = item.values[element].value;
						if (value === undefined || value === null || value === NaN) {
							let colName = this.map.get(element); // 每个字段的label
							errMsgIndex = errMsgIndex + '[' + colName + '] ';
							edittableerror = false;
						}
					});
					errMsg = errMsg + errMsgIndex + '。 \n';
				});
			}
			return {
				head: {
					po_stockps: {
						areacode: 'po_stockps',
						rows: [
							{
								values: item.data.values
							}
						]
					}
				},
				body: {
					po_stockps_fee: {
						areacode: 'po_stockps_fee',
						rows: childData
					}
				}
			};
		});
		if (!edittableerror) {
			showErrorInfo(null, errMsg);
			return;
		}

		// let check = this.props.insertEditTable.getCheckedRows(PAGECODE.tableId, PAGECODE.childTableId);
		let index = data.map((item) => {
			return item.index;
		});
		// let data = { pagecode: PAGECODE.pagecode, estdata: mm };

		let urlpath = URL.estgoods;
		//0表示货物暂估，1表示费用暂估
		if (this.bfee == '1') {
			urlpath = URL.estfee;
		}
		ajax({
			url: urlpath,
			data: condata,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					this.props.editTable.deleteTableRowsByIndex(PAGECODE.tableId, index, true);
					this.props.editTable.deleteTableRowsByIndex(PAGECODE.childTableId, index, true);
					let rows = this.props.editTable.getAllRows(PAGECODE.tableId);
					let record;
					for (let i = 0; i < rows.length; i++) {
						if (rows[i].status != 3) {
							record = rows[i];
							break;
						}
					}
					if (record && record.values && this.feeItems[record.values.pk_stockps_b.value]) {
						let data = this.props.editTable.getAllRows(PAGECODE.childTableId);
						if (data && data[0] && data[0].values) {
							this.feeItems[data[0].values.pk_stockps_b.value].po_stockps_fee.rows = data;
						}
						this.props.editTable.setTableData(
							PAGECODE.childTableId,
							this.feeItems[record.values.pk_stockps_b.value].po_stockps_fee
						);
					}
					// this.props.editTable.setTableData(PAGECODE.childTableId, { rows: [] });
					toast({
						content: getLangByResId(this, '4004EST-000000'),
						color: 'success',
						position: 'topRight'
					}); /* 国际化处理： 暂估成功*/
					let buttonArry = [
						LIST_BUTTON.est,
						LIST_BUTTON.feeDistribute,
						LIST_BUTTON.hqhp,
						LIST_BUTTON.linkquery,
						LIST_BUTTON.print
					];
					props.button.setButtonDisabled(buttonArry, true);
				}
			}
		});
	}
}
