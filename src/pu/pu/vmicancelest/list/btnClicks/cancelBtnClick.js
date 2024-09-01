/*
 * @Author: zhangshqb 
 * @PageInfo: 选择否也就是同时取消货物暂估和费用暂估 
 * @Date: 2018-06-07 10:12:52 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-28 15:19:07
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, URL } from '../../constance';
import { base, toast } from 'nc-lightapp-front';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function cancelBtnClick(props) {
	this.onlyCancelFee = false;
	let index = this.props.editTable.getCheckedRows(PAGECODE.tableId);
	let indexs = index.map((item) => {
		return item.index;
	});
	// let data = this.props.insertEditTable.getCheckedRows(PAGECODE.tableId, PAGECODE.childTableId);
	let condata = index.map((item) => {
		let childData = item.data.childData;
		let fee = this.feeItems[item.data.values.pk_stockps_b.value];
		if (!item.data.childData || item.data.childData.length === 0) {
			if (fee && fee.po_vmi_fee) {
				childData = fee.po_vmi_fee.rows;
			}
		}
		return {
			head: {
				po_vmi: {
					areacode: PAGECODE.tableId,
					rows: [
						{
							values: item.data.values
						}
					]
				}
			},
			body: {
				po_vmi_fee: {
					areacode: PAGECODE.childTableId,
					rows: childData
				}
			}
		};
	});
	let urlpath = URL.cancelest;
	ajax({
		url: urlpath,
		data: { grids: condata, onlyCancelFee: this.onlyCancelFee },
		success: (res) => {
			let { success, data } = res;
			if (success) {
				this.props.editTable.deleteTableRowsByIndex(PAGECODE.tableId, indexs, true);
				this.props.editTable.focusRowByIndex(PAGECODE.tableId, 0);
				let data = this.props.editTable.getAllRows(PAGECODE.tableId);
				// this.props.editTable.setTableData(PAGECODE.childTableId, this.feeItem.po_vmi_fee);
				if (
					data &&
					data[0] &&
					data[0].values &&
					data[0].values.pk_stockps_b &&
					data[0].values.pk_stockps_b.value &&
					this.feeItems[data[0].values.pk_stockps_b.value] &&
					this.feeItems[data[0].values.pk_stockps_b.value].po_vmi_fee
				) {
					this.props.editTable.setTableData(
						PAGECODE.childTableId,
						this.feeItems[data[0].values.pk_stockps_b.value].po_vmi_fee
					);
				} else {
					this.props.editTable.setTableData(PAGECODE.childTableId, { rows: [] });
				}
				this.props.editTable.setStatus(PAGECODE.tableId, 'browse');
				toast({
					content: getLangByResId(this, '4004VMICANCELEST-000001'),
					color: 'success',
					position: 'topRight'
				}); /* 国际化处理： 取消暂估成功*/
				this.onSelect();
			}
		}
	});
}
