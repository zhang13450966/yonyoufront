/*
 * @Author: zhangshqb 
 * @PageInfo: 提示框手工关闭时默认按照选择否处理  
 * @Date: 2018-06-07 10:13:55 
 * @Last Modified by: zhangshqb
 * @Last Modified time: 2018-06-07 10:14:20
 */
import { PAGECODE, URL } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function closeModalEve(props) {
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
			if (typeof fee != 'undefined') {
				childData = fee.po_stockps_fee.rows;
			}
		}
		return {
			head: {
				po_stockps: {
					areacode: PAGECODE.tableId,
					rows: [
						{
							values: item.data.values
						}
					]
				}
			},
			body: {
				po_stockps_fee: {
					areacode: PAGECODE.childTableId,
					rows: childData
				}
			}
		};
	});
	let urlpath = URL.cancelest;
	const { Message } = base;
	ajax({
		url: urlpath,
		data: { grids: condata, onlyCancelFee: this.onlyCancelFee },
		success: (res) => {
			let { success, data } = res;
			if (success) {
				this.props.editTable.deleteTableRowsByIndex(PAGECODE.tableId, indexs);
				this.props.editTable.setTableData(PAGECODE.childTableId, { rows: [] });
				toast({
					content: getLangByResId(this, '4004CANCELEST-000001'),
					color: 'success',
					position: 'topRight'
				}); /* 国际化处理： 取消暂估成功*/
				this.onSelect();
			}
		}
	});
}
