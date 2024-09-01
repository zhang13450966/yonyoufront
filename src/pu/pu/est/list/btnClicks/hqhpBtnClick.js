/*
 * @Author: zhangshqb 
 * @PageInfo: 优质优价取价  
 * @Date: 2018-05-26 11:21:52 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-10-27 14:29:40
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE } from '../../constance';
export default function hqhpBtnClick(props) {
	//构造数据集
	let data = this.props.editTable.getCheckedRows(PAGECODE.tableId);
	let index = data.map((item) => {
		return item.index;
	});
	let pkrowid = new Map();
	let purchaseinbids = data.map((item) => {
		pkrowid.set(item.data.values.pk_stockps_b.value, item.data.rowid);
		return item.data.values.pk_stockps_b.value;
	});
	let heads = data.map((item) => {
		return { po_stockps: { rows: [ { values: item.data.values } ] } };
	});
	let condata = { pagecode: PAGECODE.pagecode, purchaseinbids: purchaseinbids, heads: heads };
	ajax({
		url: URL.hqhp,
		data: condata,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data) {
					let heads = this.props.editTable.getCheckedRows(PAGECODE.tableId);
					let indexs = heads.map((item) => {
						return item.index;
					});
					let resdata = data.headGrid.po_stockps.rows;
					let updatas = [];
					for (let i = 0; i < heads.length; i++) {
						let updata = {};
						updata.index = indexs[i];
						updata.data = resdata[i];
						updata.rowid = pkrowid.get(resdata[i].values.pk_stockps_b.value);
						updatas.push(updata);
					}
					this.props.editTable.updateDataByIndexs(PAGECODE.tableId, updatas);
					this.props.editTable.setStatus(PAGECODE.tableId, 'edit');
				} else {
				}
			}
		}
	});
}
