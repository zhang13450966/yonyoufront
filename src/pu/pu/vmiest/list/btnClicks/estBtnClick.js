/*
 * @Author: zhangshqb
 * @PageInfo: 暂估处理
 * @Date: 2018-06-26 11:37:29
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-02-11 09:22:33
 */
import { ajax, toast } from 'nc-lightapp-front';
import { PAGECODE, URL, LIST_BUTTON } from '../../constance';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function estBtnClick(props) {
	let data = this.props.editTable.getCheckedRows(PAGECODE.tableId);
	if (data) {
		let condata = data.map(item => {
			let childData = item.data.childData;
			let fee = this.feeItems[item.data.values.pk_stockps_b.value];
			if (fee && fee.po_vmi_fee) {
				childData = fee.po_vmi_fee.rows;
			}
			return {
				head: {
					po_stockps: {
						areacode: 'po_vmi',
						rows: [
							{
								values: item.data.values,
							},
						],
					},
				},
				body: {
					po_stockps_fee: {
						areacode: 'po_vmi_fee',
						rows: childData,
					},
				},
			};
		});

		// let check = this.props.insertEditTable.getCheckedRows(PAGECODE.tableId, PAGECODE.childTableId);
		let index = data.map(item => {
			return item.index;
		});

		let urlpath = URL.estgoods;
		//0表示货物暂估，1表示费用暂估
		if (this.bfee == '1') {
			urlpath = URL.estfee;
		}
		ajax({
			url: urlpath,
			data: condata,
			success: res => {
				let { success, data } = res;
				if (success) {
					this.props.editTable.deleteTableRowsByIndex(PAGECODE.tableId, index, true);
					// this.props.editTable.setTableData(PAGECODE.childTableId, { rows: [] });
					this.props.editTable.focusRowByIndex(PAGECODE.tableId, 0);
					let data = this.props.editTable.getAllRows(PAGECODE.tableId);
					// this.props.editTable.setTableData(PAGECODE.childTableId, this.feeItem.po_vmi_fee);
					if (
						data &&
						data[0] &&
						data.length > 0 &&
						data[0].values &&
						data[0].values.pk_stockps_b &&
						this &&
						this.feeItems &&
						this.feeItems[data[0].values.pk_stockps_b.value]
					) {
						this.props.editTable.setTableData(
							PAGECODE.childTableId,
							this.feeItems[data[0].values.pk_stockps_b.value].po_vmi_fee
						);
					} else {
						this.props.editTable.setTableData(PAGECODE.childTableId, { rows: [] });
					}

					toast({
						content: getLangByResId(this, '4004VMIEST-000000'),
						color: 'success',
						position: 'topRight',
					}); /* 国际化处理： 暂估成功*/
					let buttonArry = [
						LIST_BUTTON.est,
						LIST_BUTTON.feeDistribute,
						LIST_BUTTON.linkQuery,
						LIST_BUTTON.print,
					];
					props.button.setButtonDisabled(buttonArry, true);
					this.onSelect();
				}
			},
		});
	}
}
