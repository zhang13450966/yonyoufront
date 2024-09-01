/*
 * @Author: zhangshqb 
 * @PageInfo: 取消费用暂估  
 * @Date: 2018-06-26 11:42:21 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-28 15:18:44
 */
import { ajax, toast } from 'nc-lightapp-front';
import { PAGECODE, URL } from '../../constance';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function beSureBtnClick(props) {
	this.onlyCancelFee = true;
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
				this.props.editTable.setStatus(PAGECODE.childTableId, 'browse');
				this.props.editTable.setStatus(PAGECODE.tableId, 'browse');
				let checkdata = this.props.editTable.getCheckedRows(PAGECODE.tableId, PAGECODE.childTableId);
				// let heads = this.props.cardTable.getCheckedRows(PAGECODE.tableId);
				let indexs = checkdata.map((item) => {
					return item.index;
				});
				let resdata = data.headGrid.po_vmi.rows;
				let updatas = [];
				for (let i = 0; i < checkdata.length; i++) {
					let updata = {};
					updata.index = indexs[i];
					updata.data = resdata[i];
					updatas.push(updata);
				}
				this.props.editTable.updateDataByIndexs(PAGECODE.tableId, updatas);
				this.props.editTable.setTableData(PAGECODE.childTableId, { rows: [] });
				checkdata.forEach((item) => {
					this.feeItems[item.data.values.pk_stockps_b.value] = {};
				});
				toast({
					content: getLangByResId(this, '4004VMICANCELEST-000000'),
					color: 'success',
					position: 'topRight'
				}); /* 国际化处理： 取消费用暂估成功*/
			}
		}
	});
}
