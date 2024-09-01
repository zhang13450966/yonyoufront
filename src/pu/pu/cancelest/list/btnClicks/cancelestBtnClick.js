/*
 * @Author: zhangshqb 
 * @PageInfo: 取消暂估  
 * @Date: 2018-06-07 10:11:59 
 * @Last Modified by: zhangshqb
 * @Last Modified time: 2018-07-18 15:44:41
 */
import { ajax, toast } from 'nc-lightapp-front';
import { PAGECODE, URL } from '../../constance';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function cancelestBtnClick(props) {
	let data = this.props.editTable.getCheckedRows(PAGECODE.tableId);
	let isShowModal = false;
	let condata = data.map((item) => {
		let childData = item.data.childData;
		let fee = this.feeItems[item.data.values.pk_stockps_b.value];
		if (!item.data.childData || item.data.childData.length === 0) {
			if (typeof fee != 'undefined' && fee.po_stockps_fee) {
				childData = fee.po_stockps_fee.rows;
			}
		}
		if (!(fee && fee.po_stockps_fee)) {
			childData = [];
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
	for (var i = 0; i < condata.length; i++) {
		if (condata[i].body.po_stockps_fee.rows && condata[i].body.po_stockps_fee.rows.length !== 0) {
			// this.props.modal.show(PAGECODE.modalid);
			isShowModal = true;
			break;
		}
	}
	if (isShowModal) {
		this.props.modal.show(PAGECODE.modalid);
	} else {
		// let check = this.props.insertEditTable.getCheckedRows(PAGECODE.tableId, PAGECODE.childTableId);
		let index = data.map((item) => {
			return item.index;
		});
		let urlpath = URL.cancelest;
		ajax({
			url: urlpath,
			data: {
				grids: condata,
				onlyCancelFee: false,
				pagecode: PAGECODE.pagecode
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					this.props.editTable.deleteTableRowsByIndex(PAGECODE.tableId, index);
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
}
